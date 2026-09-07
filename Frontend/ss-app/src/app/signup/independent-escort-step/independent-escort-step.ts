import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { INDEPENDENT_ESCORT_FIELDS } from '../fields/sign-up.fields';
import { HAIR_COLOR } from '../../shared/enums/hairColor';
import { GENDER } from '../../shared/enums/gender';

@Component({
  selector: 'app-independent-escort-step',
  imports: [SharedModule],
  templateUrl: './independent-escort-step.html',
  styleUrl: './independent-escort-step.css',
})
export class IndependentEscortStep implements OnInit {
  @Input() independentEscortform!: FormGroup;

  @Output() backToProfileType = new EventEmitter<void>();

  fields = INDEPENDENT_ESCORT_FIELDS;
  currentStep = 0;

  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;

  genders = Object.values(GENDER);
  hairColor = Object.values(HAIR_COLOR);

  heightValue = signal(1.6);
  weightValue = signal(60);
  ageValue = signal(18);

  ngOnInit(): void {
    this.heightValue.set(this.independentEscortform.get('height')?.value ?? 1.6);
    this.weightValue.set(this.independentEscortform.get('weight')?.value ?? 60);
    this.ageValue.set(this.independentEscortform.get('age')?.value ?? 18);
  }

  continue(): void {
    this.hide.set(true);
    this.currentStep++;
  }

  back(): void {
    if (this.currentStep === 0) {
      this.backToProfileType.emit();
      return;
    }
    this.currentStep--;
  }

  get validationCredentials(): boolean {
    return this.independentEscortform.get('email')?.valid === true &&
      this.independentEscortform.get('password')?.valid === true &&
      this.independentEscortform.get('confirmPassword')?.valid === true;
  }

  get validateSex(): String {
    const valorGender = this.independentEscortform.get('gender')?.value;

    if (valorGender === 'Man') {
      return "male";
    } else if (valorGender === 'Woman') {
      return "female";
    } else if (valorGender === 'Trans') {
      return "transgender";
    }
    return "";
  }

  onHeightChange(value: number): void {
    this.heightValue.set(value);
  }

  onWeightChange(value: number): void {
    this.weightValue.set(value);
  }

  formatHeight(value: number): string {
    if (!value) return '1.6 m';
    return value.toFixed(1).replace('.', ',') + ' m';
  }

  formatWeight(value: number): string {
    if (!value) return '60 kg';
    return value + ' kg';
  }
}
