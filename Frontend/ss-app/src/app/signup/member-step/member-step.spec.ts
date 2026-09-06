import { ComponentFixture, TestBed } from '@angular/core/testing';

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
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
