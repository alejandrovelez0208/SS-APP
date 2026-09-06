import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndependentEscortStep } from './independent-escort-step';

describe('IndependentEscortStep', () => {
  let component: IndependentEscortStep;
  let fixture: ComponentFixture<IndependentEscortStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndependentEscortStep],
    }).compileComponents();

    fixture = TestBed.createComponent(IndependentEscortStep);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
