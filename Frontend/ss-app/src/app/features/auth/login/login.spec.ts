import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth-service';
import { ErrorHandlerService } from '@shared/services/error/error-handler-service';
import { NotificationService } from '@shared/services/notification/notification-service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: { isLoggedIn: () => false } },
        { provide: NotificationService, useValue: {} },
        { provide: ErrorHandlerService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
