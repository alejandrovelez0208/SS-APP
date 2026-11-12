import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { EMPTY, map, Observable, startWith } from 'rxjs';
import { NotificationService } from '@shared/services/notification/notification.service';
import { StepActions } from '@shared/components/step-actions/step-actions';
import { CatalogItem, CatalogType } from '@shared/models/catalog.model';
import { City, InternationalCodePhone, Nationality } from '@shared/models/escort.model';
import { SignupCatalogStateService } from '@features/auth/signup/data-access/signup-catalog-state.service';
import { SignupAccountService } from '@features/auth/signup/data-access/signup-account.service';
import { StaticDataService } from '@shared/data/static-data.service';
import { CredentialsStep } from '../credentials-step/credentials-step';
import { PhotoPreview } from './models/photo-preview';
import { BasicsStep } from './sections/basics/basics-step';
import { ContactStep } from './sections/contact/contact-step';
import { DeparturesStep } from './sections/departures/departures-step';
import { PhotosStep } from './sections/photos/photos-step';
import { PhysicalStep } from './sections/physical/physical-step';
import { ServicesStep } from './sections/services/services-step';

@Component({
  selector: 'app-escort-profile-step',
  imports: [
    BasicsStep,
    ContactStep,
    CredentialsStep,
    DeparturesStep,
    PhotosStep,
    PhysicalStep,
    ReactiveFormsModule,
    ServicesStep,
    StepActions,
  ],
  templateUrl: './escort-profile-step.html',
  styleUrls: [
    '../../../../../shared/styles/step-divider.css',
    './escort-profile-step.css',
  ],
})
export class EscortProfileStep {
  @Input() escortProfileform!: FormGroup;
  @Input() accountType = 'escort';
  @Output() backToProfileType = new EventEmitter<void>();

  private readonly dataService = inject(StaticDataService);
  private readonly catalogOptions = inject(SignupCatalogStateService);
  private readonly signupAccount = inject(SignupAccountService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  nationalities: Nationality[] = [];
  filteredNationalities: Observable<Nationality[]> = EMPTY;
  internacionalCodePhone: InternationalCodePhone[] = [];
  baseCity: City[] = [];
  channelsCommunication: CatalogItem[] = [];
  serviceModality: CatalogItem[] = [];
  departures: CatalogItem[] = [];

  currentStep = 0;
  readonly registering = signal(false);

  readonly photos = signal<PhotoPreview[]>([]);
  readonly minPhotos = 3;
  readonly maxPhotos = 10;

  ngOnInit(): void {
    this.loadInitialData();
  }

  continue(): void {
    // Paso 2 = email + password: se crea la cuenta y el perfil borrador.
    if (this.currentStep === 1) {
      this.registerAccount();
      return;
    }

    // Pasos de perfil: guardado silencioso antes de avanzar.
    if (this.currentStep >= 2 && this.currentStep <= 6) {
      this.saveProgress();
    }

    // Último paso (fotos): completar perfil y entrar al panel.
    if (this.currentStep === 7) {
      this.completeRegistration();
      return;
    }

    this.advance();
  }

  private advance(): void {
    this.currentStep++;
    this.loadFields();
    this.cdr.detectChanges();
  }

  private registerAccount(): void {
    if (this.registering()) {
      return;
    }

    this.registering.set(true);
    this.signupAccount
      .register(this.escortProfileform, this.accountType)
      .subscribe({
        next: () => {
          this.registering.set(false);
          this.advance();
        },
        error: (error: unknown) => {
          this.registering.set(false);
          console.error('Error creating account', error);
          this.notification.error('Could not create your account. Please try again.');
        },
      });
  }

  private saveProgress(): void {
    this.signupAccount.saveProgress(this.escortProfileform).subscribe({
      error: (error: unknown) => {
        console.error('Error saving profile progress', error);
        this.notification.error('Could not save your progress. Please try again.');
      },
    });
  }

  private completeRegistration(): void {
    this.signupAccount.complete(this.escortProfileform).subscribe({
      next: () => {
        this.notification.success('Registration complete.');
        void this.router.navigate(['/panel/overview']);
      },
      error: (error: unknown) => {
        console.error('Error completing registration', error);
        this.notification.error('Could not complete your profile. Please review your data.');
      },
    });
  }

  back(): void {
    if (this.currentStep === 0) {
      this.backToProfileType.emit();
      return;
    }

    this.currentStep--;
  }

  loadFields(): void {
    if (this.currentStep === 4) {
      this.loadServiceModalities();
    } else if (this.currentStep === 5) {
      this.loadCommunicationChannels();
    } else if (this.currentStep === 6) {
      this.loadDepartures();
    }
  }

  addPhoto(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.photos.update((current) => [...current, { file, url: reader.result }]);
    };
    reader.readAsDataURL(file);
  }

  removePhoto(index: number): void {
    this.photos.update((current) => current.filter((_, i) => i !== index));
  }

  get areGenderAndNameCompanionValid(): boolean {
    return (
      this.escortProfileform.get('nameCompanion')?.valid === true &&
      this.escortProfileform.get('gender')?.valid === true
    );
  }

  get areOrientationAndNationalityValid(): boolean {
    return (
      this.escortProfileform.get('orientation')?.valid === true &&
      this.escortProfileform.get('nationality')?.valid === true &&
      this.escortProfileform.get('baseCity')?.valid === true
    );
  }

