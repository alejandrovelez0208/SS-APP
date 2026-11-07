import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { SignupCatalogStateService } from '@features/auth/signup/data-access/signup-catalog-state.service';
import { ContactStep } from './contact-step';

describe('ContactStep', () => {
  let component: ContactStep;
  let fixture: ComponentFixture<ContactStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactStep],
      providers: [{ provide: SignupCatalogStateService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactStep);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      interCodePhone: new FormControl(''),
      phone: new FormControl(''),
      serviceModality: new FormGroup({}),
      availableAllDay: new FormControl(false),
      scheduleFrom: new FormControl('09:00'),
      scheduleTo: new FormControl('06:00'),
    });
    component.internationalCodes = [];
    component.serviceModalities = [];
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
