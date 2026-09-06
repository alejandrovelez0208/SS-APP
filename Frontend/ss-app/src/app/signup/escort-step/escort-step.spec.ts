import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscortStep } from './escort-step';

describe('EscortStep', () => {
  let component: EscortStep;
  let fixture: ComponentFixture<EscortStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EscortStep],
    }).compileComponents();

    fixture = TestBed.createComponent(EscortStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
