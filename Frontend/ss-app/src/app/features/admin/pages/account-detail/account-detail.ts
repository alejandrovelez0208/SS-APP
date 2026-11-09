import { DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { RoleBadge } from '../../components/role-badge/role-badge';
import { AdminAccountsStateService } from '../../data-access/admin-accounts.state.service';
import { toAccountRole, toAccountStatus } from '../../data-access/admin-directory.mapper';
import {
  AccountRole,
  AccountStatus,
  UserDetailDto,
} from '../../models/admin-account.model';

@Component({
  selector: 'app-admin-account-detail',
  imports: [
    AccountStatusChip,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    RoleBadge,
    RouterLink,
  ],
  templateUrl: './account-detail.html',
  styleUrls: [
    '../../styles/admin-page.css',
    '../../styles/admin-material.css',
    './account-detail.css',
  ],
})
export class AccountDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly accountsService = inject(AdminAccountsStateService);
  private readonly dialogService = inject(DialogService);
  private readonly notificationService = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly detail = signal<UserDetailDto | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly status = computed<AccountStatus>(() => {
    const detail = this.detail();
    return detail ? toAccountStatus(detail) : 'INACTIVE';
  });

  readonly role = computed<AccountRole>(() => {
    const detail = this.detail();
    return detail ? toAccountRole(detail.role) : 'USERS';
  });

  readonly canChangeStatus = computed(() => this.role() !== 'ADMIN');

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.load(id);
      } else {
        this.error.set('Account not found.');
      }
    });
  }

  load(id = this.route.snapshot.paramMap.get('id')): void {
    if (!id) {
      this.error.set('Account not found.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.accountsService
      .getUserDetail(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (detail) => {
          this.detail.set(detail);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          console.error('Error loading account detail', error);
          this.error.set('Could not load this account.');
          this.loading.set(false);
        },
      });
  }

  changeStatus(): void {
    const detail = this.detail();
    if (!detail || !this.canChangeStatus()) {
      return;
    }

    if (this.status() === 'ACTIVE') {
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
            this.updateStatus('INACTIVE');
          }
        });
      return;
    }

    this.updateStatus('ACTIVE');
  }

  private updateStatus(status: AccountStatus): void {
    const detail = this.detail();
    if (!detail) {
      return;
    }

    this.accountsService
      .changeStatus(String(detail.id), status)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.success(
            status === 'ACTIVE' ? 'Account activated.' : 'Account deactivated.',
          );
          this.load();
        },
        error: (error: unknown) => {
          console.error('Error updating account status', error);
          this.notificationService.error('Could not update the account status.');
        },
      });
  }
}
