export type ProfileState = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'INACTIVE';

export type ProfileVerification = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ProfileAccountType = 'INDEPENDENT' | 'AGENCY';

export type AccountState = 'ACTIVE' | 'SUSPENDED';

export type ApiGender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';

export type ApiOrientation =
  | 'HETEROSEXUAL'
  | 'HOMOSEXUAL'
  | 'BISEXUAL'
  | 'ASEXUAL'
  | 'PANSEXUAL'
  | 'QUEER'
  | 'QUESTIONING'
  | 'OTHER';

export type PhotoVisibility = 'PUBLIC' | 'PRIVATE';

export type ModerationState = 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Contrato de la API admin de perfiles.
 * Estos tipos reflejan los DTOs del backend definidos en A01.
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
  accountEmail: string;
  accountType: ProfileAccountType;
  accountEnabled: boolean;
  accountStatus: AccountState;
  gender: ApiGender;
  age: number | null;
  city: string | null;
  country: string | null;
  status: ProfileState;
  verificationStatus: ProfileVerification;
  photosCount: number;
  completion: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileDetailDto extends AdminProfileSummaryDto {
  hairColor: string | null;
  heightCm: number | null;
  weightKg: number | null;
  orientation: ApiOrientation;
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

/**
 * Modelos de vista que consumen las páginas del panel admin.
 */
export interface AdminProfilePhoto {
  id: string;
  url: string;
  primaryPhoto: boolean;
  sortOrder: number;
  visibility: PhotoVisibility;
  moderationStatus: ModerationState;
}

export interface AdminProfileSummary {
  id: string;
  profileName: string;
  headline: string;
  accountId: string;
  accountName: string;
  accountEmail: string;
  accountType: ProfileAccountType;
  accountEnabled: boolean;
  accountStatus: AccountState;
  gender: string;
  age: number | null;
  city: string;
  country: string;
  status: ProfileState;
  verificationStatus: ProfileVerification;
  photosCount: number;
  completion: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProfileDetail extends AdminProfileSummary {
  hairColor: string;
  heightCm: number | null;
  weightKg: number | null;
  orientation: string;
  phoneCountryCode: string;
  phoneNumber: string;
  website: string;
  basicRate: number | null;
  currency: string;
  availableAllDay: boolean;
  scheduleFrom: string;
  scheduleTo: string;
  services: string[];
  departures: string[];
  channels: string[];
  modalities: string[];
  photos: AdminProfilePhoto[];
}

export interface ProfileFilters {
  search: string;
  status: ProfileState | 'ALL';
  accountType: ProfileAccountType | 'ALL';
}

export function canReactivateProfile(
  profile: Pick<AdminProfileSummary, 'status' | 'verificationStatus'>,
): boolean {
  return profile.status === 'INACTIVE' && profile.verificationStatus !== 'REJECTED';
}
