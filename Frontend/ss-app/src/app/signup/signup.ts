import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared-module';
import { SIGN_UP_FIELDS } from './fields/sign-up.fields';
import { AuthService } from '../services/auth/auth-service';
import { CatalogsService } from '../services/catalogs/catalogs-service';
import { MemberStep } from './member-step/member-step';
import { EscortStep } from './escort-step/escort-step';
import { GENDER } from '../shared/enums/gender';
import { Preference } from '../shared/enums/preference';
import { createCredentialsFormGroup } from './credentials-step/credentials-form.factory';

// TODO: Considerar mover a un archivo de validadores personalizados (validators/custom.validators.ts)
export function atLeastOneCheckedValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) return null;
    const controls = control.controls;
    const isAtLeastOneTrue = Object.keys(controls).some(key => controls[key].value === true);
    return isAtLeastOneTrue ? null : { noneChecked: true };
  };
}

@Component({
  selector: 'app-signup',
  imports: [SharedModule, MemberStep, EscortStep],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  readonly fields = SIGN_UP_FIELDS;
  readonly genders = Object.values(GENDER);
  readonly preferences = Object.values(Preference);

  signupForm: FormGroup;
  currentStep = 0;
  selectedType: 'escort' | 'member' | null = null;

  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;

  preferenceOption = new FormControl([]);

  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | ArrayBuffer | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private catalogService: CatalogsService
  ) {
    this.signupForm = this.fb.group({
      profileType: [null],

      member: this.fb.group({
        ...createCredentialsFormGroup(this.authService).controls,
        identity: ['', [Validators.required]],
        preferences: ['', [Validators.required]]
      }),

      escort: this.fb.group({
        accountType: ['', [Validators.required]],
        independentEscort: this.fb.group({
          ...createCredentialsFormGroup(this.authService).controls,
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

        agency: this.fb.group({}),
      }),
    });
  }

  ngOnInit(): void {
    this.initCareModalityListener();
  }

  // Getters para los subformgroups
  get memberForm(): FormGroup {
    return this.signupForm.get('member') as FormGroup;
  }

  get escortForm(): FormGroup {
    return this.signupForm.get('escort') as FormGroup;
  }

  get independentEscortForm(): FormGroup {
    return this.signupForm.get('escort.independentEscort') as FormGroup;
  }

  selectType(type: 'escort' | 'member'): void {
    this.hide.set(false);
    this.selectedType = type;
  }

  continue(): void {
    if (!this.selectedType) return;

    this.hide.set(true);
    this.currentStep++;
    this.cdr.detectChanges();
  }

  back(): void {
    if (this.currentStep === 0) return;

    this.currentStep--;
    this.cdr.detectChanges();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => this.previewUrl.set(reader.result);
    reader.readAsDataURL(file);
  }

  private initCareModalityListener(): void {
    this.independentEscortForm.get('serviceModality')?.valueChanges.subscribe(value => {
      if (!value) return;

      const { own_location, hotels, customer_address } = value;

      if (!own_location && !hotels && !customer_address) {
        this.independentEscortForm.get('serviceModality.own_location')?.setValue(true, { emitEvent: false });
      }
    });
  }
}