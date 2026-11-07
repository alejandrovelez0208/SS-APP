import { Component, input } from '@angular/core';
import { SelectFieldConfig } from '../../field-config.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-select-field',
  imports: [MatFormField, MatSelect, MatLabel, MatOption, ReactiveFormsModule],
  templateUrl: './select-field.html',
  styleUrl: './select-field.css',
})
export class SelectField {
  config = input.required<SelectFieldConfig>();
  control = input.required<FormControl>();
}
