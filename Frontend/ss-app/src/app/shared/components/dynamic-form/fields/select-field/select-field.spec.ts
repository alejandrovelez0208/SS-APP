import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { SelectField } from './select-field';

describe('SelectField', () => {
  let component: SelectField;
  let fixture: ComponentFixture<SelectField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectField],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectField);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('config', {
      tipo: 'select',
      nombre: 'catalogType',
      etiqueta: 'Catalog Type',
      opciones: ['One', 'Two'],
    });
    fixture.componentRef.setInput('control', new FormControl(''));
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
