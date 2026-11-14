/**
 * Modelo de maqueta para la moderación de perfiles del panel admin.
 * Cuando exista el endpoint real, este modelo se reemplaza por los DTO de la API.
 */

export type ProfileState = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'INACTIVE';

export type ProfileVerification = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type ProfileAccountType = 'INDEPENDENT' | 'AGENCY';

export interface AdminProfile {
  id: string;
  profileName: string;
  headline: string;

  accountId: string;
  accountName: string;
  accountEmail: string;
  accountType: ProfileAccountType;

  gender: string;
  age: number;
  city: string;
  country: string;
  hairColor: string;
  heightCm: number;
  weightKg: number;
  orientation: string;

  status: ProfileState;
  verificationStatus: ProfileVerification;
  photosCount: number;
  completion: number;

  createdAt: string;
  updatedAt: string;

  phoneCountryCode: string;
  phoneNumber: string;
  website: string;
  basicRate: number;
  currency: string;
  availableAllDay: boolean;
  scheduleFrom: string;
  scheduleTo: string;

  services: string[];
  departures: string[];
  channels: string[];
  modalities: string[];
}

export interface ProfileFilters {
  search: string;
  status: ProfileState | 'ALL';
  accountType: ProfileAccountType | 'ALL';
}

export function canReactivateProfile(
  profile: Pick<AdminProfile, 'status' | 'verificationStatus'>,
): boolean {
  return profile.status === 'INACTIVE' && profile.verificationStatus !== 'REJECTED';
}
