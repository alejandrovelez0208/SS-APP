import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [SharedModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginForm !: FormGroup;
  hide = true;
  loading = signal(false);
  showResendLink = signal(false);

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
  }

  resendVerification() {
  }

  forgot() {
    this.router.navigate(['/forgot-password']);
  }
}
