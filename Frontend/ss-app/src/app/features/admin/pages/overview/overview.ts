import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AdminAccountsService } from '../../services/admin-accounts.service';

@Component({
  selector: 'app-admin-overview',
  imports: [MatIconModule, RouterLink],
  templateUrl: './overview.html',
  styleUrls: ['../../styles/admin-page.css', './overview.css'],
})
export class Overview {
  private readonly accountsService = inject(AdminAccountsService);

  readonly overview = this.accountsService.overview;
}
