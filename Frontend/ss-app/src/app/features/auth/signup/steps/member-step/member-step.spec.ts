import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MemberStep } from './member-step';

describe('MemberStep', () => {
  let component: MemberStep;
  let fixture: ComponentFixture<MemberStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberStep],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberStep);
    component = fixture.componentInstance;
    component.memberform = new FormGroup({
      userName: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      confirmPassword: new FormControl(''),
      identity: new FormControl(''),
      preferences: new FormControl(''),
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
