import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CatalogItem } from '@shared/models/escort.model';
import { CatalogsService } from '@shared/services/catalogs/catalogs-service';

@Component({
  selector: 'app-services-step',
  imports: [
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './services-step.html',
  styleUrls: [
    '../styles/fields.css',
    '../styles/checkboxes.css',
    '../../../../../../../shared/styles/form-field.css',
    './services-step.css',
  ],
})
export class ServicesStep {
  @Input({ required: true }) form!: FormGroup;
  @Input() channels: CatalogItem[] = [];

  readonly catalogsService = inject(CatalogsService);

  getControlChannelNameByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('channels').get(id) ?? 'Channels not found';
  }

  getControlTypeOfServicesNameByFormula(id: number): string {
    return (
      this.catalogsService.getFormulaMap('typeOfServices').get(id) ?? 'Type of services not found'
    );
  }
}
