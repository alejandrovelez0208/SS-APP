import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { EMPTY } from 'rxjs';
import { SignupCatalogStateService } from '@features/auth/signup/data-access/signup-catalog-state.service';
import { StaticDataService } from '@shared/data/static-data.service';
import { EscortProfileStep } from './escort-profile-step';

function createProfileForm(): FormGroup {
  return new FormGroup({
    userName: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    confirmPassword: new FormControl(''),
    nameCompanion: new FormControl(''),
    gender: new FormControl(''),
    age: new FormControl(18),
    hairColor: new FormControl(''),
    height: new FormControl(1.6),
    weight: new FormControl(60),
    orientation: new FormControl('heterosexual'),
    nationality: new FormControl(''),
    baseCity: new FormControl(''),
    interCodePhone: new FormControl(''),
    phone: new FormControl(''),
    applications: new FormGroup({}),
    serviceModality: new FormGroup({}),
    serviceType: new FormGroup({}),
    departures: new FormGroup({}),
    availableAllDay: new FormControl(false),
    scheduleFrom: new FormControl('09:00'),
    scheduleTo: new FormControl('06:00'),
    website: new FormControl(''),
    basicRate: new FormControl(50000),
  });
}

describe('EscortProfileStep', () => {
  let component: EscortProfileStep;
  let fixture: ComponentFixture<EscortProfileStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscortProfileStep],
      providers: [
        {
          provide: StaticDataService,
          useValue: {
            getNationalities: () => EMPTY,
            getInternationalCodes: () => EMPTY,
            getCitiesColombia: () => EMPTY,
          },
        },
        {
          provide: SignupCatalogStateService,
          useValue: { groupedServices: [], getFormulaMap: () => new Map() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EscortProfileStep);
    component = fixture.componentInstance;
    component.escortProfileform = createProfileForm();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render credentials on the first step', () => {
    expect(fixture.nativeElement.querySelector('app-credentials-step')).toBeTruthy();
  });

  it('should render each profile section on its step', () => {
    const sections = [
      'app-basics-step',
      'app-physical-step',
      'app-contact-step',
      'app-services-step',
      'app-departures-step',
      'app-photos-step',
    ];

    sections.forEach((selector, index) => {
      const stepFixture = TestBed.createComponent(EscortProfileStep);
      stepFixture.componentInstance.escortProfileform = createProfileForm();
      stepFixture.componentInstance.currentStep = index + 2;
      stepFixture.detectChanges();

      expect(stepFixture.nativeElement.querySelector(selector)).toBeTruthy();
      stepFixture.destroy();
    });
  });
});
