import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared-module';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type: 'danger' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [SharedModule],
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {

  constructor(public dialogRef: MatDialogRef<ConfirmDialog>, @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData) {
    this.data.confirmText = this.data.confirmText || 'Confirm';
    this.data.cancelText = this.data.cancelText || 'Cancel';
    this.data.type = this.data.type || 'info';
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
