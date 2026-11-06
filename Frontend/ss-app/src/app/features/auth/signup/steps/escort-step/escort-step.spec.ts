import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
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
    component.escortform = new FormGroup({
      accountType: new FormControl(''),
      escortProfile: new FormGroup({}),
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
