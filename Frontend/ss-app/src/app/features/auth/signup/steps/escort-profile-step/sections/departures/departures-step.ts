import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { CatalogItem } from '@shared/models/escort.model';
import { CatalogsService } from '@shared/services/catalogs/catalogs-service';

@Component({
  selector: 'app-departures-step',
  imports: [MatCheckboxModule, MatSliderModule, ReactiveFormsModule],
  templateUrl: './departures-step.html',
  styleUrls: [
    '../styles/fields.css',
    '../styles/sliders.css',
    '../styles/checkboxes.css',
    './departures-step.css',
  ],
})
export class DeparturesStep implements OnInit {
  @Input({ required: true }) form!: FormGroup;
  @Input() departures: CatalogItem[] = [];

  readonly rateValue = signal(50000);

  private readonly catalogsService = inject(CatalogsService);

  ngOnInit(): void {
    this.rateValue.set(this.form.get('basicRate')?.value ?? 50000);
  }

  onRateChange(value: number): void {
    this.rateValue.set(value);
  }

  formatRate(value: number): string {
    if (!value) return '$50.000 COP';

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(value);
  }

  getControlDepartureNamesByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('departures').get(id) ?? 'Departures not found';
  }
}
