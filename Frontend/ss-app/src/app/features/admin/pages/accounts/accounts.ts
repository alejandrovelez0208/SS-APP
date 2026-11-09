import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { AccountStatus } from '../../models/admin-account.model';
import { AdminAccountsStateService } from '../../data-access/admin-accounts.state.service';

@Component({
  selector: 'app-admin-accounts',
  imports: [
    AccountStatusChip,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    RouterLink,
  ],
  templateUrl: './accounts.html',
  styleUrls: ['../../styles/admin-page.css', '../../styles/admin-material.css', './accounts.css'],
})
export class Accounts {
  private readonly accountsService = inject(AdminAccountsStateService);

  readonly pageSize = 5;
  readonly displayedColumns = ['name', 'email', 'type', 'status', 'view'];
  readonly search = signal('');
  readonly status = signal<AccountStatus | 'ALL'>('ALL');
  readonly statusOptions: Array<AccountStatus | 'ALL'> = ['ALL', 'ACTIVE', 'INACTIVE'];
  readonly pageIndex = signal(0);
  readonly loading = this.accountsService.loading;
  readonly error = this.accountsService.error;

  readonly filteredAccounts = computed(() =>
    this.accountsService.searchAccounts({
      search: this.search(),
      status: this.status(),
      role: 'ALL',
    }),
  );

  readonly visibleAccounts = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredAccounts().slice(start, start + this.pageSize);
  });

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
  }

  updateStatus(status: AccountStatus | 'ALL'): void {
    this.status.set(status);
    this.pageIndex.set(0);
  }

  updatePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set('ALL');
    this.pageIndex.set(0);
  }

  initial(username: string): string {
    return username.charAt(0).toUpperCase();
  }

  accountTypeLabel(accountType: string | null): string {
    switch (accountType) {
      case 'INDEPENDENT':
        return 'Independent';
      case 'AGENCY':
        return 'Agency';
      default:
        return '—';
    }
  }

  retry(): void {
    this.accountsService.load(true);
  }
}
