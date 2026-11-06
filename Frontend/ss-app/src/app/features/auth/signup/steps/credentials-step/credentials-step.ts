import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StepActions } from '@shared/components/step-actions/step-actions';
import { CREDENTIALS_FIELDS } from '../../constants/signup-fields';

@Component({
  selector: 'app-credentials-step',
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    StepActions,
  ],
  templateUrl: './credentials-step.html',
  styleUrls: [
    '../../../../../shared/styles/form-field.css',
    '../../../../../shared/styles/step-divider.css',
    './credentials-step.css',
  ],
})
export class CredentialsStep {
  @Input() form!: FormGroup;
  @Input() stepIndex!: number;

  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();

  readonly fields = CREDENTIALS_FIELDS;
  hidePassword = true;
  hideConfirmPassword = true;

  continue(): void {
    this.next.emit();
  }

  comeback(): void {
    this.back.emit();
  }

  get validationCredentials(): boolean {
    return (
      this.form.get('email')?.valid === true &&
      this.form.get('password')?.valid === true &&
      this.form.get('confirmPassword')?.valid === true
    );
  }
}
