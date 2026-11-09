import {
  AccountRole,
  AccountStatus,
  DirectoryRow,
  DirectoryUserDto,
} from '../models/admin-account.model';

/**
 * El backend usa "USER"; la UI muestra "USERS". Se mapea en el borde
 * para que los componentes no conozcan esa diferencia.
 */
export function toAccountRole(role: DirectoryUserDto['role']): AccountRole {
  return role === 'ADMIN' ? 'ADMIN' : 'USERS';
}

/**
 * Regla única de estado: la cuenta se considera activa solo si el usuario
 * puede iniciar sesión y la cuenta no está suspendida.
 */
export function toAccountStatus(user: DirectoryUserDto): AccountStatus {
  const accountActive = user.accountStatus === null || user.accountStatus === 'ACTIVE';
  return user.enabled && accountActive ? 'ACTIVE' : 'INACTIVE';
}

export function toDirectoryRow(user: DirectoryUserDto): DirectoryRow {
  return {
    id: String(user.id),
    email: user.email,
    userName: user.userName?.trim() || user.email.split('@')[0],
    role: toAccountRole(user.role),
    status: toAccountStatus(user),
    joinedAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    emailVerified: user.emailVerified,
    accountType: user.accountType,
  };
}
