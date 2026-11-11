import { Injectable } from '@angular/core';
import { Account, MockScenario, Profile, ProfileStatus } from '../models/profile.model';
import { buildMockAccount } from '../constants/mock-account.data';
import { ProfileRepository } from './profile.repository';

/**
 * Implementación en memoria con datos quemados.
 *
 * Se reemplaza por un repositorio HTTP sin tocar componentes ni estado.
 */
@Injectable()
export class ProfileMockRepository extends ProfileRepository {
  private readonly accounts = new Map<MockScenario, Account>();

  async getAccount(): Promise<Account> {
    return this.clone(this.ensureAccount('INDEPENDENT'));
  }

  async updateProfile(id: string, patch: Partial<Profile>): Promise<Profile> {
    const account = this.findAccountByProfile(id);
    const profile = this.findProfile(account, id);
    Object.assign(profile, patch, { updatedAt: new Date().toISOString() });
    return this.clone(profile);
  }

  async setStatus(id: string, status: ProfileStatus): Promise<Profile> {
    return this.updateProfile(id, { status });
  }

  async addPhoto(id: string, url: string): Promise<Profile> {
    const account = this.findAccountByProfile(id);
    const profile = this.findProfile(account, id);
    const order = profile.photos.length;
    profile.photos = [
      ...profile.photos,
      { id: `photo-${Date.now()}`, url, isCover: order === 0, sortOrder: order },
    ];
    profile.updatedAt = new Date().toISOString();
    return this.clone(profile);
  }

  async removePhoto(id: string, photoId: string): Promise<Profile> {
    const account = this.findAccountByProfile(id);
    const profile = this.findProfile(account, id);
    const removed = profile.photos.find((photo) => photo.id === photoId);
    profile.photos = profile.photos.filter((photo) => photo.id !== photoId);

    if (removed?.isCover && profile.photos.length > 0) {
      profile.photos[0].isCover = true;
    }

    profile.updatedAt = new Date().toISOString();
    return this.clone(profile);
  }

  async setCover(id: string, photoId: string): Promise<Profile> {
    const account = this.findAccountByProfile(id);
    const profile = this.findProfile(account, id);
    profile.photos = profile.photos.map((photo) => ({
      ...photo,
      isCover: photo.id === photoId,
    }));
    profile.updatedAt = new Date().toISOString();
    return this.clone(profile);
  }

  private ensureAccount(scenario: MockScenario): Account {
    let account = this.accounts.get(scenario);
    if (!account) {
      account = buildMockAccount(scenario);
      this.accounts.set(scenario, account);
    }
    return account;
  }

  private findAccountByProfile(profileId: string): Account {
    for (const account of this.accounts.values()) {
      if (account.profiles.some((profile) => profile.id === profileId)) {
        return account;
      }
    }
    throw new Error(`Mock profile not found: ${profileId}`);
  }

  private findProfile(account: Account, id: string): Profile {
    const profile = account.profiles.find((item) => item.id === id);
    if (!profile) {
      throw new Error(`Mock profile not found: ${id}`);
    }
    return profile;
  }

  private clone<T>(value: T): T {
    return structuredClone(value);
  }
}
