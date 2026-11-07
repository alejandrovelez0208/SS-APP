import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, map, Observable, startWith } from 'rxjs';
import { StepActions } from '@shared/components/step-actions/step-actions';
import { CatalogItem, CatalogType } from '@shared/models/catalog.model';
import { City, InternationalCodePhone, Nationality } from '@shared/models/escort.model';
import { CatalogOptionsService } from '@shared/services/catalogs/catalog-options.service';
import { DataService } from '@shared/services/data/data-service';
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
  @Output() backToProfileType = new EventEmitter<void>();

  private readonly dataService = inject(DataService);
  private readonly catalogOptions = inject(CatalogOptionsService);
  private readonly cdr = inject(ChangeDetectorRef);

  nationalities: Nationality[] = [];
  filteredNationalities: Observable<Nationality[]> = EMPTY;
  internacionalCodePhone: InternationalCodePhone[] = [];
  baseCity: City[] = [];
  channelsCommunication: CatalogItem[] = [];
  serviceModality: CatalogItem[] = [];
  departures: CatalogItem[] = [];

  currentStep = 0;

  readonly photos = signal<PhotoPreview[]>([]);
  readonly minPhotos = 3;
  readonly maxPhotos = 10;

  ngOnInit(): void {
    this.loadInitialData();
  }

  continue(): void {
    this.currentStep++;
    this.loadFields();
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

    this.dataService.getCitiesColombia().subscribe({
      next: (data) => {
        this.baseCity = data;
        const defaultCity = this.baseCity[0];
        if (defaultCity) {
          this.escortProfileform.get('baseCity')?.setValue(defaultCity.name);
        }
      },
      error: (err) => console.error('Error loading Cities of Colombia', err),
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
