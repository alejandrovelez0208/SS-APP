import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { map } from 'rxjs';
import { AdminProfileStatusChip } from '../../components/profile-status-chip/profile-status-chip';
import { VerificationChip } from '../../components/verification-chip/verification-chip';
import { AdminProfilesMockService } from '../../data-access/admin-profiles.mock.service';
import {
  ProfileAccountType,
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
  private readonly profilesService = inject(AdminProfilesMockService);
  private readonly dialogService = inject(DialogService);
  private readonly notification = inject(NotificationService);

  readonly profileId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    { initialValue: this.route.snapshot.paramMap.get('id') ?? '' },
  );

  readonly profile = computed(
    () => this.profilesService.findById(this.profileId()) ?? null,
  );

  readonly canReactivate = canReactivateProfile;

  readonly photoSlots = computed(() => {
    const profile = this.profile();
    if (!profile) {
      return [];
    }
    return Array.from({ length: profile.photosCount }, (_, index) => index);
  });

  readonly draftReady = computed(() => {
    const profile = this.profile();
    return (
      !!profile &&
      profile.completion === 100 &&
      profile.verificationStatus === 'VERIFIED'
    );
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

  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  accountTypeLabel(type: ProfileAccountType): string {
    return type === 'AGENCY' ? 'Agency' : 'Independent';
  }

  togglePause(): void {
    const profile = this.profile();
    if (!profile) {
      return;
    }

    const nextStatus = profile.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    this.profilesService.setStatus(profile.id, nextStatus);
    this.notification.success(
      nextStatus === 'PAUSED' ? 'Profile paused.' : 'Profile resumed.',
    );
  }

  deactivate(): void {
    const profile = this.profile();
    if (!profile) {
      return;
    }

    this.dialogService
      .openConfirmation(
        'Deactivate profile?',
        `"${profile.profileName}" will be hidden from the public site. The account will stay active.`,
        'Deactivate',
        'Cancel',
        'danger',
      )
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.profilesService.setStatus(profile.id, 'INACTIVE');
        this.notification.success('Profile deactivated.');
      });
  }

  reactivate(): void {
    const profile = this.profile();
    if (!profile || !this.canReactivate(profile)) {
      return;
    }

    this.profilesService.setStatus(profile.id, 'ACTIVE');
    this.notification.success('Profile reactivated.');
  }

  activateDraft(): void {
    const profile = this.profile();
    if (!profile || !this.draftReady()) {
      return;
    }

    this.profilesService.setStatus(profile.id, 'ACTIVE');
    this.notification.success('Profile activated.');
  }
}
