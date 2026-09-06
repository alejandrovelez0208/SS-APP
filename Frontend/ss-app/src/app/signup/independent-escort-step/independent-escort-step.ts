import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { ESCORT_FIELDS, INDEPENDENT_ESCORT_FIELDS } from '../fields/sign-up.fields';

@Component({
  selector: 'app-independent-escort-step',
  imports: [SharedModule],
  templateUrl: './independent-escort-step.html',
  styleUrl: './independent-escort-step.css',
})
export class IndependentEscortStep {
  @Input() independentEscortform!: FormGroup;

  @Output() backToProfileType = new EventEmitter<void>();

  fields = INDEPENDENT_ESCORT_FIELDS;
  currentStep = 0;

  hide = signal(true);

  /* Go to the next step */
  continue(): void {
    this.hide.set(true);
    this.currentStep++;
  }

  /* Go back to a previous step */
  back(): void {
    if (this.currentStep === 0) {
      this.backToProfileType.emit();
      return;
    }
    this.currentStep--;
  }
}
