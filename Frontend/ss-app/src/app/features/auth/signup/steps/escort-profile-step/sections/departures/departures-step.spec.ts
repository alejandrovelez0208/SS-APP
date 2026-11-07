import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CatalogOptionsService } from '@shared/services/catalogs/catalog-options.service';
import { DeparturesStep } from './departures-step';

describe('DeparturesStep', () => {
  let component: DeparturesStep;
  let fixture: ComponentFixture<DeparturesStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeparturesStep],
      providers: [{ provide: CatalogOptionsService, useValue: {} }],
    }).compileComponents();

    fixture = TestBed.createComponent(DeparturesStep);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      departures: new FormGroup({}),
      basicRate: new FormControl(50000),
    });
    component.departures = [];
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
