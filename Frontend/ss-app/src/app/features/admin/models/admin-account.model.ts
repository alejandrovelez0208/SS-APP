/**
 * Roles tal como los expone la API (enum Role del backend).
 */
export type ApiRole = 'USER' | 'ADMIN';

/**
 * Roles que usa la UI del panel (el backend no distingue "USERS").
 */
export type AccountRole = 'ADMIN' | 'USERS';

export type AccountStatus = 'ACTIVE' | 'INACTIVE';

export type ApiAccountStatus = 'ACTIVE' | 'SUSPENDED';

export type AccountType = 'INDEPENDENT' | 'AGENCY';

/**
 * Fila que devuelve el directorio (GET /api/users/get-all).
 */
export interface DirectoryUserDto {
  id: number;
  email: string;
  emailVerified: boolean;
  enabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  role: ApiRole;
  userName: string | null;
  accountType: AccountType | null;
  accountStatus: ApiAccountStatus | null;
}

export interface ProfileSummaryDto {
  id: number;
  profileName: string;
  gender: string;
  age: number | null;
  city: string | null;
  country: string | null;
  status: string;
  verificationStatus: string;
  phoneNumber: string | null;
  photosCount: number;
}

/**
 * Detalle que devuelve GET /api/users/{id}.
 */
export interface UserDetailDto extends DirectoryUserDto {
  profiles: ProfileSummaryDto[];
}

/**
 * Modelo de vista que consumen las tablas del panel.
 */
export interface DirectoryRow {
  id: string;
  email: string;
  userName: string;
  role: AccountRole;
  status: AccountStatus;
  joinedAt: string;
  lastLoginAt: string | null;
  emailVerified: boolean;
  accountType: AccountType | null;
}

export interface AccountFilters {
  search: string;
  status: AccountStatus | 'ALL';
  role: AccountRole | 'ALL';
}

export function canChangeAccountStatus(account: Pick<DirectoryRow, 'role'>): boolean {
  return account.role !== 'ADMIN';
}
