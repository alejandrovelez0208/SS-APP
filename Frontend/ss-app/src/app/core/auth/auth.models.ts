export type AccountType = 'INDEPENDENT' | 'AGENCY';

export interface AuthUser {
  token?: string | null;
  refreshToken?: string | null;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'USER' | 'USERS';
  profileId: number | null;
  profileComplete: boolean;
  emailVerified: boolean;
  accountType: AccountType | null;
}
