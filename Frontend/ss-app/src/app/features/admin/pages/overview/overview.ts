import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AdminAccountsStateService } from '../../data-access/admin-accounts.state.service';

@Component({
  selector: 'app-admin-overview',
  imports: [MatIconModule, RouterLink],
  templateUrl: './overview.html',
  styleUrls: ['../../styles/admin-page.css', './overview.css'],
})
export class Overview {
  private readonly accountsService = inject(AdminAccountsStateService);

  readonly overview = this.accountsService.overview;
}
