import { Profile } from "../models/profile.model";

export const GENDER_OPTIONS: ReadonlyArray<{
  value: Profile['gender'];
  label: string;
}> = [
  { value: 'FEMALE', label: 'Female' },
  { value: 'MALE', label: 'Male' },
  { value: 'NON_BINARY', label: 'Non-binary' },
  { value: 'OTHER', label: 'Other' },
];

export const ORIENTATION_OPTIONS: ReadonlyArray<{
  value: Profile['orientation'];
  label: string;
}> = [
  { value: 'HETEROSEXUAL', label: 'Heterosexual' },
  { value: 'HOMOSEXUAL', label: 'Homosexual' },
  { value: 'BISEXUAL', label: 'Bisexual' },
  { value: 'ASEXUAL', label: 'Asexual' },
  { value: 'PANSEXUAL', label: 'Pansexual' },
  { value: 'QUEER', label: 'Queer' },
  { value: 'QUESTIONING', label: 'Questioning' },
  { value: 'OTHER', label: 'Other' },
];

export const HAIR_COLORS: readonly string[] = [
  'Black',
  'Brown',
  'Blonde',
  'Red',
  'Auburn',
  'Other',
];