import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ProfileStateService } from '../../data-access/profile-state.service';

@Component({
  selector: 'app-panel-settings',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings.html',
  styleUrls: ['../../styles/panel-page.css', './settings.css'],
})
export class Settings {
  private readonly state = inject(ProfileStateService);
  private readonly dialog = inject(DialogService);
  private readonly notification = inject(NotificationService);

  readonly account = this.state.account;
  readonly isAgency = this.state.isAgency;

  readonly notifications = new FormGroup({
    emailUpdates: new FormControl(true, { nonNullable: true }),
    newMessages: new FormControl(true, { nonNullable: true }),
    marketing: new FormControl(false, { nonNullable: true }),
  });

  saveAccount(): void {
    this.notification.success('Account settings saved (mock).');
  }

  deleteAccount(): void {
    this.dialog
      .openConfirmation(
        'Delete account?',
        'This is a demo. In the real panel this action is irreversible.',
        'Delete',
        'Cancel',
        'danger',
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          this.notification.success('Delete flow is not wired in the mock.');
        }
      });
  }
}
