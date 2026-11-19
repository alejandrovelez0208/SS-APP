import {
  AdminProfileDetail,
  AdminProfileDetailDto,
  AdminProfilePhoto,
  AdminProfilePhotoDto,
  AdminProfileSummary,
  AdminProfileSummaryDto,
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
    accountId: String(dto.accountId),
    accountName: dto.accountName,
    accountEmail: dto.accountEmail,
    accountType: dto.accountType,
    accountEnabled: dto.accountEnabled,
    accountStatus: dto.accountStatus,
    gender: genderLabel(dto.gender),
    age: dto.age,
    city: dto.city ?? '',
    country: dto.country ?? '',
    status: dto.status,
    verificationStatus: dto.verificationStatus,
    photosCount: dto.photosCount,
    completion: dto.completion,
    createdAt: dto.createdAt,
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
    primaryPhoto: dto.primaryPhoto,
    sortOrder: dto.sortOrder,
    visibility: dto.visibility,
    moderationStatus: dto.moderationStatus,
  };
}

export function genderLabel(gender: ApiGender): string {
  switch (gender) {
    case 'MALE':
      return 'Masculino';
    case 'FEMALE':
      return 'Femenino';
    case 'NON_BINARY':
      return 'No binario';
    default:
      return 'Otro';
  }
}

export function orientationLabel(orientation: ApiOrientation): string {
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
    default:
      return 'Otro';
  }
}

function toTime(value: string | null): string {
  if (!value) {
    return '';
  }
  return value.length >= 5 ? value.slice(0, 5) : value;
}
