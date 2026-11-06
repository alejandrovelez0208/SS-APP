import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepActions } from './step-actions';

describe('StepActions', () => {
  let component: StepActions;
  let fixture: ComponentFixture<StepActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepActions],
    }).compileComponents();

    fixture = TestBed.createComponent(StepActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
