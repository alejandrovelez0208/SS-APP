import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { StepActions } from '@shared/components/step-actions/step-actions';
import { EscortProfileStep } from '../escort-profile-step/escort-profile-step';

@Component({
  selector: 'app-escort-step',
  imports: [EscortProfileStep, MatRadioModule, ReactiveFormsModule, StepActions],
  templateUrl: './escort-step.html',
  styleUrl: './escort-step.css',
})
export class EscortStep {
  @Input() escortform!: FormGroup;
  @Output() backToProfileType = new EventEmitter<void>();

  readonly showProfileForm = signal(false);

  get escortProfileForm(): FormGroup {
    return this.escortform.get('escortProfile') as FormGroup;
  }

  openProfileForm(): void {
    this.showProfileForm.set(true);
  }

  back(): void {
    this.backToProfileType.emit();
  }
}
