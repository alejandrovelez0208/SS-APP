import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscortProfileStep } from './escort-profile-step';

describe('EscortProfileStep', () => {
  let component: EscortProfileStep;
  let fixture: ComponentFixture<EscortProfileStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscortProfileStep],
    }).compileComponents();

    fixture = TestBed.createComponent(EscortProfileStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
