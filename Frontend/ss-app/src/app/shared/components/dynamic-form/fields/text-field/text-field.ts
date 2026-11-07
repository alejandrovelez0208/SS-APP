import { Component, input } from '@angular/core';
import { TextFieldConfig } from '../../field-config.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-text-field',
  imports: [MatLabel, ReactiveFormsModule, MatFormField],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
})
export class TextField {
  config = input.required<TextFieldConfig>();
  control = input.required<FormControl>();
}
