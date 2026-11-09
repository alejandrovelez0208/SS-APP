import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { StepActions } from '@shared/components/step-actions/step-actions';
import { GENDER_OPTIONS } from '../../constants/gender';
import { Preference } from '../../constants/preference';
import { CredentialsStep } from '../credentials-step/credentials-step';

@Component({
  selector: 'app-member-step',
  imports: [
    CredentialsStep,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    StepActions,
  ],
  templateUrl: './member-step.html',
  styleUrls: [
    '../../../../../shared/styles/form-field.css',
    '../../../../../shared/styles/avatar-upload.css',
    './member-step.css',
  ],
})
export class MemberStep {
  @Input() memberform!: FormGroup;
  @Output() backToProfileType = new EventEmitter<void>();

  currentStep = 0;
  readonly genders = GENDER_OPTIONS;
  readonly preferences = Object.values(Preference);
  readonly previewUrl = signal<string | null>(null);

  continue(): void {
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
    return (
      this.memberform.get('email')?.valid === true &&
      this.memberform.get('password')?.valid === true &&
      this.memberform.get('confirmPassword')?.valid === true
    );
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl.set(typeof reader.result === 'string' ? reader.result : null);
    };
    reader.readAsDataURL(file);
  }
}
