import {
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
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
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchInput$ = new Subject<string>();

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

  readonly profiles = this.state.profiles;
  readonly total = this.state.total;
  readonly loading = this.state.loading;
  readonly error = this.state.error;
  readonly overview = this.state.overview;
  readonly canReactivate = canReactivateProfile;

  constructor() {
    this.searchInput$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.loadPage());

    effect(() => {
      const maxPage = Math.max(
        0,
        Math.ceil(this.total() / this.pageSize) - 1,
      );
      if (this.pageIndex() > maxPage) {
        this.pageIndex.set(maxPage);
        untracked(() => this.loadPage());
      }
    });
  }

  ngOnInit(): void {
    this.loadPage();
  }

  updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.search.set(value);
    this.pageIndex.set(0);
    this.searchInput$.next(value);
  }

  updateStatus(status: StatusFilter): void {
    this.status.set(status);
    this.pageIndex.set(0);
    this.loadPage();
  }

  updateType(type: TypeFilter): void {
    this.accountType.set(type);
    this.pageIndex.set(0);
    this.loadPage();
  }

  updatePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.loadPage();
  }

  clearFilters(): void {
    this.search.set('');
    this.status.set('ALL');
    this.accountType.set('ALL');
    this.pageIndex.set(0);
    this.searchInput$.next('');
    this.loadPage();
  }

  retry(): void {
    this.loadPage(true);
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

  reactivateHint(profile: AdminProfileSummary): string {
    if (profile.verificationStatus === 'REJECTED') {
      return 'Verify the profile before reactivating it.';
    }
    if (!profile.complete) {
      return 'Complete the profile before reactivating it.';
    }
    return 'Reactivate profile';
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

  private loadPage(force = false): void {
    this.state.load(
      {
        search: this.search(),
        status: this.status(),
        accountType: this.accountType(),
        page: this.pageIndex(),
        size: this.pageSize,
      },
      force,
    );
  }
}
