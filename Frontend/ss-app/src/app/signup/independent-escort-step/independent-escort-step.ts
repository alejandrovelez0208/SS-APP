import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { HAIR_COLOR } from '../../shared/enums/hairColor';
import { GENDER } from '../../shared/enums/gender';
import { CredentialsStep } from '../credentials-step/credentials-step';
import { HttpClient } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';
import { CatalogFilter } from '../../shared/CatalogFilter';
import { CatalogsService } from '../../services/catalogs/catalogs-service';
import { Constants } from '../../shared/enums/constants/Constants';
import { FieldOptions } from '../../shared/enums/constants/fieldOptions';
import { DataService } from '../../services/data/data-service';
import { City, InternationalCodePhone } from '../../shared/models/escort.model';

interface PhotoPreview {
  file: File;
  url: string | ArrayBuffer | null;
}

@Component({
  selector: 'app-independent-escort-step',
  imports: [SharedModule, CredentialsStep],
  templateUrl: './independent-escort-step.html',
  styleUrl: './independent-escort-step.css',
})
export class IndependentEscortStep implements OnInit {

  @Input() independentEscortform!: FormGroup;
  @Output() backToProfileType = new EventEmitter<void>();

  private readonly dataService = inject(DataService);
  readonly catalogsService = inject(CatalogsService);
  private readonly cdr = inject(ChangeDetectorRef);
  readonly title = FieldOptions;

  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;
  heightValue = signal(1.6);
  weightValue = signal(60);
  ageValue = signal(18);
  telegramSelected = false;
  whatsappSelected = false;
  ownLocation = false;
  hotels = false;
  customersAddress = false;
  rateValue = signal(50000);

  genders = Object.values(GENDER);
  hairColor = Object.values(HAIR_COLOR);

  nationalities: any[] = [];
  filteredNationalities!: Observable<any[]>;
  internacionalCodePhone: InternationalCodePhone[] = [];
  baseCity: City[] = [];
  channelsCommunication: any[] = [];
  serviceModality: any[] = [];
  serviceClassification: any[] = []
  typeOfServices: any[] = []
  departures: any[] = []

  currentStep = 0;

  photos = signal<PhotoPreview[]>([]);
  readonly minPhotos = 3;
  readonly maxPhotos = 10;

  ngOnInit(): void {
    this.loadInitialData();
    this.initFormValues();
  }

  continue(): void {
    this.hide.set(true);
    this.currentStep++;

    this.loadFields();
  }

  back(): void {
    console.log(this.currentStep);
    if (this.currentStep === 0) {
      this.backToProfileType.emit();
      return;
    }
    this.currentStep--;
  }

  onHeightChange(value: number): void {
    this.heightValue.set(value);
  }

  onWeightChange(value: number): void {
    this.weightValue.set(value);
  }

  formatHeight(value: number): string {
    if (!value) return '1.6 m';
    return value.toFixed(1).replace('.', ',') + ' m';
  }

  formatWeight(value: number): string {
    if (!value) return '60 kg';
    return value + ' kg';
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

  getControlModalityNameByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('modality').get(id) ?? 'Modalities not found';
  }

  getControlChannelNameByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('channels').get(id) ?? 'Channels not found';
  }

  getControlTypeOfServicesNameByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('typeOfServices').get(id) ?? 'Type of services not found';
  }

  getControlDepartureNamesByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('departures').get(id) ?? 'Departures not found';
  }

  displayFn = (nationality: any): string => {
    return nationality?.names?.common ?? '';
  };

  onRateChange(value: number): void {
    this.rateValue.set(value);
  }

  formatRate(value: number): string {
    if (!value) return '$50.000 COP';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  }
  private loadInitialData(): void {
    // Load Nationalities
    this.dataService.getNationalities().subscribe({
      next: (data) => {
        this.nationalities = data;
        this.setupFilter();
      },
      error: (err) => console.error('Error loading nationalities', err)
    });

    // Load Phone Code
    this.dataService.getInternationalCodes().subscribe({
      next: (data) => {
        this.internacionalCodePhone = data;
        const defaultCountry = this.internacionalCodePhone[0];
        if (defaultCountry) {
          this.independentEscortform.get('interCodePhone')?.setValue(defaultCountry.calling_code);
          this.independentEscortform.get('interCodePhone')?.disable();
        }
      },
      error: (err) => console.error('Error loading InternationalCodes', err)
    });

    // Load city
    this.dataService.getCitiesColombia().subscribe({
      next: (data) => {
        this.baseCity = data;
        const defaultCity = this.baseCity[0];
        if (defaultCity) {
          this.independentEscortform.get('baseCity')?.setValue(defaultCity.name);
        }
      },
      error: (err) => console.error('Error loading Cities of Colombia', err)
    });
  }

  private initFormValues(): void {
    this.heightValue.set(this.independentEscortform.get('height')?.value ?? 1.6);
    this.weightValue.set(this.independentEscortform.get('weight')?.value ?? 60);
    this.ageValue.set(this.independentEscortform.get('age')?.value ?? 18);
    this.rateValue.set(this.independentEscortform.get('basicRate')?.value ?? 50000);
  }

  private setupFilter(): void {
    const nationalityCtrl = this.independentEscortform.get('nationality');
    this.filteredNationalities = nationalityCtrl!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.names?.common;
        const filtered = name ? this._filter(name) : this.nationalities.slice();
        return name ? filtered : this._withPinnedFirst(filtered);
      })
    );
  }

  private _withPinnedFirst(list: any[]): any[] {
    const pinnedNames = ['Colombia', 'Venezuela'];
    const pinned = pinnedNames
      .map(n => list.find(c => c.names.common === n))
      .filter(c => !!c);
    const rest = list.filter(c => !pinnedNames.includes(c.names.common));
    return [...pinned, ...rest];
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.nationalities.filter(nation =>
      nation.names.common.toLowerCase().includes(filterValue)
    );
  }

  private loadServiceModalities(): void {
    const serviceModalityFilter: CatalogFilter = {
      type: FieldOptions.I_ATTEND_TO,
      fathertype: null
    };

    this.catalogsService.getPTipos(serviceModalityFilter).subscribe(data => {
      this.serviceModality = data;
      this.catalogsService.assignModalityFormula(this.serviceModality);

      const appGroup = this.independentEscortform.get('serviceModality') as FormGroup;
      if (appGroup) {
        this.catalogsService.getFormulaMap('modality').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });
  }

  private loadCommunicationChannels(): void {
    const channelsFilter: CatalogFilter = {
      type: FieldOptions.CHANNELS_COMMUNICATION,
      fathertype: null
    };

    this.catalogsService.getPTipos(channelsFilter).subscribe(data => {
      this.channelsCommunication = data;
      this.catalogsService.assignChannelsFormula(this.channelsCommunication);

      const appGroup = this.independentEscortform.get('applications') as FormGroup;
      if (appGroup) {
        this.catalogsService.getFormulaMap('channels').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });

    const typeOfServices: CatalogFilter = {
      type: FieldOptions.TYPES_OF_SERVICES,
      fathertype: null
    }

    this.catalogsService.getPTipos(typeOfServices).subscribe(data => {
      this.typeOfServices = data;
      this.catalogsService.assignTypeOfServicesFormula(this.typeOfServices);

      const appGroup = this.independentEscortform.get('serviceType') as FormGroup;
      if (appGroup) {
        this.catalogsService.getFormulaMap('typeOfServices').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });
  }

  private loadDepartures(): void {
    const departuresFilter: CatalogFilter = {
      type: FieldOptions.DEPARTURES,
      fathertype: null
    };

    this.catalogsService.getPTipos(departuresFilter).subscribe(data => {
      this.departures = data;
      this.catalogsService.assingDeparturesFormula(this.departures);

      const appGroup = this.independentEscortform.get('departures') as FormGroup;
      if (appGroup) {
        this.catalogsService.getFormulaMap('departures').forEach((formulaName) => {
          if (!appGroup.contains(formulaName)) {
            appGroup.addControl(formulaName, new FormControl(false));
          }
        });
      }
      this.cdr.detectChanges();
    });
  }

  get validationCredentials(): boolean {
    return this.independentEscortform.get('email')?.valid === true &&
      this.independentEscortform.get('password')?.valid === true &&
      this.independentEscortform.get('confirmPassword')?.valid === true;
  }

  get genderIconName(): String {
    const valorGender = this.independentEscortform.get('gender')?.value;

    if (valorGender === GENDER[0]) {
      return "male";
    } else if (valorGender === GENDER[1]) {
      return "female";
    } else if (valorGender === GENDER[2]) {
      return "transgender";
    }
    return "";
  }

  get areGenderandNameCompanionInvalid(): boolean {
    return this.independentEscortform.get('nameCompanion')?.valid === true &&
      this.independentEscortform.get('gender')?.valid === true;
  }

  get areOrientationAndNationalityInvalid(): boolean {
    return this.independentEscortform.get('orientation')?.valid === true &&
      this.independentEscortform.get('nationality')?.valid === true &&
      this.independentEscortform.get('baseCity')?.valid === true;
  }

  get areCodePhoneInvalid(): boolean {
    return this.independentEscortform.get('interCodePhone')?.valid === true &&
      this.independentEscortform.get('phone')?.valid === true;
  }

  get isAvailable247(): boolean {
    return this.independentEscortform.get('availableAllDay')?.value === true;
  }

  get canAddMorePhotos(): boolean {
    return this.photos().length < this.maxPhotos;
  }

  get hasRequiredPhotos(): boolean {
    return this.photos().length >= this.minPhotos;
  }

  get photosRemainingToMin(): number {
    return Math.max(0, this.minPhotos - this.photos().length);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!this.canAddMorePhotos) {
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.photos.update(current => [
        ...current,
        { file, url: reader.result }
      ]);
    };
    reader.readAsDataURL(file);

    input.value = '';
  }

  removePhoto(index: number): void {
    this.photos.update(current => current.filter((_, i) => i !== index));
  }
}
