import { TestBed } from '@angular/core/testing';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ErrorHandlerService } from './error-handler.service';

describe('ErrorHandlerService', () => {
  let service: ErrorHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: NotificationService, useValue: { error: () => undefined } }],
    });
    service = TestBed.inject(ErrorHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
