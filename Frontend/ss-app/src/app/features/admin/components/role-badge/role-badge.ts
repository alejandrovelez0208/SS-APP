import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AccountRole } from '../../models/admin-account.model';

@Component({
  selector: 'app-role-badge',
  imports: [MatIconModule],
  template: `
    <span class="role-badge" [class.admin]="role() === 'ADMIN'">
      <mat-icon aria-hidden="true">
        {{ role() === 'ADMIN' ? 'admin_panel_settings' : 'person' }}
      </mat-icon>
      {{ role() }}
    </span>
  `,
  styleUrl: './role-badge.css',
})
export class RoleBadge {
  readonly role = input.required<AccountRole>();
}
