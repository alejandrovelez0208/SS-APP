import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SIGN_UP_FIELDS } from './fields/sign-up.fields';

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

  constructor(private fb: FormBuilder) {

    this.signupForm = this.fb.group({
      profileType: [null],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

  }
  selectType(type: string): void {
    this.selectedType = type as 'escort' | 'member';
  }

  continue(): void {

    if (!this.selectedType) {
      return;
    }

    this.currentStep++;

  }

}