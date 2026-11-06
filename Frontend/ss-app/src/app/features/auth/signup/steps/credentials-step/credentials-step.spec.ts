import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CredentialsStep } from './credentials-step';

describe('CredentialsStep', () => {
  let component: CredentialsStep;
  let fixture: ComponentFixture<CredentialsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CredentialsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(CredentialsStep);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      userName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
    });
    component.stepIndex = 1;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
