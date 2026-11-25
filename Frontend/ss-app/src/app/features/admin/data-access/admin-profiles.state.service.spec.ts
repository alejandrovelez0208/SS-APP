import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Observable, Subject, of, throwError } from 'rxjs';
import {
  AdminProfileDetailDto,
  AdminProfileSummaryDto,
} from '../models/admin-profile.dto';
import {
  AdminProfileSummary,
  ProfileState,
} from '../models/admin-profile.model';
import { AdminProfilesApiService } from './admin-profiles-api.service';
import { AdminProfilesStateService } from './admin-profiles.state.service';

interface ApiMock {
  getAll: () => Observable<AdminProfileSummaryDto[]>;
  getById: (id: string) => Observable<AdminProfileDetailDto>;
  updateStatus: (id: string, status: ProfileState) => Observable<AdminProfileSummaryDto>;
}

function summaryDto(
  id: number,
  overrides: Partial<AdminProfileSummaryDto> = {},
): AdminProfileSummaryDto {
  return {
    id,
    profileName: `Profile ${id}`,
    headline: null,
    accountId: 1,
    accountName: 'Agency',
    accountEmail: 'agency@example.com',
    accountType: 'AGENCY',
    accountEnabled: true,
    accountStatus: 'ACTIVE',
    gender: 'FEMALE',
    age: 24,
    city: 'Medellín',
    country: 'Colombia',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    photosCount: 3,
    completion: 100,
    complete: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-02-01T00:00:00Z',
    ...overrides,
  };
}

function detailDto(id: number): AdminProfileDetailDto {
  return {
    ...summaryDto(id),
    hairColor: 'Negro',
    heightCm: 170,
    weightKg: 55,
    orientation: 'BISEXUAL',
    phoneCountryCode: '+57',
    phoneNumber: '3001234567',
    website: '',
    basicRate: 300000,
    currency: 'COP',
    availableAllDay: false,
    scheduleFrom: '18:00:00',
    scheduleTo: '02:00:00',
    services: ['Acompañamiento'],
    departures: ['Medellín'],
    channels: ['WhatsApp'],
    modalities: ['Incall'],
    photos: [],
  };
}

describe('AdminProfilesStateService', () => {
  let service: AdminProfilesStateService;
  let api: ApiMock;

  beforeEach(() => {
    api = {
      getAll: () => of([]),
      getById: () => of(detailDto(1)),
      updateStatus: (id, status) => of(summaryDto(Number(id), { status })),
    };

    TestBed.configureTestingModule({
      providers: [
        AdminProfilesStateService,
        { provide: AdminProfilesApiService, useValue: api },
      ],
    });

    service = TestBed.inject(AdminProfilesStateService);
  });

  it('loads profiles and calculates the overview', () => {
    api.getAll = () =>
      of([
        summaryDto(1, { status: 'ACTIVE' }),
        summaryDto(2, { status: 'PAUSED' }),
        summaryDto(3, { status: 'INACTIVE' }),
        summaryDto(4, { status: 'DRAFT' }),
      ]);

    service.load();

    expect(service.profiles().length).toBe(4);
    expect(service.loading()).toBe(false);
    expect(service.overview()).toEqual({
      total: 4,
      active: 1,
      paused: 1,
      inactive: 1,
      draft: 1,
    });
  });

  it('does not reload unless force is true', () => {
    let calls = 0;
    api.getAll = () => {
      calls += 1;
      return of([summaryDto(1)]);
    };

    service.load();
    service.load();
    expect(calls).toBe(1);

    service.load(true);
    expect(calls).toBe(2);
  });

  it('loads a detail and clears loading on error', () => {
    api.getById = () => of(detailDto(7));

    service.loadDetail('7');

    expect(service.detail()?.id).toBe('7');
    expect(service.detailLoading()).toBe(false);

    api.getById = () => throwError(() => new HttpErrorResponse({ status: 500 }));
    service.loadDetail('7');

    expect(service.detail()).toBeNull();
    expect(service.detailError()).toBe('Could not load this profile. Please try again.');
    expect(service.detailLoading()).toBe(false);
  });

  it('treats 404 as not found without a generic error', () => {
    api.getById = () => throwError(() => new HttpErrorResponse({ status: 404 }));

    service.loadDetail('missing');

    expect(service.detail()).toBeNull();
    expect(service.detailError()).toBeNull();
    expect(service.detailLoading()).toBe(false);
  });

  it('updates list and detail after a status change', () => {
    api.getAll = () => of([summaryDto(1)]);
    api.getById = () => of(detailDto(1));

    service.load();
    service.loadDetail('1');

    let updated: AdminProfileSummary | undefined;
    service.changeStatus('1', 'PAUSED').subscribe((value) => {
      updated = value;
    });

    expect(updated?.status).toBe('PAUSED');
    expect(service.profiles()[0].status).toBe('PAUSED');
    expect(service.detail()?.status).toBe('PAUSED');
  });

  it('ignores stale detail responses', () => {
    const pending = new Map<string, Subject<AdminProfileDetailDto>>();
    api.getById = (id) => {
      const subject = new Subject<AdminProfileDetailDto>();
      pending.set(id, subject);
      return subject.asObservable();
    };

    service.loadDetail('1');
    service.loadDetail('2');

    pending.get('2')!.next(detailDto(2));
    pending.get('2')!.complete();
    pending.get('1')!.next(detailDto(1));
    pending.get('1')!.complete();

    expect(service.detail()?.id).toBe('2');
  });
});
