import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { BrandLogo } from '@shared/components/brand-logo/brand-logo';
import { StepActions } from '@shared/components/step-actions/step-actions';
import { ProfileType, PROFILE_TYPE_OPTIONS } from './constants/signup-fields';
import { createCredentialsFormGroup } from './steps/credentials-step/credentials-form.factory';
import { EscortStep } from './steps/escort-step/escort-step';
import { MemberStep } from './steps/member-step/member-step';

@Component({
  selector: 'app-signup',
  imports: [BrandLogo, EscortStep, MatCardModule, MemberStep, ReactiveFormsModule, StepActions],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  readonly profileOptions = PROFILE_TYPE_OPTIONS;

  signupForm: FormGroup;
  currentStep = 0;
  selectedType: ProfileType | null = null;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.signupForm = this.fb.group({
      member: this.fb.group({
        ...createCredentialsFormGroup().controls,
        identity: ['', [Validators.required]],
        preferences: ['', [Validators.required]],
      }),
      escort: this.fb.group({
        accountType: ['', [Validators.required]],
        escortProfile: this.fb.group({
          ...createCredentialsFormGroup().controls,
          nameCompanion: ['', Validators.required],
          gender: ['', Validators.required],
          age: [18, Validators.required],
          hairColor: [''],
          height: [1.6],
          weight: [60],
          orientation: [{ value: 'heterosexual', disabled: false }],
          nationality: ['', Validators.required],
          baseCity: ['', Validators.required],
          interCodePhone: ['', [Validators.required]],
          phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
          applications: this.fb.group({}),
          serviceModality: this.fb.group({}),
          serviceType: this.fb.group({}),
          departures: this.fb.group({}),
          availableAllDay: [false],
          scheduleFrom: ['09:00'],
          scheduleTo: ['06:00'],
          website: [''],
          basicRate: [50000, [Validators.required]],
        }),
      }),
    });
  }

  ngOnInit(): void {
    this.initCareModalityListener();
  }

  get memberForm(): FormGroup {
    return this.signupForm.get('member') as FormGroup;
  }

  get escortForm(): FormGroup {
    return this.signupForm.get('escort') as FormGroup;
  }

  selectType(type: ProfileType): void {
    this.selectedType = type;
  }

  continue(): void {
    if (!this.selectedType) return;

    this.currentStep++;
    this.cdr.detectChanges();
  }

  back(): void {
    if (this.currentStep === 0) return;

    this.currentStep--;
    this.cdr.detectChanges();
  }

  private get escortProfileForm(): FormGroup {
    return this.signupForm.get('escort.escortProfile') as FormGroup;
  }

  private initCareModalityListener(): void {
    this.escortProfileForm
      .get('serviceModality')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (!value) return;

        const { own_location, hotels, customer_address } = value;

        if (!own_location && !hotels && !customer_address) {
          this.escortProfileForm
            .get('serviceModality.own_location')
            ?.setValue(true, { emitEvent: false });
        }
      });
  }
}
