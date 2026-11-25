import { Observable } from 'rxjs';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ProfileState } from '../models/admin-profile.model';
import { AdminProfilesStateService } from './admin-profiles.state.service';

export function applyProfileStatus(
  state: AdminProfilesStateService,
  notification: NotificationService,
  id: string,
  status: ProfileState,
  successMessage: string,
): void {
  state.changeStatus(id, status).subscribe({
    next: () => notification.success(successMessage),
    error: (error: unknown) => {
      console.error('Error updating profile status', error);
      notification.error('Could not update the profile status.');
    },
  });
}

export function confirmProfileDeactivation(
  dialog: DialogService,
  profileName: string,
): Observable<boolean> {
  return dialog.openConfirmation(
    'Deactivate profile?',
    `"${profileName}" will be hidden from the public site. The account will stay active.`,
    'Deactivate',
    'Cancel',
    'danger',
  );
}
