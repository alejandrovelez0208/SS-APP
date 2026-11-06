export type ProfileType = 'escort' | 'member';

export interface ProfileTypeOption {
  value: ProfileType;
  title: string;
  description: string;
  img: string;
  class: string;
}

export const PROFILE_TYPE_OPTIONS: ProfileTypeOption[] = [
  {
    value: 'escort',
    title: 'Escort',
    description: 'I am an escort looking for clients.',
    img: '/woman.png',
    class: 'type-escort',
  },
  {
    value: 'member',
    title: 'Member',
    description: 'I am a member looking for escorts.',
    img: '/man.png',
    class: 'type-member',
  },
];

export type CredentialsFieldKey = 'user-name' | 'email-and-password';

export interface CredentialsField {
  key: CredentialsFieldKey;
}

export const CREDENTIALS_FIELDS: CredentialsField[] = [
  {
    key: 'user-name',
  },
  {
    key: 'email-and-password',
  },
];
