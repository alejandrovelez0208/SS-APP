import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SharedModule } from '../../shared/shared-module';
import { HAIR_COLOR } from '../../shared/enums/hairColor';
import { GENDER } from '../../shared/enums/gender';
import { CredentialsStep } from '../credentials-step/credentials-step';
import { HttpClient } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-independent-escort-step',
  imports: [SharedModule, CredentialsStep],
  templateUrl: './independent-escort-step.html',
  styleUrl: './independent-escort-step.css',
})
export class IndependentEscortStep implements OnInit {
  private http = inject(HttpClient);
  nationalities: any[] = [];
  filteredNationalities!: Observable<any[]>;
  internacionalCodePhone: any[] = [];
  baseCity: any[] = [];

  @Input() independentEscortform!: FormGroup;

  @Output() backToProfileType = new EventEmitter<void>();

  currentStep = 0;

  hide = signal(true);
  hidePassword = true;
  hideConfirmPassword = true;

  genders = Object.values(GENDER);
  hairColor = Object.values(HAIR_COLOR);

  heightValue = signal(1.6);
  weightValue = signal(60);
  ageValue = signal(18);

  telegramSelected = false;
  whatsappSelected = false;

  ownLocation = false;
  hotels = false;
  customersAddress = false;

  ngOnInit(): void {
    this.loadNationalities();
    this.loadInternationalCodePhone();
    this.loadBaseCity();

    this.heightValue.set(this.independentEscortform.get('height')?.value ?? 1.6);
    this.weightValue.set(this.independentEscortform.get('weight')?.value ?? 60);
    this.ageValue.set(this.independentEscortform.get('age')?.value ?? 18);
  }

  loadNationalities() {
    this.http.get<any>('/data/nationalities.json').subscribe({
      next: (data) => {
        this.nationalities = data?.data?.objects ?? [];
        this.setupFilter();
      },
      error: (err) => console.error('Error loading nationalities', err)
    });
  }

  loadInternationalCodePhone() {
    this.http.get<any>('/data/internationalCodePhone.json').subscribe({
      next: (data) => {
        this.internacionalCodePhone = Array.isArray(data) ? data : [data];

        const defaultCountry = this.internacionalCodePhone[0];
        this.independentEscortform.get('interCodePhone')?.setValue(defaultCountry.name);

      },
      error: (err) => console.error('Error loading InternationalCodes', err)
    });
  }

  loadBaseCity() {
    this.http.get<any>('/data/citiesColombia.json').subscribe({
      next: (data) => {
        this.baseCity = Array.isArray(data) ? data : [data];

        const defaultCountry = this.baseCity[0];
        this.independentEscortform.get('baseCity')?.setValue(defaultCountry.name);

      },
      error: (err) => console.error('Error loading Cities of Colombia', err)
    });
  }

  continue(): void {
    this.hide.set(true);
    this.currentStep++;
  }

  back(): void {
    console.log(this.currentStep);
    if (this.currentStep === 0) {
      this.backToProfileType.emit();
      return;
    }
    this.currentStep--;
  }

  get validationCredentials(): boolean {
    return this.independentEscortform.get('email')?.valid === true &&
      this.independentEscortform.get('password')?.valid === true &&
      this.independentEscortform.get('confirmPassword')?.valid === true;
  }

  get validateSex(): String {
    const valorGender = this.independentEscortform.get('gender')?.value;

    if (valorGender === 'Man') {
      return "male";
    } else if (valorGender === 'Woman') {
      return "female";
    } else if (valorGender === 'Trans') {
      return "transgender";
    }
    return "";
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

  private setupFilter(): void {
    const nationalityCtrl = this.independentEscortform.get('nationality');
    this.filteredNationalities = nationalityCtrl!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.names?.common;
        return name ? this._filter(name) : this.nationalities.slice();
      })
    );
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.nationalities.filter(nation =>
      nation.names.common.toLowerCase().includes(filterValue)
    );
  }

  displayFn(nation: any): string {
    return nation && nation.names ? nation.names.common : '';
  }

  get areGenderandNameCompanionInvalid(): boolean {
    return this.independentEscortform.get('nameCompanion')?.valid === true &&
      this.independentEscortform.get('gender')?.valid === true;
  }

  get areOrientationAndNationalityInvalid(): boolean {
    return this.independentEscortform.get('orientation')?.valid === true &&
      this.independentEscortform.get('nationality')?.valid === true;
  }

  get areCityPhoneInValid(): boolean {
    return this.independentEscortform.get('baseCity')?.valid === true &&
      this.independentEscortform.get('interCodePhone')?.valid === true &&
      this.independentEscortform.get('phone')?.valid === true;
  }
}
