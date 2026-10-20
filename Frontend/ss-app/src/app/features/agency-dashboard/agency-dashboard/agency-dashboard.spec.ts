import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyDashboard } from './agency-dashboard';

describe('AgencyDashboard', () => {
  let component: AgencyDashboard;
  let fixture: ComponentFixture<AgencyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(AgencyDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
