import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { map } from 'rxjs';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RoleBadge } from '../../components/role-badge/role-badge';
import { AdminAccountsStateService } from '../../data-access/admin-accounts.state.service';
import { AuthSessionService } from '@core/auth/auth-session.service';
import { DialogService } from '@shared/services/dialog/dialog.service';

@Component({
  selector: 'app-admin-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RoleBadge,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  providers: [AdminAccountsStateService],
  templateUrl: './admin-shell.html',
  styleUrl: './admin-shell.css',
})
export class AdminShell {
  private readonly authService = inject(AuthSessionService);
  private readonly dialogService = inject(DialogService);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 1023px)').pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  closeMenu(drawer: MatDrawer): void {
    if (this.isMobile()) {
      drawer.close();
    }
  }

  logout(): void {
    this.dialogService
      .openConfirmation(
        'Logout?',
        'Are you sure you want to logout?',
        'Logout',
        'Cancel',
        'warning',
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.authService.logout();
        }
      });
  }
}
