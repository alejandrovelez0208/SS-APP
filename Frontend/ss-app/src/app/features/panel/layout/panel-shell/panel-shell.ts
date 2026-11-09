import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { AuthSessionService } from '@core/auth/auth-session.service';
import { AuthApiService } from '@core/auth/auth-api.service';
import { navFor } from '../../constants/panel-nav.config';
import { ProfileStateService } from '../../data-access/profile-state.service';
import { AccountType, MockScenario } from '../../models/profile.model';

@Component({
  selector: 'app-panel-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './panel-shell.html',
  styleUrl: './panel-shell.css',
})
export class PanelShell implements OnInit {
  private readonly state = inject(ProfileStateService);
  private readonly authService = inject(AuthSessionService);
  private readonly authApi = inject(AuthApiService);
  private readonly dialogService = inject(DialogService);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly breakpointObserver = inject(BreakpointObserver);

  readonly account = this.state.account;
  readonly navItems = computed(() => navFor(this.state.accountType()));
  readonly user = toSignal(this.authService.currentUser$, {
    initialValue: this.authService.getCurrentUser(),
  });
  readonly needsEmailVerification = computed(
    () => this.user() !== null && !this.user()?.emailVerified,
  );
  readonly needsProfile = computed(
    () => this.user() !== null && !this.user()?.profileComplete,
  );

  readonly accountTypeLabel = computed(() => {
    switch (this.state.accountType()) {
      case AccountType.AGENCY:
        return 'Agency';
      case AccountType.INDEPENDENT:
        return 'Independent';
      default:
        return 'Account';
    }
  });

  readonly isMobile = toSignal(
    this.breakpointObserver.observe('(max-width: 1023px)').pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  ngOnInit(): void {
    const scenario: MockScenario =
      this.route.snapshot.queryParamMap.get('mock') === 'agency' ? 'AGENCY' : 'INDEPENDENT';
    void this.state.load(scenario);
    this.showProfileNotice();
  }

  private showProfileNotice(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      return;
    }

    const incomplete = !user.profileComplete;
    const unverified = !user.emailVerified;
    if (!incomplete && !unverified) {
      return;
    }

    const message = incomplete
      ? 'Your profile is out of date. Complete it so clients can find you.'
      : 'Your email is not verified. Verify it to publish your profile.';

    this.dialogService.openNotice('Profile notice', message).subscribe();
  }

  closeMenu(drawer: MatDrawer): void {
    if (this.isMobile()) {
      drawer.close();
    }
  }

  resendVerification(): void {
    const email = this.user()?.email;
    if (!email) {
      return;
    }

    this.authApi.resendVerificationEmail(email).subscribe({
      next: () => this.notification.success('Verification email sent. Please check your inbox.'),
      error: () => this.notification.error('Could not send the verification email.'),
    });
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
