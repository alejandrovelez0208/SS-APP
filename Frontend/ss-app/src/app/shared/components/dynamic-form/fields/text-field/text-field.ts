import { Component, input } from '@angular/core';
import { TextFieldConfig } from '../../field-config.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-field',
  imports: [MatLabel, ReactiveFormsModule, MatFormField, MatInputModule],
  templateUrl: './text-field.html',
  styleUrl: './text-field.css',
})
export class TextField {
  config = input.required<TextFieldConfig>();
  control = input.required<FormControl>();
}
