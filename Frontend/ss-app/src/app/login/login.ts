import { Component, signal } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth/auth-service';
import { NotificationService } from '../shared/services/notification/notification-service';
import { ErrorHandlerService } from '../shared/services/error/error-handler-service';

@Component({
  selector: 'app-login',
  imports: [SharedModule],
  templateUrl: './login.html',
  styleUrls: ['../shared/styles/brand.css', '../shared/styles/form-field.css', './login.css'],
})
export class Login {
  loginForm !: FormGroup;
  hide = true;
  loading = signal(false);
  showResendLink = signal(false);
  userEmail = '';

  constructor(private fb: FormBuilder, private authService: AuthService,
    private router: Router, private notification: NotificationService,
    private errorHandleServices: ErrorHandlerService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.redirectBasedOnRole();
    }
  }

  submit() {
    this.loading.set(true);
    const formData = this.loginForm.value;
    const authData = {
      email: formData.email?.trim().toLowerCase(),
      password: formData.password
    };
    this.authService.login(authData).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.authService.redirectBasedOnRole();
        this.notification.success(response.message || 'Login successful.');
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.error?.error || 'Login failed. Please check your credentials.';

        if (err.status === 403 && errorMsg.toLowerCase().includes('verify')) {
          this.showResendLink.set(true);
          this.userEmail = this.loginForm.value.email;
        } else {
          this.showResendLink.set(false);
        }
        this.notification.error(errorMsg);
        console.error('Login error:', err);
      }
    });
  }

  resendVerification() {
    if (!this.userEmail) {
      this.notification.error('Please enter your email address');
      return;
    }
    this.showResendLink.set(false);
    this.loading.set(true);
    this.authService.resendVerificationEmail(this.userEmail).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.notification.success(response.message || 'verification email sent Please check your inbox.');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorHandleServices.handle(err, 'Failed to send verification email. Please try again.')
      }
    });
  }

  forgot() {
    this.router.navigate(['/forgot-password']);
  }
}
