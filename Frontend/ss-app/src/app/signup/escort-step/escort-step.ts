import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { EscortProfileStep } from '../escort-profile-step/escort-profile-step';

@Component({
  selector: 'app-escort-step',
  imports: [SharedModule, EscortProfileStep],
  templateUrl: './escort-step.html',
  styleUrl: './escort-step.css',
})
export class EscortStep {
  @Input() escortform!: FormGroup;
  @Output() backToProfileType = new EventEmitter<void>();

  signupForm!: FormGroup;
  showContent: Boolean = false;
  currentStep = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  activateIf() {
    this.showContent = true;
  }

  get escortProfileForm(): FormGroup {
    return this.escortform.get('escortProfile') as FormGroup;
  }

  back(): void {
    if (this.currentStep === 0) {
      console.log(this.currentStep);
      this.backToProfileType.emit();
      return;
    }
    this.currentStep--;
    this.cdr.detectChanges();
  }
}
