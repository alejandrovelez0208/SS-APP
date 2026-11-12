import { AsyncPipe } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { Observable } from 'rxjs';
import { City, Nationality } from '@shared/models/escort.model';

@Component({
  selector: 'app-physical-step',
  imports: [
    AsyncPipe,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    ReactiveFormsModule,
  ],
  templateUrl: './physical-step.html',
  styleUrls: [
    '../styles/fields.css',
    '../styles/sliders.css',
    '../../../../../../../shared/styles/form-field.css',
    './physical-step.css',
  ],
})
export class PhysicalStep implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() filteredNationalities!: Observable<Nationality[]>;
  @Input() baseCity: City[] = [];

  readonly heightValue = signal(160);

  ngOnInit(): void {
    this.heightValue.set(this.form.get('heightCm')?.value ?? 160);
  }

  displayFn = (nationality: Nationality | string | null): string => {
    if (!nationality) {
      return '';
    }
    return typeof nationality === 'string' ? nationality : (nationality.names?.common ?? '');
  };

  onHeightChange(value: number): void {
    this.heightValue.set(value);
  }

  formatHeight(value: number): string {
    if (!value) return '1.60 m';
    return (value / 100).toFixed(2) + ' m';
  }

  formatWeight(value: number): string {
    if (!value) return '60 kg';
    return value + ' kg';
  }
}
