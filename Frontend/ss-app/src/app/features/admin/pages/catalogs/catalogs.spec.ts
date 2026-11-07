import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NotificationService } from '@shared/services/notification/notification-service';
import { FormDialogService } from '@shared/services/dialog/form-dialog-service';
import { DialogService } from '@shared/services/dialog/dialog-service';
import { AdminCatalogService } from '../../services/admin-catalog.service';
import { Catalogs } from './catalogs';

describe('Catalogs', () => {
  let component: Catalogs;
  let fixture: ComponentFixture<Catalogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catalogs],
      providers: [
        { provide: FormDialogService, useValue: {} },
        { provide: DialogService, useValue: {} },
        { provide: AdminCatalogService, useValue: { getAll: () => of([]) } },
        { provide: NotificationService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Catalogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
