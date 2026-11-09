import { Component, input } from '@angular/core';
import { TextFieldConfig } from '../../field-config.model';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-text-field',
  imports: [MatLabel, MatPrefix, ReactiveFormsModule, MatFormField, MatIconModule, MatInputModule],
  templateUrl: './text-field.html',
})
export class TextField {
  config = input.required<TextFieldConfig>();
  control = input.required<FormControl>();
}
