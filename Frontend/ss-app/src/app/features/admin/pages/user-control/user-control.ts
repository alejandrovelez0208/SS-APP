import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { RoleBadge } from '../../components/role-badge/role-badge';
import {
  AccountRole,
  AccountStatus,
  AccountSummary,
  canChangeAccountStatus,
} from '../../models/admin-account.model';
import { AdminAccountsStateService } from '../../data-access/admin-accounts.state.service';

@Component({
  selector: 'app-admin-user-control',
  imports: [
    AccountStatusChip,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    RoleBadge,
  ],
  templateUrl: './user-control.html',
  styleUrls: [
    '../../styles/admin-page.css',
    '../../styles/admin-material.css',
    './user-control.css',
  ],
})
export class UserControl {
  private readonly accountsService = inject(AdminAccountsStateService);
  private readonly dialogService = inject(DialogService);
  private readonly notificationService = inject(NotificationService);

  readonly pageSize = 5;
  readonly displayedColumns = ['email', 'role', 'status', 'action'];
  readonly search = signal('');
  readonly status = signal<AccountStatus | 'ALL'>('ALL');
  readonly role = signal<AccountRole | 'ALL'>('ALL');
  readonly pageIndex = signal(0);
  readonly statusOptions: Array<AccountStatus | 'ALL'> = ['ALL', 'ACTIVE', 'INACTIVE'];
  readonly roleOptions: Array<AccountRole | 'ALL'> = ['ALL', 'ADMIN', 'USERS'];
  readonly canChangeStatus = canChangeAccountStatus;

  readonly accounts = computed(() =>
    this.accountsService.searchAccounts({
      search: this.search(),
      status: this.status(),
      role: this.role(),
    }),
  );

  readonly visibleAccounts = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.accounts().slice(start, start + this.pageSize);
  });

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
  }

  updateStatus(status: AccountStatus | 'ALL'): void {
    this.status.set(status);
    this.pageIndex.set(0);
  }

  updateRole(role: AccountRole | 'ALL'): void {
    this.role.set(role);
    this.pageIndex.set(0);
  }

  updatePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set('ALL');
    this.role.set('ALL');
    this.pageIndex.set(0);
  }

  changeStatus(account: AccountSummary): void {
    if (!this.canChangeStatus(account)) return;

    if (account.status === 'ACTIVE') {
      this.dialogService
        .openConfirmation(
          'Deactivate account?',
          'This user will not be able to sign in until reactivated.',
          'Deactivate',
          'Cancel',
          'danger',
        )
        .subscribe((confirmed) => {
          if (confirmed) {
            this.updateAccountStatus(account, 'INACTIVE');
          }
        });
      return;
    }

    this.updateAccountStatus(account, 'ACTIVE');
  }

  private updateAccountStatus(account: AccountSummary, status: AccountStatus): void {
    this.accountsService.changeStatus(account.id, status);
    this.notificationService.success(
      status === 'ACTIVE' ? 'Account activated.' : 'Account deactivated.',
    );
  }
}
