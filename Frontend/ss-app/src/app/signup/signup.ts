import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SIGN_UP_FIELDS } from './fields/sign-up.fields';
import { AuthService } from '../services/auth/auth-service';

@Component({
  selector: 'app-signup',
  imports: [SharedModule],
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

  constructor(private fb: FormBuilder, private authService: AuthService) {

    this.signupForm = this.fb.group({
      profileType: [null],
      userName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, this.authService.passwordMatchValidator('password')]]
    });

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
  }

  back(): void {
    if (this.currentStep === 0) {
      return;
    }
    this.currentStep--;
  }

  get validationCredentials(): boolean {
    return this.signupForm.get('email')?.valid === true &&
      this.signupForm.get('password')?.valid === true &&
      this.signupForm.get('confirmPassword')?.valid === true;
  }
}