  get hasRequiredPhotos(): boolean {
    return this.photos().length >= this.minPhotos;
  }

  private loadInitialData(): void {
    this.dataService.getNationalities().subscribe({
      next: (data) => {
        this.nationalities = data;
        this.setupFilter();
        this.setupCountryValidation();
      },
      error: (err) => console.error('Error loading nationalities', err),
    });

    this.dataService.getInternationalCodes().subscribe({
      next: (data) => {
        this.internacionalCodePhone = data;
        const defaultCountry = this.internacionalCodePhone[0];
        if (defaultCountry) {
          this.escortProfileform.get('interCodePhone')?.setValue(defaultCountry.calling_code);
          this.escortProfileform.get('interCodePhone')?.disable();
        }
      },
      error: (err) => console.error('Error loading InternationalCodes', err),
    });

    this.catalogOptions.search(CatalogType.CITY).subscribe({
      next: (data) => {
        this.baseCity = data.map((city) => ({ id: city.id, name: city.description }));
        const medellin = this.baseCity.find((city) => city.name === 'Medellín');
        this.escortProfileform.get('baseCity')?.setValue(medellin?.name ?? 'Medellín');
        this.setupCityValidation();
      },
      error: (err) => console.error('Error loading base cities', err),
    });
  }

  private setupFilter(): void {
    const nationalityCtrl = this.escortProfileform.get('nationality');
    this.filteredNationalities = nationalityCtrl!.valueChanges.pipe(
      startWith(''),
      map((value: string | Nationality) => {
        const name = typeof value === 'string' ? value : value?.names?.common;
        const filtered = name ? this._filter(name) : this.nationalities.slice();
        return name ? filtered : this._withPinnedFirst(filtered);
      }),
    );
  }

  private setupCountryValidation(): void {
    const nationalityCtrl = this.escortProfileform.get('nationality');
    if (!nationalityCtrl) {
      return;
    }

    nationalityCtrl.setValidators([Validators.required, this.countryValidator.bind(this)]);
    nationalityCtrl.updateValueAndValidity();
  }

  private setupCityValidation(): void {
    const cityCtrl = this.escortProfileform.get('baseCity');
    if (!cityCtrl) {
      return;
    }

    cityCtrl.setValidators([Validators.required, this.baseCityValidator.bind(this)]);
    cityCtrl.updateValueAndValidity();
  }

  private baseCityValidator(control: AbstractControl): ValidationErrors | null {
    const value = String(control.value ?? '').trim();
    if (!value) {
      return { required: true };
    }
    if (this.baseCity.length === 0) {
      return null;
    }

    return this.baseCity.some((city) => city.name === value) ? null : { invalidCity: true };
  }

  private countryValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return { required: true };
    }

    const name = typeof value === 'string' ? value : value?.names?.common;
    if (!name) {
      return { invalidCountry: true };
    }

    const exists = this.nationalities.some(
      (country) => country.names.common.toLowerCase() === String(name).toLowerCase(),
    );

    return exists ? null : { invalidCountry: true };
  }

  private _withPinnedFirst(list: Nationality[]): Nationality[] {
    const pinnedNames = ['Colombia', 'Venezuela'];
    const pinned = pinnedNames
      .map((n) => list.find((c) => c.names.common === n))
      .filter((c): c is Nationality => !!c);
    const rest = list.filter((c) => !pinnedNames.includes(c.names.common));
    return [...pinned, ...rest];
  }

  private _filter(name: string): Nationality[] {
    const filterValue = name.toLowerCase();
    return this.nationalities.filter((nation) =>
      nation.names.common.toLowerCase().includes(filterValue),
    );
  }

  private loadServiceModalities(): void {
    this.catalogOptions.search(CatalogType.MODALITY).subscribe((data) => {
      this.serviceModality = data;
      this.catalogOptions.assignModalityFormula(this.serviceModality);

      const appGroup = this.escortProfileform.get('serviceModality') as FormGroup;
      if (appGroup) {
        this.catalogOptions.getFormulaMap('modality').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });
  }

  private loadCommunicationChannels(): void {
    this.catalogOptions.search(CatalogType.CHANNEL).subscribe((data) => {
      this.channelsCommunication = data;
      this.catalogOptions.assignChannelsFormula(this.channelsCommunication);

      const appGroup = this.escortProfileform.get('applications') as FormGroup;
      if (appGroup) {
        this.catalogOptions.getFormulaMap('channels').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });

    this.catalogOptions.search(CatalogType.SERVICE).subscribe((data) => {
      this.catalogOptions.assignTypeOfServicesFormula(data);

      const appGroup = this.escortProfileform.get('serviceType') as FormGroup;
      if (appGroup) {
        this.catalogOptions.getFormulaMap('typeOfServices').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });
  }

  private loadDepartures(): void {
    this.catalogOptions.search(CatalogType.TRAVEL).subscribe((data) => {
      this.departures = data;
      this.catalogOptions.assignDeparturesFormula(this.departures);

      const appGroup = this.escortProfileform.get('departures') as FormGroup;
      if (appGroup) {
        this.catalogOptions.getFormulaMap('departures').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });
  }
}
