import { AuthUser } from '@core/auth/auth.models';
import { ProfileApiResponse } from '@shared/services/profiles/profile-api.service';
import {
  Account,
  AccountType,
  Gender,
  Orientation,
  Profile,
  ProfileStatus,
  VerificationStatus,
} from '../models/profile.model';

export class AccountMapper {
  static toAccount(dto: ProfileApiResponse, user: AuthUser): Account {
    return {
      id: String(dto.id),
      type:
        user.accountType === 'AGENCY' ? AccountType.AGENCY : AccountType.INDEPENDENT,
      userName: user.fullName,
      email: user.email,
      maxProfiles: user.accountType === 'AGENCY' ? 10 : 1,
      verificationStatus: dto.verificationStatus as VerificationStatus,
      profiles: [AccountMapper.toProfile(dto)],
    };
  }

  static toProfile(dto: ProfileApiResponse): Profile {
    return {
      id: String(dto.id),
      accountId: 'me',
      isPrimary: true,

      // Identity
      profileName: dto.profileName,
      gender: dto.gender as Gender,
      age: dto.age,
      country: dto.country ?? '',
      city: dto.city ?? '',
      hairColor: dto.hairColor ?? '',

      // Physical
      heightCm: dto.heightCm ?? 0,
      weightKg: dto.weightKg ?? 0,
      orientation: (dto.orientation ?? 'OTHER') as Orientation,

      // Recommended (no existen aún en el backend)
      headline: '',
      aboutShort: '',
      aboutLong: '',
      bustCm: null,
      waistCm: null,
      hipsCm: null,

      // Operations
      phoneCountryCode: dto.phoneCountryCode ?? '',
      phoneNumber: dto.phoneNumber ?? '',
      channelIds: dto.channelIds ?? [],
      website: dto.website ?? '',
      serviceIds: dto.serviceIds ?? [],
      departureIds: dto.departureIds ?? [],
      basicRate: dto.basicRate ?? 0,
      currency: 'COP',
      availableAllDay: dto.availableAllDay,
      scheduleFrom: this.toTime(dto.scheduleFrom),
      scheduleTo: this.toTime(dto.scheduleTo),

      photos: [],

      status: dto.status as ProfileStatus,
      verificationStatus: dto.verificationStatus as VerificationStatus,
      updatedAt: dto.updatedAt ?? new Date().toISOString(),
    };
  }

  /**
   * El backend serializa LocalTime como "HH:mm:ss"; los inputs usan "HH:mm".
   */
  private static toTime(value: string | null): string {
    return value ? value.slice(0, 5) : '00:00';
  }
}
