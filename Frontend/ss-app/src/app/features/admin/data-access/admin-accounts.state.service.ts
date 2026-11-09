import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, map, tap, throwError } from 'rxjs';
import {
  AccountFilters,
  AccountStatus,
  DirectoryRow,
  UserDetailDto,
  canChangeAccountStatus,
} from '../models/admin-account.model';
import { AdminDirectoryApiService } from './admin-directory-api-service';
import { toDirectoryRow } from './admin-directory.mapper';

/**
 * Estado compartido del directorio de usuarios.
 *
 * Accounts y User Control consumen la misma instancia (provista en el shell),
 * por lo que se realiza una sola carga y ambos ven los mismos datos.
 */
@Injectable()
export class AdminAccountsStateService {
  private readonly api = inject(AdminDirectoryApiService);

  private readonly rowsState = signal<DirectoryRow[]>([]);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private loaded = false;

  readonly accounts = this.rowsState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  readonly overview = computed(() => ({
    total: this.accounts().length,
    active: this.accounts().filter((account) => account.status === 'ACTIVE').length,
    inactive: this.accounts().filter((account) => account.status === 'INACTIVE').length,
  }));

  load(force = false): void {
    if (this.loaded && !force) {
      return;
    }

    this.loadingState.set(true);
    this.errorState.set(null);

    this.api.getAllUsers().subscribe({
      next: (users) => {
        this.rowsState.set(users.map(toDirectoryRow));
        this.loaded = true;
      },
      error: (error: unknown) => {
        console.error('Error loading directory users', error);
        this.errorState.set('Could not load users. Please try again.');
      },
      complete: () => this.loadingState.set(false),
    });
  }

  searchAccounts(filters: AccountFilters): DirectoryRow[] {
    const search = filters.search.trim().toLowerCase();

    return this.accounts()
      .filter((account) => filters.status === 'ALL' || account.status === filters.status)
      .filter((account) => filters.role === 'ALL' || account.role === filters.role)
      .filter(
        (account) =>
          !search ||
          account.userName.toLowerCase().includes(search) ||
          account.email.toLowerCase().includes(search),
      );
  }

  getAccount(id: string): DirectoryRow | undefined {
    return this.accounts().find((account) => account.id === id);
  }

  getUserDetail(id: string): Observable<UserDetailDto> {
    return this.api.getUserById(id);
  }

  changeStatus(id: string, status: AccountStatus): Observable<DirectoryRow> {
    const account = this.getAccount(id);
    if (account && !canChangeAccountStatus(account)) {
      return throwError(() => new Error("Admin accounts can't be deactivated."));
    }

    return this.api.updateStatus(id, status === 'ACTIVE').pipe(
      map(toDirectoryRow),
      tap((updated) => {
        this.rowsState.update((accounts) =>
          accounts.map((account) => (account.id === updated.id ? updated : account)),
        );
      }),
    );
  }
}
