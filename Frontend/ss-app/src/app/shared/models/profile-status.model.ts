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

export enum AccountType {
  INDEPENDENT = 'INDEPENDENT',
  AGENCY = 'AGENCY',
}

export type ProfileState = `${ProfileStatus}`;

export type ProfileVerification = `${VerificationStatus}`;

export type ProfileAccountType = `${AccountType}`;

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

export type ApiGender = Gender;

export type ApiOrientation = Orientation;
