import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import {
  AdminProfileDetail,
  AdminProfileOverview,
  AdminProfileQuery,
  AdminProfileSummary,
  ProfileState,
} from '../models/admin-profile.model';
import { AdminProfilesApiService } from './admin-profiles-api.service';
import {
  toAdminProfileDetail,
  toAdminProfileSummary,
} from './admin-profile.mapper';

/**
 * Única fuente de verdad de la vista admin de perfiles.
 * Las páginas solo leen signals y llaman acciones; no hablan con la API.
 */
@Injectable()
export class AdminProfilesStateService {
  private readonly api = inject(AdminProfilesApiService);

  private readonly profilesState = signal<AdminProfileSummary[]>([]);
  private readonly totalState = signal(0);
  private readonly overviewState = signal<AdminProfileOverview>({
    total: 0,
    active: 0,
    paused: 0,
    inactive: 0,
    draft: 0,
  });
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  private readonly detailState = signal<AdminProfileDetail | null>(null);
  private readonly detailLoadingState = signal(false);
  private readonly detailErrorState = signal<string | null>(null);

  private loaded = false;
  private lastQueryKey = '';
  private currentQuery: AdminProfileQuery | null = null;
  private listRequestId = 0;
  private detailRequestId = 0;

  readonly profiles = this.profilesState.asReadonly();
  readonly total = this.totalState.asReadonly();
  readonly overview = this.overviewState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly detail = this.detailState.asReadonly();
  readonly detailLoading = this.detailLoadingState.asReadonly();
  readonly detailError = this.detailErrorState.asReadonly();

  load(query: AdminProfileQuery, force = false): void {
    const key = this.queryKey(query);

    if (
      !force &&
      key === this.lastQueryKey &&
      (this.loaded || this.loadingState())
    ) {
      return;
    }

    const requestId = ++this.listRequestId;

    this.lastQueryKey = key;
    this.currentQuery = query;
    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.getPage(query).subscribe({
      next: (page) => {
        if (requestId !== this.listRequestId) {
          return;
        }
        this.profilesState.set(page.content.map(toAdminProfileSummary));
        this.totalState.set(page.totalElements);
        this.overviewState.set(page.overview);
        this.loaded = true;
      },
      error: (error: unknown) => {
        if (requestId !== this.listRequestId) {
          return;
        }
        console.error('Error loading admin profiles', error);
        this.errorState.set('Could not load profiles. Please try again.');
        this.loadingState.set(false);
      },
      complete: () => {
        if (requestId === this.listRequestId) {
          this.loadingState.set(false);
        }
      },
    });
  }

  loadDetail(id: string): void {
    if (!id) {
      this.clearDetail();
      return;
    }

    const requestId = ++this.detailRequestId;

    this.detailLoadingState.set(true);
    this.detailErrorState.set(null);
    this.detailState.set(null);

    this.api.getById(id).subscribe({
      next: (dto) => {
        if (requestId !== this.detailRequestId) {
          return;
        }
        this.detailState.set(toAdminProfileDetail(dto));
      },
      error: (error: unknown) => {
        if (requestId !== this.detailRequestId) {
          return;
        }

        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.detailState.set(null);
          this.detailErrorState.set(null);
          this.detailLoadingState.set(false);
          return;
        }

        console.error('Error loading admin profile detail', error);
        this.detailErrorState.set('Could not load this profile. Please try again.');
        this.detailLoadingState.set(false);
      },
      complete: () => {
        if (requestId === this.detailRequestId) {
          this.detailLoadingState.set(false);
        }
      },
    });
  }

  changeStatus(id: string, status: ProfileState): Observable<AdminProfileSummary> {
    return this.api.updateStatus(id, status).pipe(
      map(toAdminProfileSummary),
      tap((updated) => {
        const previousStatus =
          this.profiles().find((profile) => profile.id === updated.id)?.status ??
          this.detail()?.status;

        if (previousStatus && previousStatus !== updated.status) {
          this.overviewState.update((overview) => {
            const next = { ...overview };
            const previousKey = this.overviewKey(previousStatus);
            const nextKey = this.overviewKey(updated.status);
            next[previousKey] = Math.max(0, next[previousKey] - 1);
            next[nextKey] += 1;
            return next;
          });
        }

        const existed = this.profiles().some(
          (profile) => profile.id === updated.id,
        );
        const filteredOut =
          this.currentQuery !== null &&
          this.currentQuery.status !== 'ALL' &&
          updated.status !== this.currentQuery.status;

        if (filteredOut) {
          if (existed) {
            this.profilesState.update((profiles) =>
              profiles.filter((profile) => profile.id !== updated.id),
            );
            this.totalState.update((total) => Math.max(0, total - 1));
          }
        } else {
          this.profilesState.update((profiles) =>
            profiles.map((profile) =>
              profile.id === updated.id ? updated : profile,
            ),
          );
        }

        this.detailState.update((detail) => {
          if (!detail || detail.id !== updated.id) {
            return detail;
          }
          return { ...detail, ...updated };
        });
      }),
    );
  }

  clearDetail(): void {
    this.detailRequestId++;
    this.detailState.set(null);
    this.detailErrorState.set(null);
    this.detailLoadingState.set(false);
  }

  private queryKey(query: AdminProfileQuery): string {
    return [
      query.search.trim().toLowerCase(),
      query.status,
      query.accountType,
      query.verificationStatus ?? 'ALL',
      query.page,
      query.size,
    ].join('|');
  }

  private overviewKey(
    status: ProfileState,
  ): 'active' | 'paused' | 'inactive' | 'draft' {
    switch (status) {
      case 'ACTIVE':
        return 'active';
      case 'PAUSED':
        return 'paused';
      case 'INACTIVE':
        return 'inactive';
      default:
        return 'draft';
    }
  }
}
