import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { CREDENTIALS_FIELDS } from '../fields/sign-up.fields';

@Component({
  selector: 'app-credentials-step',
  imports: [SharedModule],
  templateUrl: './credentials-step.html',
  styleUrl: './credentials-step.css',
})
export class CredentialsStep {
  @Input() form!: FormGroup;
  @Input() stepIndex!: number;    // 0 = username, 1 = email/password.. 2,3,4 
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  fields = CREDENTIALS_FIELDS;
  hidePassword = true;
  hideConfirmPassword = true;

  continue(): void {
    this.next.emit();
    
  }

  comeback(): void {
    this.back.emit();
  }

  get validationCredentials(): boolean {
    return this.form.get('email')?.valid === true &&
      this.form.get('password')?.valid === true &&
      this.form.get('confirmPassword')?.valid === true;
  }
}