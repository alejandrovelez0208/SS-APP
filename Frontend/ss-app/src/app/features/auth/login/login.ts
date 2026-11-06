import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { BrandLogo } from '@shared/components/brand-logo/brand-logo';
import { AuthService } from '@shared/services/auth/auth-service';
import { ErrorHandlerService } from '@shared/services/error/error-handler-service';
import { NotificationService } from '@shared/services/notification/notification-service';

@Component({
  selector: 'app-login',
  imports: [
    BrandLogo,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './login.html',
  styleUrls: ['../../../shared/styles/form-field.css', './login.css'],
})
export class Login implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  loading = signal(false);
  showResendLink = signal(false);
  userEmail = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notification: NotificationService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.redirectBasedOnRole();
    }
  }

  submit(): void {
    this.loading.set(true);
    const formData = this.loginForm.value;
    const authData = {
      email: formData.email?.trim().toLowerCase(),
      password: formData.password,
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
      },
    });
  }

  resendVerification(): void {
    if (!this.userEmail) {
      this.notification.error('Please enter your email address');
      return;
    }

    this.showResendLink.set(false);
    this.loading.set(true);
    this.authService.resendVerificationEmail(this.userEmail).subscribe({
      next: (response: any) => {
        this.loading.set(false);
        this.notification.success(
          response.message || 'Verification email sent. Please check your inbox.',
        );
      },
      error: (err) => {
        this.loading.set(false);
        this.errorHandlerService.handle(
          err,
          'Failed to send verification email. Please try again.',
        );
      },
    });
  }

  forgot(): void {
    this.router.navigate(['/forgot-password']);
  }
}
