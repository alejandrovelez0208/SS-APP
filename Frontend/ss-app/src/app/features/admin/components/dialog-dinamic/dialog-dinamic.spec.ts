import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDinamic } from './dialog-dinamic';

describe('DialogDinamic', () => {
  let component: DialogDinamic;
  let fixture: ComponentFixture<DialogDinamic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogDinamic],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogDinamic);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
