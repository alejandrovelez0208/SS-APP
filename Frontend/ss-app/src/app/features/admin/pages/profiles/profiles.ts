import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { AdminProfileStatusChip } from '../../components/profile-status-chip/profile-status-chip';
import { VerificationChip } from '../../components/verification-chip/verification-chip';
import {
  applyProfileStatus,
  confirmProfileDeactivation,
} from '../../data-access/admin-profile-status.actions';
import { AdminProfilesStateService } from '../../data-access/admin-profiles.state.service';
import {
  AdminProfileSummary,
  ProfileAccountType,
  ProfileState,
  canReactivateProfile,
} from '../../models/admin-profile.model';

type StatusFilter = ProfileState | 'ALL';
type TypeFilter = ProfileAccountType | 'ALL';

@Component({
  selector: 'app-admin-profiles',
  imports: [
    AdminProfileStatusChip,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    RouterLink,
    VerificationChip,
  ],
  templateUrl: './profiles.html',
  styleUrls: ['../../styles/admin-page.css', '../../styles/admin-material.css', './profiles.css'],
})
export class AdminProfiles implements OnInit {
  private readonly state = inject(AdminProfilesStateService);
  private readonly dialogService = inject(DialogService);
  private readonly notification = inject(NotificationService);

  readonly pageSize = 6;
  readonly search = signal('');
  readonly status = signal<StatusFilter>('ALL');
  readonly accountType = signal<TypeFilter>('ALL');
  readonly pageIndex = signal(0);

  readonly statusOptions: readonly StatusFilter[] = [
    'ALL',
    'ACTIVE',
    'PAUSED',
    'INACTIVE',
    'DRAFT',
  ];
  readonly typeOptions: readonly TypeFilter[] = ['ALL', 'INDEPENDENT', 'AGENCY'];

  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly overview = this.state.overview;
  readonly canReactivate = canReactivateProfile;

  ngOnInit(): void {
    this.state.load();
  }

  readonly filteredProfiles = computed(() => {
    const search = this.search().trim().toLowerCase();

    return this.state
      .profiles()
      .filter((profile) => this.status() === 'ALL' || profile.status === this.status())
      .filter(
        (profile) =>
          this.accountType() === 'ALL' || profile.accountType === this.accountType(),
      )
      .filter(
        (profile) =>
          !search ||
          profile.profileName.toLowerCase().includes(search) ||
          profile.accountName.toLowerCase().includes(search) ||
          profile.accountEmail.toLowerCase().includes(search) ||
          profile.city.toLowerCase().includes(search),
      );
  });

  readonly visibleProfiles = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredProfiles().slice(start, start + this.pageSize);
  });

  updateSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
  }

  updateStatus(status: StatusFilter): void {
    this.status.set(status);
    this.pageIndex.set(0);
  }

  updateType(type: TypeFilter): void {
    this.accountType.set(type);
    this.pageIndex.set(0);
  }

  updatePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set('ALL');
    this.accountType.set('ALL');
    this.pageIndex.set(0);
  }

  retry(): void {
    this.state.load(true);
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

  reactivateHint(profile: AdminProfileSummary): string {
    if (profile.verificationStatus === 'REJECTED') {
      return 'Verify the profile before reactivating it.';
    }
    if (!profile.complete) {
      return 'Complete the profile before reactivating it.';
    }
    return 'Reactivate profile';
  }

  statusFilterLabel(option: StatusFilter): string {
    switch (option) {
      case 'ACTIVE':
        return 'Active';
      case 'PAUSED':
        return 'Paused';
      case 'INACTIVE':
        return 'Inactive';
      case 'DRAFT':
        return 'Draft';
      default:
        return 'All statuses';
    }
  }

  typeFilterLabel(option: TypeFilter): string {
    switch (option) {
      case 'INDEPENDENT':
        return 'Independent';
      case 'AGENCY':
        return 'Agency';
      default:
        return 'All types';
    }
  }

  togglePause(profile: AdminProfileSummary): void {
    const nextStatus: ProfileState = profile.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    applyProfileStatus(
      this.state,
      this.notification,
      profile.id,
      nextStatus,
      nextStatus === 'PAUSED' ? 'Profile paused.' : 'Profile resumed.',
    );
  }

  deactivate(profile: AdminProfileSummary): void {
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

  reactivate(profile: AdminProfileSummary): void {
    if (!this.canReactivate(profile)) {
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
}
