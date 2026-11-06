import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { GENDER } from '../../../../constants/gender';
import { HAIR_COLOR } from '../../../../constants/hair-color';

@Component({
  selector: 'app-basics-step',
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    ReactiveFormsModule,
  ],
  templateUrl: './basics-step.html',
  styleUrls: [
    '../styles/fields.css',
    '../styles/sliders.css',
    '../../../../../../../shared/styles/form-field.css',
    './basics-step.css',
  ],
})
export class BasicsStep {
  @Input({ required: true }) form!: FormGroup;

  readonly genders = Object.values(GENDER);
  readonly hairColor = Object.values(HAIR_COLOR);

  get genderIconName(): string {
    const gender = this.form.get('gender')?.value;

    if (gender === GENDER[0]) {
      return 'male';
    } else if (gender === GENDER[1]) {
      return 'female';
    } else if (gender === GENDER[2]) {
      return 'transgender';
    }

    return '';
  }
}
