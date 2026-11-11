import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Account,
  AccountType,
  MockScenario,
  Profile,
  ProfileStatus,
} from '../models/profile.model';
import { computeCompletion } from '../constants/completion-weights';
import { ProfileRepository } from './profile.repository';

/**
 * Única fuente de verdad del panel. Los componentes solo leen signals y
 * llaman acciones; nunca hablan con el repositorio directamente.
 */
@Injectable()
export class ProfileStateService {
  private readonly repository = inject(ProfileRepository);

  private readonly accountState = signal<Account | null>(null);
  private readonly selectedProfileId = signal<string | null>(null);

  readonly account = this.accountState.asReadonly();
  readonly accountType = computed(() => this.accountState()?.type);
  readonly isAgency = computed(() => this.accountType() === AccountType.AGENCY);
  readonly profiles = computed(() => this.accountState()?.profiles ?? []);
  readonly canAddProfile = computed(() => {
    const account = this.accountState();
    return !!account && account.profiles.length < account.maxProfiles;
  });

  readonly selectedProfile = computed<Profile | null>(() => {
    const account = this.accountState();
    if (!account) {
      return null;
    }
    const id = this.selectedProfileId();
    return (
      account.profiles.find((profile) => profile.id === id) ??
      account.profiles.find((profile) => profile.isPrimary) ??
      account.profiles[0] ??
      null
    );
  });

  readonly completion = computed(() => computeCompletion(this.selectedProfile()));

  async load(): Promise<void> {
    const account = await this.repository.getAccount();
    this.accountState.set(account);
    const primary = account.profiles.find((profile) => profile.isPrimary) ?? account.profiles[0];
    this.selectedProfileId.set(primary?.id ?? null);
  }

  selectProfile(id: string): void {
    this.selectedProfileId.set(id);
  }

  async updateProfile(patch: Partial<Profile>): Promise<void> {
    const profile = this.selectedProfile();
    if (!profile) {
      return;
    }
    const updated = await this.repository.updateProfile(profile.id, patch);
    this.replaceProfile(updated);
  }

  async setStatus(status: ProfileStatus): Promise<void> {
    const profile = this.selectedProfile();
    if (!profile) {
      return;
    }
    const updated = await this.repository.setStatus(profile.id, status);
    this.replaceProfile(updated);
  }

  async addPhoto(url: string): Promise<void> {
    const profile = this.selectedProfile();
    if (!profile) {
      return;
    }
    const updated = await this.repository.addPhoto(profile.id, url);
    this.replaceProfile(updated);
  }

  async removePhoto(photoId: string): Promise<void> {
    const profile = this.selectedProfile();
    if (!profile) {
      return;
    }
    const updated = await this.repository.removePhoto(profile.id, photoId);
    this.replaceProfile(updated);
  }

  async setCover(photoId: string): Promise<void> {
    const profile = this.selectedProfile();
    if (!profile) {
      return;
    }
    const updated = await this.repository.setCover(profile.id, photoId);
    this.replaceProfile(updated);
  }

  private replaceProfile(updated: Profile): void {
    this.accountState.update((account) => {
      if (!account) {
        return account;
      }
      return {
        ...account,
        profiles: account.profiles.map((profile) =>
          profile.id === updated.id ? updated : profile,
        ),
      };
    });
    this.selectedProfileId.set(updated.id);
  }
}
