import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth-service';
import { DialogService } from '@shared/services/dialog/dialog-service';
import { AgencyDashboard } from './agency-dashboard';

describe('AgencyDashboard', () => {
  let component: AgencyDashboard;
  let fixture: ComponentFixture<AgencyDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgencyDashboard],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: {} },
        { provide: DialogService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgencyDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
