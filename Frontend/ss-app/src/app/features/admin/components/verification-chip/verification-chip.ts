import { Component, computed, input } from '@angular/core';
import { ProfileVerification } from '../../models/admin-profile.model';

@Component({
  selector: 'app-verification-chip',
  template: `
    <span
      class="verification-chip"
      [class.verified]="status() === 'VERIFIED'"
      [class.rejected]="status() === 'REJECTED'"
      [class.pending]="status() === 'PENDING'"
    >
      <span class="verification-dot" aria-hidden="true"></span>
      {{ label() }}
    </span>
  `,
  styleUrl: './verification-chip.css',
})
export class VerificationChip {
  readonly status = input.required<ProfileVerification>();

  readonly label = computed(() => {
    switch (this.status()) {
      case 'VERIFIED':
        return 'Verified';
      case 'REJECTED':
        return 'Rejected';
      default:
        return 'Pending';
    }
  });
}
