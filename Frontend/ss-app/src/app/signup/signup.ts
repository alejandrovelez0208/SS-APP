import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [SharedModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  signupForm !: FormGroup;
  selectedType: 'escort' | 'member' | null = null;

  constructor(private fb: FormBuilder) {
    this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      confirmPassword: ['', [Validators.required]] //Continue after..
    });
  }

  selectType(type: 'escort' | 'member'): void {
    this.selectedType = type;
  }

  continue(): void {
    if (!this.selectType) {
      return;
    }
  }

  ngOnInit(): void {
  }
}
