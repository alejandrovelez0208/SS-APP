import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { of } from 'rxjs';
import { PhysicalStep } from './physical-step';

describe('PhysicalStep', () => {
  let component: PhysicalStep;
  let fixture: ComponentFixture<PhysicalStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhysicalStep],
    }).compileComponents();

    fixture = TestBed.createComponent(PhysicalStep);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      heightCm: new FormControl(160),
      weight: new FormControl(60),
      orientation: new FormControl('HETEROSEXUAL'),
      nationality: new FormControl(''),
      baseCity: new FormControl(''),
    });
    component.filteredNationalities = of([]);
    component.baseCity = [];
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
