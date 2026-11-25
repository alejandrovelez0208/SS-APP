import {
  AdminProfileDetailDto,
  AdminProfilePhotoDto,
  AdminProfileSummaryDto,
} from '../models/admin-profile.dto';
import {
  AdminProfileDetail,
  AdminProfilePhoto,
  AdminProfileSummary,
  ApiGender,
  ApiOrientation,
} from '../models/admin-profile.model';

export function toAdminProfileSummary(
  dto: AdminProfileSummaryDto,
): AdminProfileSummary {
  return {
    id: String(dto.id),
    profileName: dto.profileName,
    headline: dto.headline ?? '',
    accountName: dto.accountName,
    accountEmail: dto.accountEmail ?? '',
    accountType: dto.accountType,
    gender: genderLabel(dto.gender),
    age: dto.age,
    city: dto.city ?? '',
    country: dto.country ?? '',
    status: dto.status,
    verificationStatus: dto.verificationStatus,
    photosCount: dto.photosCount,
    completion: dto.completion,
    complete: dto.complete,
    updatedAt: dto.updatedAt,
  };
}

export function toAdminProfileDetail(
  dto: AdminProfileDetailDto,
): AdminProfileDetail {
  return {
    ...toAdminProfileSummary(dto),
    hairColor: dto.hairColor ?? '',
    heightCm: dto.heightCm,
    weightKg: dto.weightKg,
    orientation: orientationLabel(dto.orientation),
    phoneCountryCode: dto.phoneCountryCode ?? '',
    phoneNumber: dto.phoneNumber ?? '',
    website: dto.website ?? '',
    basicRate: dto.basicRate,
    currency: dto.currency,
    availableAllDay: dto.availableAllDay,
    scheduleFrom: toTime(dto.scheduleFrom),
    scheduleTo: toTime(dto.scheduleTo),
    services: dto.services ?? [],
    departures: dto.departures ?? [],
    channels: dto.channels ?? [],
    modalities: dto.modalities ?? [],
    photos: (dto.photos ?? []).map(toAdminProfilePhoto),
  };
}

export function toAdminProfilePhoto(dto: AdminProfilePhotoDto): AdminProfilePhoto {
  return {
    id: String(dto.id),
    url: dto.url,
    moderationStatus: dto.moderationStatus,
  };
}

export function genderLabel(gender: ApiGender | null): string {
  switch (gender) {
    case 'MALE':
      return 'Male';
    case 'FEMALE':
      return 'Female';
    case 'NON_BINARY':
      return 'Non-binary';
    case 'OTHER':
      return 'Other';
    default:
      return '—';
  }
}

export function orientationLabel(orientation: ApiOrientation | null): string {
  switch (orientation) {
    case 'HETEROSEXUAL':
      return 'Heterosexual';
    case 'HOMOSEXUAL':
      return 'Homosexual';
    case 'BISEXUAL':
      return 'Bisexual';
    case 'ASEXUAL':
      return 'Asexual';
    case 'PANSEXUAL':
      return 'Pansexual';
    case 'QUEER':
      return 'Queer';
    case 'QUESTIONING':
      return 'Questioning';
    case 'OTHER':
      return 'Other';
    default:
      return '—';
  }
}

function toTime(value: string | null): string {
  if (!value) {
    return '';
  }
  return value.length >= 5 ? value.slice(0, 5) : value;
}
