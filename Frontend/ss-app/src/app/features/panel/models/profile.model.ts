export enum AccountType {
  INDEPENDENT = 'INDEPENDENT',
  AGENCY = 'AGENCY',
}

export enum ProfileStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PAUSED = 'PAUSED',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'OTHER';

export type Orientation =
  | 'HETEROSEXUAL'
  | 'HOMOSEXUAL'
  | 'BISEXUAL'
  | 'ASEXUAL'
  | 'PANSEXUAL'
  | 'QUEER'
  | 'QUESTIONING'
  | 'OTHER';

/**
 * Scenario usado solo por los datos mock. Desaparece cuando exista backend.
 */
export type MockScenario = 'INDEPENDENT' | 'AGENCY';

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

export interface ServiceOption {
  id: number;
  group: string;
  label: string;
}

export interface DepartureOption {
  id: number;
  label: string;
}

export interface ChannelOption {
  id: number;
  label: string;
}
