import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthSessionService } from '@core/auth/auth-session.service';
import {
  ProfileApiService,
  ProfileUpdatePayload,
} from '@shared/services/profiles/profile-api.service';
import { Account, Profile, ProfileStatus } from '../models/profile.model';
import { AccountMapper } from './profile.mapper';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileHttpRepository extends ProfileRepository {
  private readonly profileApi = inject(ProfileApiService);
  private readonly auth = inject(AuthSessionService);

  override async getAccount(): Promise<Account> {
    const user = this.auth.getCurrentUser();
    if (!user) {
      throw new Error('No authenticated user');
    }

    const dto = await firstValueFrom(this.profileApi.getMe());
    return AccountMapper.toAccount(dto, user);
  }

  override async updateProfile(_id: string, patch: Partial<Profile>): Promise<Profile> {
    const payload = this.toPayload(patch);
    const dto = await firstValueFrom(this.profileApi.updateMe(payload));
    return AccountMapper.toProfile(dto);
  }

  override setStatus(_id: string, _status: ProfileStatus): Promise<Profile> {
    throw new Error('Profile status endpoint is not available yet.');
  }

  override addPhoto(_id: string, _url: string): Promise<Profile> {
    throw new Error('Profile photo endpoints are not available yet.');
  }

  override removePhoto(_id: string, _photoId: string): Promise<Profile> {
    throw new Error('Profile photo endpoints are not available yet.');
  }

  override setCover(_id: string, _photoId: string): Promise<Profile> {
    throw new Error('Profile photo endpoints are not available yet.');
  }

  private toPayload(patch: Partial<Profile>): ProfileUpdatePayload {
    const payload: ProfileUpdatePayload = {};

    if ('profileName' in patch) payload.profileName = patch.profileName;
    if ('gender' in patch) payload.gender = patch.gender;
    if ('age' in patch) payload.age = patch.age;
    if ('hairColor' in patch) payload.hairColor = patch.hairColor;
    if ('heightCm' in patch) payload.heightCm = patch.heightCm;
    if ('weightKg' in patch) payload.weightKg = patch.weightKg;
    if ('orientation' in patch) payload.orientation = patch.orientation;
    if ('country' in patch) payload.country = patch.country;
    if ('city' in patch) payload.city = patch.city;
    if ('phoneCountryCode' in patch) payload.phoneCountryCode = patch.phoneCountryCode;
    if ('phoneNumber' in patch) payload.phoneNumber = patch.phoneNumber;
    if ('availableAllDay' in patch) payload.availableAllDay = patch.availableAllDay;
    if ('scheduleFrom' in patch) payload.scheduleFrom = patch.scheduleFrom;
    if ('scheduleTo' in patch) payload.scheduleTo = patch.scheduleTo;
    if ('website' in patch) payload.website = patch.website;
    if ('basicRate' in patch) payload.basicRate = patch.basicRate;
    if ('serviceIds' in patch) payload.serviceIds = patch.serviceIds;
    if ('departureIds' in patch) payload.departureIds = patch.departureIds;
    if ('channelIds' in patch) payload.channelIds = patch.channelIds;

    return payload;
  }
}
