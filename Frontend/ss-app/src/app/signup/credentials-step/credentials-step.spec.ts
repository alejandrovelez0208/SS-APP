import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
