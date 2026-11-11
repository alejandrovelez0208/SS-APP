import { Injectable } from '@angular/core';
import { Account, Profile, ProfileStatus } from '../models/profile.model';

/**
 * Puerto de acceso a datos del panel.
 *
 * Hoy lo implementa {@link ProfileMockRepository}; mañana un
 * `HttpProfileRepository` contra la API. Ningún componente conoce el detalle.
 */
@Injectable()
export abstract class ProfileRepository {

  abstract getAccount(): Promise<Account>;
  abstract updateProfile(id: string, patch: Partial<Profile>): Promise<Profile>;
  abstract setStatus(id: string, status: ProfileStatus): Promise<Profile>;
  abstract addPhoto(id: string, url: string): Promise<Profile>;
  abstract removePhoto(id: string, photoId: string): Promise<Profile>;
  abstract setCover(id: string, photoId: string): Promise<Profile>;
}
