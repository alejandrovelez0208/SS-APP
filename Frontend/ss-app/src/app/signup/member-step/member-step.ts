import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { MEMBER_FIELDS } from '../fields/sign-up.fields';
import { Form, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Gender } from '../../shared/enums/gender';
import { Preference } from '../../shared/enums/preference';

@Component({
  selector: 'app-member-step',
  imports: [SharedModule, ReactiveFormsModule],
  templateUrl: './member-step.html',
  styleUrl: './member-step.css',
})
export class MemberStep {
  @Input() memberform!: FormGroup;
  @Input() escortform!: FormGroup;
  
  @Output() backToProfileType = new EventEmitter<void>();

  /*Member Fields*/
  fields = MEMBER_FIELDS;
  currentStep = 0;
  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | ArrayBuffer | null>(null);
  genderOption = new FormControl([]);
  genders = Object.values(Gender);
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
