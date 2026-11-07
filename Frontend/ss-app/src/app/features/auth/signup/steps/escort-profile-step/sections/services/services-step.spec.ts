import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CatalogOptionsService } from '@shared/services/catalogs/catalog-options.service';
import { ServicesStep } from './services-step';

describe('ServicesStep', () => {
  let component: ServicesStep;
  let fixture: ComponentFixture<ServicesStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesStep],
      providers: [
        {
          provide: CatalogOptionsService,
          useValue: { groupedServices: [], getFormulaMap: () => new Map() },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ServicesStep);
    component = fixture.componentInstance;
    component.form = new FormGroup({
      applications: new FormGroup({}),
      serviceType: new FormGroup({}),
      website: new FormControl(''),
    });
    component.channels = [];
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
