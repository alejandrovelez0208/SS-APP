export type AccountRole = 'ADMIN' | 'USERS';
export type AccountStatus = 'ACTIVE' | 'INACTIVE';
export type ProfileType = 'ESCORT' | 'MEMBER';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  joinedAt: string;
}

export interface EscortProfile {
  companionName: string;
  gender: string;
  age: number;
  hairColor: string;
  height: number;
  weight: number;
  orientation: string;
  nationality: string;
  baseCity: string;
  phoneCode: string;
  phone: string;
  attendsTo: string[];
  availableAllDay: boolean;
  scheduleFrom: string;
  scheduleTo: string;
  communicationChannels: string[];
  website: string;
  serviceTypes: Array<{ category: string; services: string[] }>;
  departures: string[];
  basicRate: number;
  photosCount: number;
}

export interface MemberProfile {
  identity: string;
  lookingFor: string;
}

export interface AccountDetail extends UserAccount {
  profileType: ProfileType | null;
  profile: EscortProfile | MemberProfile | null;
}

export interface AccountSummary {
  id: string;
  username: string;
  email: string;
  role: AccountRole;
  status: AccountStatus;
  profileType: ProfileType | null;
}

export interface AccountFilters {
  search: string;
  status: AccountStatus | 'ALL';
  role: AccountRole | 'ALL';
}

export function isEscortProfile(profile: AccountDetail['profile']): profile is EscortProfile {
  return profile !== null && 'companionName' in profile;
}

export function isMemberProfile(profile: AccountDetail['profile']): profile is MemberProfile {
  return profile !== null && 'identity' in profile;
}

export function canChangeAccountStatus(account: Pick<UserAccount, 'role'>): boolean {
  return account.role !== 'ADMIN';
}
