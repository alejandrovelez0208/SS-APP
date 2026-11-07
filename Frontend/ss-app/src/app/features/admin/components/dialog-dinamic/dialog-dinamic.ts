import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { buildFormGroup } from '@shared/components/dynamic-form/build-form-group';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';
import { DialogData } from '@shared/components/dynamic-form/field-config.model';

@Component({
  selector: 'app-dialog-dinamic',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, DynamicForm],
  templateUrl: './dialog-dinamic.html',
  styleUrl: './dialog-dinamic.css',
})
export class DialogDinamic {
  private readonly ref = inject(MatDialogRef<DialogDinamic>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly form = buildFormGroup(this.data.campos);

  cancelar() {
    this.ref.close();
  }

  guardar() {
    if (this.form.valid) {
      this.ref.close(this.form.getRawValue());
    }
  }
}
