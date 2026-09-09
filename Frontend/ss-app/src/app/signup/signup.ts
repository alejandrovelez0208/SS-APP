import { ChangeDetectorRef, Component, signal, ViewChild } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SIGN_UP_FIELDS } from './fields/sign-up.fields';
import { AuthService } from '../services/auth/auth-service';
import { Preference } from '../shared/enums/preference';
import { MemberStep } from './member-step/member-step';
import { EscortStep } from './escort-step/escort-step';
import { GENDER } from '../shared/enums/gender';
import { createCredentialsFormGroup } from './credentials-step/credentials-form.factory';
import { identity } from 'rxjs';

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

  genders = Object.values(GENDER);

  preferenceOption = new FormControl([]);
  preferences = Object.values(Preference);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | ArrayBuffer | null>(null);

  constructor(private fb: FormBuilder, private authService: AuthService, private cdr: ChangeDetectorRef) {

    this.signupForm = this.fb.group({
      profileType: [null],

      member: this.fb.group({
        ...createCredentialsFormGroup(this.authService).controls,
        identity: ['', [Validators.required]],
        preferences: ['', [Validators.required]]
      }),

      escort: this.fb.group({
        accountType: ['', [Validators.required]],
        independentEscort: this.fb.group({
          ...createCredentialsFormGroup(this.authService).controls,
          nameCompanion: ['', Validators.required],
          gender: ['', Validators.required],
          age: [18, Validators.required],
          hairColor: [''],
          height: [1.6],
          weight: [60],
          orientation: ['Heterosexual', Validators.required],
          nationality: ['', Validators.required],
          baseCity: ['', Validators.required],
          interCodePhone: ['', [Validators.required]],
          phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          aplicaciones: this.fb.group({
            telegram: [false],
            whatsapp: [false]
          })
        }),

        agency: this.fb.group({
        }),
      }),
    });
  }

  get memberForm(): FormGroup {
    return this.signupForm.get('member') as FormGroup;
  }

  get escortForm(): FormGroup {
    return this.signupForm.get('escort') as FormGroup;
  }

  get independentEscortForm(): FormGroup {
    return this.signupForm.get('escort.independentEscort') as FormGroup;
  }

  /*   get agencyForm(): FormGroup {
      return this.signupForm.get('agency') as FormGroup;
    } */

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