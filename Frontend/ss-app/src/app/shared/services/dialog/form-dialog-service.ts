import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from '@shared/components/dynamic-form/field-config.model';
import { DialogDinamic } from 'app/features/admin/components/dialog-dinamic/dialog-dinamic';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormDialogService {
  private readonly dialog = inject(MatDialog);

  open<T>(data: DialogData): Observable<T | undefined> {
    return this.dialog
      .open<DialogDinamic, DialogData, T>(DialogDinamic, {
        width: '500px',
        panelClass: 'dialog-dinamic-panel',
        backdropClass: 'dialog-dinamic-backdrop',
        data,
      })
      .afterClosed();
  }
}
