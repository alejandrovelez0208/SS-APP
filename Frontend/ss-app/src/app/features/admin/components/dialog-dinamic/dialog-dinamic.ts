import { CommonModule } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { buildFormGroup } from '@shared/components/dynamic-form/build-form-group';
import { DynamicForm } from '@shared/components/dynamic-form/dynamic-form';
import { DialogData } from '@shared/components/dynamic-form/field-config.model';
export interface CampoConfig {
  nombre: string;
  etiqueta: string;
  tipo?: string;
  valor?: any;
  opciones?: any[];
}

@Component({
  selector: 'app-dialog-dinamic',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, DynamicForm],
  templateUrl: './dialog-dinamic.html',
  styleUrl: './dialog-dinamic.css',
})
export class DialogDinamic {
  private readonly ref = inject(MatDialogRef<DialogDinamic>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly form = buildFormGroup(this.data.campos);

  cancelar() { this.ref.close(); }
  guardar() { if (this.form.valid) this.ref.close(this.form.getRawValue()); }
}