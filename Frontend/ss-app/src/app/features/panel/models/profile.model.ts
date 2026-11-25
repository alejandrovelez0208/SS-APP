import {
  AccountType,
  ProfileStatus,
  VerificationStatus,
} from '@shared/models/profile-status.model';
import type {
  Gender,
  Orientation,
} from '@shared/models/profile-status.model';

export {
  AccountType,
  ProfileStatus,
  VerificationStatus,
} from '@shared/models/profile-status.model';
export type {
  Gender,
  Orientation,
} from '@shared/models/profile-status.model';

export interface ProfilePhoto {
  id: string;
  /** dataURL en mock; URL real cuando exista el servicio. */
  url: string;
  isCover: boolean;
  sortOrder: number;
}

export interface Profile {
  id: string;
  accountId: string;
  isPrimary: boolean;

  // Identity (required)
  profileName: string;
  gender: Gender;
  age: number;
  country: string;
  city: string;
  hairColor: string;

  // Physical (required)
  heightCm: number;
  weightKg: number;
  orientation: Orientation;

  // Recommended
  headline: string;
  aboutShort: string;
  aboutLong: string;
  bustCm: number | null;
  waistCm: number | null;
  hipsCm: number | null;

  // Operations
  phoneCountryCode: string;
  phoneNumber: string;
  channelIds: number[];
  website: string;
  serviceIds: number[];
  departureIds: number[];
  basicRate: number;
  currency: 'COP';
  availableAllDay: boolean;
  scheduleFrom: string;
  scheduleTo: string;

  photos: ProfilePhoto[];

  status: ProfileStatus;
  /** Se guarda a nivel de Account; se replica para facilitar la maqueta. */
  verificationStatus: VerificationStatus;
  updatedAt: string;
}

export interface Account {
  id: string;
  type: AccountType;
  userName: string;
  email: string;
  maxProfiles: number;
  verificationStatus: VerificationStatus;
  profiles: Profile[];
}
