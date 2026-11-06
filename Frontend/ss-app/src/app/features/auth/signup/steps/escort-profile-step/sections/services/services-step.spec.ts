import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { CatalogsService } from '@shared/services/catalogs/catalogs-service';
import { ServicesStep } from './services-step';

describe('ServicesStep', () => {
  let component: ServicesStep;
  let fixture: ComponentFixture<ServicesStep>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesStep],
      providers: [{ provide: CatalogsService, useValue: { groupedServices: [] } }],
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
