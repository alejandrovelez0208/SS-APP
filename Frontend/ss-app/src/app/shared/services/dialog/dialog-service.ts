import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmDialog } from '../../components/confirm-dialog/confirm-dialog';
import { DIALOG_CONFIG } from '../../constants/dialog.config';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openConfirmation(
    title: string,
    message: string,
    confirmText: string = 'Confirm',
    cancelText: string = 'Cancel',
    type: 'warning' | 'danger' | 'info' = 'warning',
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialog, {
      ...DIALOG_CONFIG.CONFIRM,
      data: {
        title,
        message,
        confirmText,
        cancelText,
        type,
      },
    });
    return dialogRef.afterClosed();
  }
}
