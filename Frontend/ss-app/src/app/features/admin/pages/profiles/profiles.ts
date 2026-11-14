import { Component, computed, inject, signal } from '@angular/core';
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
import { AdminProfilesMockService } from '../../data-access/admin-profiles.mock.service';
import {
  AdminProfile,
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
export class AdminProfiles {
  private readonly profilesService = inject(AdminProfilesMockService);
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

  readonly overview = this.profilesService.overview;
  readonly canReactivate = canReactivateProfile;

  readonly filteredProfiles = computed(() =>
    this.profilesService.search({
      search: this.search(),
      status: this.status(),
      accountType: this.accountType(),
    }),
  );

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

  initial(name: string): string {
    return name.charAt(0).toUpperCase();
  }

  accountTypeLabel(type: ProfileAccountType): string {
    return type === 'AGENCY' ? 'Agency' : 'Independent';
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

  togglePause(profile: AdminProfile): void {
    const nextStatus: ProfileState = profile.status === 'PAUSED' ? 'ACTIVE' : 'PAUSED';
    this.profilesService.setStatus(profile.id, nextStatus);
    this.notification.success(
      nextStatus === 'PAUSED' ? 'Profile paused.' : 'Profile resumed.',
    );
  }

  deactivate(profile: AdminProfile): void {
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

  reactivate(profile: AdminProfile): void {
    if (!this.canReactivate(profile)) {
      return;
    }
    this.profilesService.setStatus(profile.id, 'ACTIVE');
    this.notification.success('Profile reactivated.');
  }
}
