import { Injectable, computed, signal } from '@angular/core';
import {
  AdminProfileDetail,
  ProfileFilters,
  ProfileState,
} from '../models/admin-profile.model';
import { ADMIN_PROFILES_MOCK } from './admin-profiles.mock';

/**
 * Estado mock compartido por la lista y el detalle de perfiles.
 * Se provee en AdminShell para que ambos vean los mismos cambios.
 * Cuando exista la API, este servicio se reemplaza por uno HTTP.
 */
@Injectable()
export class AdminProfilesMockService {
  private readonly profilesState = signal<AdminProfileDetail[]>(ADMIN_PROFILES_MOCK);

  readonly profiles = this.profilesState.asReadonly();

  readonly overview = computed(() => {
    const profiles = this.profiles();
    return {
      total: profiles.length,
      active: profiles.filter((profile) => profile.status === 'ACTIVE').length,
      paused: profiles.filter((profile) => profile.status === 'PAUSED').length,
      inactive: profiles.filter((profile) => profile.status === 'INACTIVE').length,
      draft: profiles.filter((profile) => profile.status === 'DRAFT').length,
      verified: profiles.filter((profile) => profile.verificationStatus === 'VERIFIED').length,
    };
  });

  search(filters: ProfileFilters): AdminProfileDetail[] {
    const search = filters.search.trim().toLowerCase();

    return this.profiles()
      .filter((profile) => filters.status === 'ALL' || profile.status === filters.status)
      .filter(
        (profile) =>
          filters.accountType === 'ALL' || profile.accountType === filters.accountType,
      )
      .filter(
        (profile) =>
          !search ||
          profile.profileName.toLowerCase().includes(search) ||
          profile.accountName.toLowerCase().includes(search) ||
          profile.accountEmail.toLowerCase().includes(search) ||
          profile.city.toLowerCase().includes(search),
      );
  }

  findById(id: string): AdminProfileDetail | undefined {
    return this.profiles().find((profile) => profile.id === id);
  }

  setStatus(id: string, status: ProfileState): void {
    this.profilesState.update((profiles) =>
      profiles.map((profile) =>
        profile.id === id
          ? { ...profile, status, updatedAt: new Date().toISOString() }
          : profile,
      ),
    );
  }
}
