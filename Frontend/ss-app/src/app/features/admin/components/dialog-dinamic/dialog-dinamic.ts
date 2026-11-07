import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
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
  imports: [
    CommonModule,      
    ReactiveFormsModule, 
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './dialog-dinamic.html',
  styleUrl: './dialog-dinamic.css',
})
export class DialogDinamic implements OnInit {
  form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogDinamic>,
    @Inject(MAT_DIALOG_DATA) public data: { titulo: string, campos: CampoConfig[] },
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const group: any = {};
    this.data.campos.forEach(campo => {
      group[campo.nombre] = [campo.valor || '', Validators.required];
    });
    this.form = this.fb.group(group);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}