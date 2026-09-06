import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SIGN_UP_FIELDS } from './fields/sign-up.fields';
import { AuthService } from '../services/auth/auth-service';
import { Gender } from '../shared/enums/gender';
import { Preference } from '../shared/enums/preference';
import { MemberStep } from './member-step/member-step';
import { EscortStep } from './escort-step/escort-step';

@Component({
  selector: 'app-signup',
  imports: [SharedModule, MemberStep, EscortStep],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  fields = SIGN_UP_FIELDS;
  currentStep = 0;

  signupForm!: FormGroup;

  selectedType: 'escort' | 'member' | null = null;

  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;

  genderOption = new FormControl([]);
  genders = Object.values(Gender);

  preferenceOption = new FormControl([]);
  preferences = Object.values(Preference);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | ArrayBuffer | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService, private cdr: ChangeDetectorRef) {

    this.signupForm = this.fb.group({
      profileType: [null],

      member: this.fb.group({
        userName: ['', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20)
        ]],
        email: ['', [
          Validators.required,
          Validators.email
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(6)
        ]],
        confirmPassword: ['', [
          Validators.required,
          this.authService.passwordMatchValidator('password')
        ]]
      }),
      escort: this.fb.group({
         accountType: ['', [Validators.required]]
      })
    });
  }

  get memberForm(): FormGroup {
    return this.signupForm.get('member') as FormGroup;
  }

  get escortForm(): FormGroup {
    return this.signupForm.get('escort') as FormGroup;
  }

  selectType(type: string): void {
    this.hide.set(false);
    this.selectedType = type as 'escort' | 'member';
  }

  continue(): void {
    if (!this.selectedType) {
      return;
    }
    this.hide.set(true);
    this.currentStep++;
    this.cdr.detectChanges();
  }

  back(): void {
    if (this.currentStep === 0) {
      return;
    }
    this.currentStep--;
    this.cdr.detectChanges();
  }

  get validationCredentials(): boolean {
    return this.signupForm.get('email')?.valid === true &&
      this.signupForm.get('password')?.valid === true &&
      this.signupForm.get('confirmPassword')?.valid === true;
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