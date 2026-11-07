import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DialogDinamic } from './dialog-dinamic';

describe('DialogDinamic', () => {
  let component: DialogDinamic;
  let fixture: ComponentFixture<DialogDinamic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDinamic],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => undefined } },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            titulo: 'Test',
            icono: 'add_circle',
            campos: [{ tipo: 'text', nombre: 'name', etiqueta: 'Name' }],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogDinamic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
