import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BrandLogo } from '@shared/components/brand-logo/brand-logo';
import { AuthService } from '@shared/services/auth/auth-service';
import { DialogService } from '@shared/services/dialog/dialog-service';

@Component({
  selector: 'app-agency-dashboard',
  imports: [
    BrandLogo,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './agency-dashboard.html',
  styleUrl: './agency-dashboard.css',
})
export class AgencyDashboard {
  constructor(
    private readonly authService: AuthService,
    private readonly dialogService: DialogService,
  ) {}

  logout(): void {
    this.dialogService
      .openConfirmation(
        'Logout?',
        'Are you sure you want to logout?',
        'Logout',
        'Cancel',
        'warning',
      )
      .subscribe((result) => {
        if (result) {
          this.authService.logout();
        }
      });
  }
}
