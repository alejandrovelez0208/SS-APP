import { Injectable, computed, signal } from '@angular/core';
import {
  AccountDetail,
  AccountFilters,
  AccountStatus,
  AccountSummary,
  canChangeAccountStatus,
} from '../models/admin-account.model';
import { ADMIN_ACCOUNTS_MOCK } from './admin-accounts.mock';

@Injectable()
export class AdminAccountsService {
  private readonly accountsState = signal<AccountDetail[]>(ADMIN_ACCOUNTS_MOCK);

  readonly accounts = this.accountsState.asReadonly();

  readonly overview = computed(() => ({
    total: this.accounts().length,
    active: this.accounts().filter((account) => account.status === 'ACTIVE').length,
    inactive: this.accounts().filter((account) => account.status === 'INACTIVE').length,
  }));

  searchAccounts(filters: AccountFilters): AccountSummary[] {
    const search = filters.search.trim().toLowerCase();

    return this.accounts()
      .filter((account) => filters.status === 'ALL' || account.status === filters.status)
      .filter((account) => filters.role === 'ALL' || account.role === filters.role)
      .filter(
        (account) =>
          !search ||
          account.username.toLowerCase().includes(search) ||
          account.email.toLowerCase().includes(search),
      )
      .map((account) => ({
        id: account.id,
        username: account.username,
        email: account.email,
        role: account.role,
        status: account.status,
        profileType: account.profileType,
      }));
  }

  getAccount(id: string): AccountDetail | undefined {
    return this.accounts().find((account) => account.id === id);
  }

  changeStatus(id: string, status: AccountStatus): AccountDetail {
    const account = this.getAccount(id);

    if (!account) {
      throw new Error('Account not found.');
    }

    if (!canChangeAccountStatus(account)) {
      throw new Error("Admin accounts can't be deactivated.");
    }

    const updatedAccount = { ...account, status };
    this.accountsState.update((accounts) =>
      accounts.map((item) => (item.id === id ? updatedAccount : item)),
    );

    return updatedAccount;
  }
}
