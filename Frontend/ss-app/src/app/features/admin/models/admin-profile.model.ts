import {
  ModerationState,
  ProfileAccountType,
  ProfileState,
  ProfileVerification,
} from './admin-profile.types';

export * from './admin-profile.types';

/**
 * Modelos de vista que consumen las páginas del panel admin.
 */
export interface AdminProfilePhoto {
  id: string;
  url: string;
  moderationStatus: ModerationState;
}

export interface AdminProfileSummary {
  id: string;
  profileName: string;
  headline: string;
  accountName: string;
  accountEmail: string;
  accountType: ProfileAccountType | null;
  gender: string;
  age: number | null;
  city: string;
  country: string;
  status: ProfileState;
  verificationStatus: ProfileVerification;
  photosCount: number;
  completion: number;
  complete: boolean;
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
  verificationStatus?: ProfileVerification | 'ALL';
}

export interface AdminProfileQuery extends ProfileFilters {
  page: number;
  size: number;
}

export interface AdminProfileOverview {
  total: number;
  active: number;
  paused: number;
  inactive: number;
  draft: number;
}

export function canReactivateProfile(
  profile: Pick<AdminProfileSummary, 'status' | 'verificationStatus' | 'complete'>,
): boolean {
  return (
    profile.status === 'INACTIVE' &&
    profile.verificationStatus !== 'REJECTED' &&
    profile.complete
  );
}
