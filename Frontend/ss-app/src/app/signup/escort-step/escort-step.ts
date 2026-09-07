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

  constructor(private cdr: ChangeDetectorRef) { }

  activateIf() {
    this.showContent = true;
  }

  get independentEscortForm(): FormGroup {
    return this.escortform.get('independentEscort') as FormGroup;
  }

  /*   get agencyForm(): FormGroup {
      return this.escortform.get('agency') as FormGroup;
    } */

  back(): void {
    this.cdr.detectChanges();
  }
}
