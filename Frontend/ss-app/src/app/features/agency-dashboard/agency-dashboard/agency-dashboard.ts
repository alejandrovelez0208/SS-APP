import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';
import { AuthService } from '../../../shared/services/auth/auth-service';
import { DialogService } from '../../../shared/services/dialog/dialog-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agency-dashboard',
  imports: [SharedModule],
  templateUrl: './agency-dashboard.html',
  styleUrls: ['../../../shared/styles/brand.css', './agency-dashboard.css'],
})
export class AgencyDashboard {

constructor(private authService: AuthService, private dialogService: DialogService, private router: Router) { }

    logout() {
    this.dialogService.openConfirmation('Logout?', 'Are you sure you want to logout?', 'Logout', 'Cancel', 'warning').subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }
}
