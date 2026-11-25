import {
  AdminProfileDetailDto,
  AdminProfileSummaryDto,
} from '../models/admin-profile.dto';
import {
  genderLabel,
  orientationLabel,
  toAdminProfileDetail,
  toAdminProfileSummary,
} from './admin-profile.mapper';

const SUMMARY: AdminProfileSummaryDto = {
  id: 10,
  profileName: 'Camila Restrepo',
  headline: null,
  accountId: 5,
  accountName: 'Luna Agency',
  accountEmail: null,
  accountType: 'AGENCY',
  accountEnabled: true,
  accountStatus: 'ACTIVE',
  gender: 'FEMALE',
  age: 24,
  city: null,
  country: 'Colombia',
  status: 'ACTIVE',
  verificationStatus: 'VERIFIED',
  photosCount: 4,
  completion: 80,
  complete: true,
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-02-01T00:00:00Z',
};

const DETAIL: AdminProfileDetailDto = {
  ...SUMMARY,
  hairColor: null,
  heightCm: 170,
  weightKg: null,
  orientation: 'BISEXUAL',
  phoneCountryCode: null,
  phoneNumber: null,
  website: null,
  basicRate: 350000,
  currency: 'COP',
  availableAllDay: false,
  scheduleFrom: '18:00:00',
  scheduleTo: null,
  services: ['Acompañamiento'],
  departures: [],
  channels: ['WhatsApp'],
  modalities: ['Incall'],
  photos: [
    {
      id: 99,
      url: 'https://example.com/photo.jpg',
      primaryPhoto: true,
      sortOrder: 1,
      visibility: 'PUBLIC',
      moderationStatus: 'APPROVED',
    },
  ],
};

describe('admin-profile mapper', () => {
  it('maps summary fields and nullable values', () => {
    const summary = toAdminProfileSummary(SUMMARY);

    expect(summary.id).toBe('10');
    expect(summary.accountEmail).toBe('');
    expect(summary.headline).toBe('');
    expect(summary.city).toBe('');
    expect(summary.gender).toBe('Female');
    expect(summary.complete).toBe(true);
    expect(summary.accountType).toBe('AGENCY');
  });

  it('maps detail fields, times and photos', () => {
    const detail = toAdminProfileDetail(DETAIL);

    expect(detail.orientation).toBe('Bisexual');
    expect(detail.scheduleFrom).toBe('18:00');
    expect(detail.scheduleTo).toBe('');
    expect(detail.phoneNumber).toBe('');
    expect(detail.photos).toEqual([
      {
        id: '99',
        url: 'https://example.com/photo.jpg',
        moderationStatus: 'APPROVED',
      },
    ]);
  });

  it('handles null gender and orientation', () => {
    expect(genderLabel(null)).toBe('—');
    expect(orientationLabel(null)).toBe('—');
  });
});
