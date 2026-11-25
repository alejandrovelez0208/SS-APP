import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import {
  AdminProfileDetail,
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
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);

  private readonly detailState = signal<AdminProfileDetail | null>(null);
  private readonly detailLoadingState = signal(false);
  private readonly detailErrorState = signal<string | null>(null);

  private loaded = false;
  private listRequestId = 0;
  private detailRequestId = 0;

  readonly profiles = this.profilesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly detail = this.detailState.asReadonly();
  readonly detailLoading = this.detailLoadingState.asReadonly();
  readonly detailError = this.detailErrorState.asReadonly();

  readonly overview = computed(() => {
    const profiles = this.profiles();
    return {
      total: profiles.length,
      active: profiles.filter((profile) => profile.status === 'ACTIVE').length,
      paused: profiles.filter((profile) => profile.status === 'PAUSED').length,
      inactive: profiles.filter((profile) => profile.status === 'INACTIVE').length,
      draft: profiles.filter((profile) => profile.status === 'DRAFT').length,
    };
  });

  load(force = false): void {
    if (this.loaded && !force) {
      return;
    }

    const requestId = ++this.listRequestId;

    this.loadingState.set(true);
    this.errorState.set(null);

    this.api
      .getAll({ search: '', status: 'ALL', accountType: 'ALL' })
      .subscribe({
        next: (dtos) => {
          if (requestId !== this.listRequestId) {
            return;
          }
          this.profilesState.set(dtos.map(toAdminProfileSummary));
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
        this.profilesState.update((profiles) =>
          profiles.map((profile) => (profile.id === updated.id ? updated : profile)),
        );
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
}
