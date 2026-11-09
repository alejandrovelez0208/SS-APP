import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminDirectoryApiService } from './admin-directory-api-service';
import { AdminAccountsStateService } from './admin-accounts.state.service';
import { DirectoryUserDto } from '../models/admin-account.model';

const USERS: DirectoryUserDto[] = [
  {
    id: 1,
    email: 'admin@ss-app.com',
    emailVerified: true,
    enabled: true,
    lastLoginAt: null,
    createdAt: '2026-01-10T10:00:00Z',
    role: 'ADMIN',
    userName: 'main.admin',
    accountType: 'INDEPENDENT',
    accountStatus: 'ACTIVE',
  },
  {
    id: 2,
    email: 'sofia@example.com',
    emailVerified: true,
    enabled: true,
    lastLoginAt: '2026-05-01T10:00:00Z',
    createdAt: '2026-02-14T10:00:00Z',
    role: 'USER',
    userName: 'sofia.escort',
    accountType: 'INDEPENDENT',
    accountStatus: 'ACTIVE',
  },
  {
    id: 3,
    email: 'valentina@example.com',
    emailVerified: false,
    enabled: false,
    lastLoginAt: null,
    createdAt: '2026-03-18T10:00:00Z',
    role: 'USER',
    userName: 'valentina.escort',
    accountType: 'AGENCY',
    accountStatus: 'ACTIVE',
  },
];

describe('AdminAccountsStateService', () => {
  let service: AdminAccountsStateService;

  const apiMock = {
    getAllUsers: () => of(USERS),
    getUserById: (id: string) => of({ ...USERS[1], id: Number(id), profiles: [] }),
    updateStatus: (id: string, enabled: boolean) => {
      const user = USERS.find((item) => String(item.id) === id);
      if (!user) {
        return throwError(() => new Error('Not found'));
      }
      return of({ ...user, enabled });
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminAccountsStateService,
        { provide: AdminDirectoryApiService, useValue: apiMock },
      ],
    });
    service = TestBed.inject(AdminAccountsStateService);
    service.load();
  });

  it('loads and maps the directory users', () => {
    expect(service.accounts()).toHaveLength(3);
    expect(service.accounts()[1].role).toBe('USERS');
    expect(service.accounts()[2].status).toBe('INACTIVE');
  });

  it('filters accounts by search, status and role', () => {
    const accounts = service.searchAccounts({
      search: 'sofia',
      status: 'ACTIVE',
      role: 'USERS',
    });

    expect(accounts).toHaveLength(1);
    expect(accounts[0].email).toBe('sofia@example.com');
  });

  it('activates and deactivates a user account', () => {
    service.changeStatus('2', 'INACTIVE').subscribe();
    expect(service.getAccount('2')?.status).toBe('INACTIVE');

    service.changeStatus('2', 'ACTIVE').subscribe();
    expect(service.getAccount('2')?.status).toBe('ACTIVE');
  });

  it('does not allow changing an admin account status', () => {
    let error: unknown;
    service.changeStatus('1', 'INACTIVE').subscribe({ error: (value) => (error = value) });

    expect(error).toBeInstanceOf(Error);
    expect(service.getAccount('1')?.status).toBe('ACTIVE');
  });

  it('updates the overview after a status change', () => {
    const activeBefore = service.overview().active;

    service.changeStatus('3', 'ACTIVE').subscribe();

    expect(service.overview().active).toBe(activeBefore + 1);
  });
});
