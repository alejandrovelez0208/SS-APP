import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared-module';

@Component({
  selector: 'app-agency-dashboard',
  imports: [SharedModule],
  templateUrl: './agency-dashboard.html',
  styleUrl: './agency-dashboard.css',
})
export class AgencyDashboard {}
