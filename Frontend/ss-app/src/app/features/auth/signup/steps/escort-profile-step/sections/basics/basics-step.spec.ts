import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { BasicsStep } from './basics-step';

describe('BasicsStep', () => {
  let component: BasicsStep;
  let fixture: ComponentFixture<BasicsStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicsStep],
    }).compileComponents();

    fixture = TestBed.createComponent(BasicsStep);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      nameCompanion: new FormControl(''),
      gender: new FormControl(''),
      age: new FormControl(18),
      hairColor: new FormControl(''),
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
