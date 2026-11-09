import { Component, computed, input } from '@angular/core';
import { ProfileStatus } from '../../models/profile.model';

@Component({
  selector: 'app-profile-status-chip',
  template: `<span class="chip" [class]="variant()">{{ label() }}</span>`,
  styles: [
    `
      .chip {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border: 1px solid transparent;
        border-radius: 999px;
        font: 600 11px 'Inter', sans-serif;
        letter-spacing: 0.04em;
        text-transform: uppercase;
        white-space: nowrap;
      }

      .chip.active {
        border-color: rgba(16, 185, 129, 0.5);
        background: rgba(16, 185, 129, 0.12);
        color: #55d9a9;
      }

      .chip.draft {
        border-color: rgba(224, 194, 127, 0.5);
        background: rgba(224, 194, 127, 0.12);
        color: var(--gold);
      }

      .chip.inactive {
        border-color: rgba(255, 255, 255, 0.18);
        background: rgba(255, 255, 255, 0.06);
        color: var(--gray);
      }

      .chip.paused {
        border-color: rgba(229, 9, 20, 0.5);
        background: rgba(229, 9, 20, 0.12);
        color: #ff6b76;
      }
    `,
  ],
})
export class ProfileStatusChip {
  readonly status = input.required<ProfileStatus>();

  readonly label = computed(() => {
    switch (this.status()) {
      case ProfileStatus.ACTIVE:
        return 'Active';
      case ProfileStatus.PAUSED:
        return 'Paused';
      case ProfileStatus.INACTIVE:
        return 'Inactive';
      default:
        return 'Draft';
    }
  });

  readonly variant = computed(() => {
    switch (this.status()) {
      case ProfileStatus.ACTIVE:
        return 'active';
      case ProfileStatus.PAUSED:
        return 'paused';
      case ProfileStatus.INACTIVE:
        return 'inactive';
      default:
        return 'draft';
    }
  });
}
