import { Component, computed, input } from '@angular/core';
import { ProfileState } from '../../models/admin-profile.model';

@Component({
  selector: 'app-admin-profile-status-chip',
  template: `
    <span
      class="profile-status-chip"
      [class.active]="state() === 'ACTIVE'"
      [class.paused]="state() === 'PAUSED'"
      [class.inactive]="state() === 'INACTIVE'"
      [class.draft]="state() === 'DRAFT'"
    >
      <span class="status-dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
  styleUrl: './profile-status-chip.css',
})
export class AdminProfileStatusChip {
  readonly state = input.required<ProfileState>();

  readonly label = computed(() => {
    switch (this.state()) {
      case 'ACTIVE':
        return 'Active';
      case 'PAUSED':
        return 'Paused';
      case 'INACTIVE':
        return 'Inactive';
      default:
        return 'Draft';
    }
  });
}
