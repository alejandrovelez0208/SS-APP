import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { ESCORT_FIELDS } from '../fields/sign-up.fields';
import { IndependentEscortStep } from '../independent-escort-step/independent-escort-step';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-escort-step',
  imports: [SharedModule, IndependentEscortStep],
  templateUrl: './escort-step.html',
  styleUrl: './escort-step.css',
})
export class EscortStep {
  @Input() escortform!: FormGroup;

  signupForm!: FormGroup;

  showContent: Boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private cdr: ChangeDetectorRef) {
    this.signupForm = this.fb.group({
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
      })
    })
  }

  activateIf() {
    this.showContent = true;
  }

  get independentEscortForm(): FormGroup {
    return this.signupForm.get('member') as FormGroup;
  }

  back(): void {
    this.cdr.detectChanges();
  }
}
