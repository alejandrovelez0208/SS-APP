import { Component, input } from '@angular/core';
import { AccountStatus } from '../../models/admin-account.model';

@Component({
  selector: 'app-account-status-chip',
  template: `
    <span class="status-chip" [class.inactive]="status() === 'INACTIVE'">
      <span class="status-dot" aria-hidden="true"></span>
      {{ status() === 'ACTIVE' ? 'Active' : 'Inactive' }}
    </span>
  `,
  styleUrl: './account-status-chip.css',
})
export class AccountStatusChip {
  readonly status = input.required<AccountStatus>();
}
