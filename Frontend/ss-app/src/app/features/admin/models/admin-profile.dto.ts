import {
  AccountState,
  ApiGender,
  ApiOrientation,
  ModerationState,
  PhotoVisibility,
  ProfileAccountType,
  ProfileState,
  ProfileVerification,
} from './admin-profile.types';

/**
 * Contrato de la API admin de perfiles.
 */
export interface AdminProfilePhotoDto {
  id: number;
  url: string;
  primaryPhoto: boolean;
  sortOrder: number;
  visibility: PhotoVisibility;
  moderationStatus: ModerationState;
}

export interface AdminProfileSummaryDto {
  id: number;
  profileName: string;
  headline: string | null;
  accountId: number;
  accountName: string;
  accountEmail: string | null;
  accountType: ProfileAccountType | null;
  accountEnabled: boolean;
  accountStatus: AccountState;
  gender: ApiGender | null;
  age: number | null;
  city: string | null;
  country: string | null;
  status: ProfileState;
  verificationStatus: ProfileVerification;
  photosCount: number;
  completion: number;
  complete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileDetailDto extends AdminProfileSummaryDto {
  hairColor: string | null;
  heightCm: number | null;
  weightKg: number | null;
  orientation: ApiOrientation | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  website: string | null;
  basicRate: number | null;
  currency: string;
  availableAllDay: boolean;
  scheduleFrom: string | null;
  scheduleTo: string | null;
  services: string[];
  departures: string[];
  channels: string[];
  modalities: string[];
  photos: AdminProfilePhotoDto[];
}
