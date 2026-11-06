import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { DialogService } from '@shared/services/dialog/dialog-service';
import { NotificationService } from '@shared/services/notification/notification-service';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { RoleBadge } from '../../components/role-badge/role-badge';
import {
  AccountDetail,
  AccountStatus,
  EscortProfile,
  MemberProfile,
  canChangeAccountStatus,
  isEscortProfile,
  isMemberProfile,
} from '../../models/admin-account.model';
import { AdminAccountsService } from '../../services/admin-accounts.service';

@Component({
  selector: 'app-admin-account-detail',
  imports: [
    AccountStatusChip,
    CurrencyPipe,
    MatButtonModule,
    DatePipe,
    DecimalPipe,
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
export class AccountDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly accountsService = inject(AdminAccountsService);
  private readonly dialogService = inject(DialogService);
  private readonly notificationService = inject(NotificationService);

  private readonly accountId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  readonly account = computed(() => this.accountsService.getAccount(this.accountId()));
  readonly canChangeStatus = canChangeAccountStatus;

  escortProfile(account: AccountDetail): EscortProfile | null {
    return isEscortProfile(account.profile) ? account.profile : null;
  }

  memberProfile(account: AccountDetail): MemberProfile | null {
    return isMemberProfile(account.profile) ? account.profile : null;
  }

  changeStatus(account: AccountDetail): void {
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
            this.updateStatus(account, 'INACTIVE');
          }
        });
      return;
    }

    this.updateStatus(account, 'ACTIVE');
  }

  private updateStatus(account: AccountDetail, status: AccountStatus): void {
    this.accountsService.changeStatus(account.id, status);
    this.notificationService.success(
      status === 'ACTIVE' ? 'Account activated.' : 'Account deactivated.',
    );
  }
}
