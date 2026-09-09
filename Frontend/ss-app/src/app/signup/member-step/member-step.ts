import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Preference } from '../../shared/enums/preference';
import { GENDER } from '../../shared/enums/gender';
import { CredentialsStep } from '../credentials-step/credentials-step';

@Component({
  selector: 'app-member-step',
  imports: [SharedModule, CredentialsStep, ReactiveFormsModule],
  templateUrl: './member-step.html',
  styleUrl: './member-step.css',
})
export class MemberStep {
  @Input() memberform!: FormGroup;
  
  @Output() backToProfileType = new EventEmitter<void>();

  currentStep = 0;
  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | ArrayBuffer | null>(null);
  genders = Object.values(GENDER);
  preferenceOption = new FormControl([]);
  preferences = Object.values(Preference);

  /* Go to the next step */
  continue(): void {
    this.hide.set(true);
    this.currentStep++;
  }

  /* Go back to a previous step */
  back(): void {
    if (this.currentStep === 0) {
      this.backToProfileType.emit();
      return;
    }
    this.currentStep--;
  }

  get validationCredentials(): boolean {
    return this.memberform.get('email')?.valid === true &&
      this.memberform.get('password')?.valid === true &&
      this.memberform.get('confirmPassword')?.valid === true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result);
    reader.readAsDataURL(file);
  }

}
