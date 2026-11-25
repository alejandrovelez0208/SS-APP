import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, DestroyRef, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { map } from 'rxjs';
import { AdminProfileStatusChip } from '../../components/profile-status-chip/profile-status-chip';
import { VerificationChip } from '../../components/verification-chip/verification-chip';
import {
  applyProfileStatus,
  confirmProfileDeactivation,
} from '../../data-access/admin-profile-status.actions';
import { AdminProfilesStateService } from '../../data-access/admin-profiles.state.service';
import {
  ProfileAccountType,
  ProfileState,
  canReactivateProfile,
} from '../../models/admin-profile.model';

@Component({
  selector: 'app-admin-profile-detail',
  imports: [
    AdminProfileStatusChip,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    VerificationChip,
  ],
  templateUrl: './profile-detail.html',
  styleUrls: [
    '../../styles/admin-page.css',
    '../../styles/admin-material.css',
    './profile-detail.css',
  ],
})
export class AdminProfileDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly state = inject(AdminProfilesStateService);
  private readonly dialogService = inject(DialogService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly profileId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  readonly profile = this.state.detail;
  readonly loading = this.state.detailLoading;
  readonly error = this.state.detailError;
  readonly canReactivate = canReactivateProfile;

  readonly draftReady = computed(() => {
    const profile = this.profile();
    return (
      !!profile &&
      profile.complete &&
      profile.verificationStatus === 'VERIFIED'
    );
  });

  readonly reactivateHint = computed(() => {
    const profile = this.profile();
    if (!profile || profile.status !== 'INACTIVE') {
      return '';
    }
    if (profile.verificationStatus === 'REJECTED') {
      return 'The verification was rejected. Approve it before reactivating the profile.';
    }
    if (!profile.complete) {
      return 'Complete the profile before reactivating it.';
    }
    return '';
  });

  readonly statusDescription = computed(() => {
    const profile = this.profile();
    if (!profile) {
      return '';
    }

    switch (profile.status) {
      case 'ACTIVE':
        return 'This profile is visible to the public while the account remains active.';
      case 'PAUSED':
        return 'Temporarily hidden. The owner or an admin can resume it at any time.';
      case 'INACTIVE':
        return 'Hidden by an administrator. Only a moderator can reactivate it.';
      default:
        return 'Not published yet. It becomes visible once it is complete and verified.';
    }
  });

  constructor() {
    effect(() => {
      const id = this.profileId();
      if (id) {
        this.state.loadDetail(id);
      }
    });

    this.destroyRef.onDestroy(() => this.state.clearDetail());
  }

  retry(): void {
    const id = this.profileId();
    if (id) {
      this.state.loadDetail(id);
    }
  }

  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  accountTypeLabel(type: ProfileAccountType | null): string {
    if (type === 'AGENCY') {
      return 'Agency';
    }
    if (type === 'INDEPENDENT') {
      return 'Independent';
    }
    return '—';
  }

  togglePause(): void {
    const profile = this.profile();
    if (!profile) {
      return;
    }

    const nextStatus: ProfileState = profile.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    applyProfileStatus(
      this.state,
      this.notification,
      profile.id,
      nextStatus,
      nextStatus === 'PAUSED' ? 'Profile paused.' : 'Profile resumed.',
    );
  }

  deactivate(): void {
    const profile = this.profile();
    if (!profile) {
      return;
    }

    confirmProfileDeactivation(this.dialogService, profile.profileName).subscribe(
      (confirmed) => {
        if (!confirmed) {
          return;
        }
        applyProfileStatus(
          this.state,
          this.notification,
          profile.id,
          'INACTIVE',
          'Profile deactivated.',
        );
      },
    );
  }

  reactivate(): void {
    const profile = this.profile();
    if (!profile || !this.canReactivate(profile)) {
      return;
    }

    applyProfileStatus(
      this.state,
      this.notification,
      profile.id,
      'ACTIVE',
      'Profile reactivated.',
    );
  }

  activateDraft(): void {
    const profile = this.profile();
    if (!profile || !this.draftReady()) {
      return;
    }

    applyProfileStatus(
      this.state,
      this.notification,
      profile.id,
      'ACTIVE',
      'Profile activated.',
    );
  }
}
