import { TestBed } from '@angular/core/testing';
import { AdminAccountsService } from './admin-accounts.service';

describe('AdminAccountsService', () => {
  let service: AdminAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AdminAccountsService] });
    service = TestBed.inject(AdminAccountsService);
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
    service.changeStatus('2', 'INACTIVE');
    expect(service.getAccount('2')?.status).toBe('INACTIVE');

    service.changeStatus('2', 'ACTIVE');
    expect(service.getAccount('2')?.status).toBe('ACTIVE');
  });

  it('does not allow changing an admin account status', () => {
    expect(() => service.changeStatus('1', 'INACTIVE')).toThrowError(
      "Admin accounts can't be deactivated.",
    );
    expect(service.getAccount('1')?.status).toBe('ACTIVE');
  });

  it('updates the overview after a status change', () => {
    const activeBefore = service.overview().active;

    service.changeStatus('2', 'INACTIVE');

    expect(service.overview().active).toBe(activeBefore - 1);
    expect(service.overview().inactive).toBe(3);
  });
});
