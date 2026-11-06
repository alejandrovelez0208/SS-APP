import { Component, Input, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CatalogItem, InternationalCodePhone } from '@shared/models/escort.model';
import { CatalogsService } from '@shared/services/catalogs/catalogs-service';

@Component({
  selector: 'app-contact-step',
  imports: [
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact-step.html',
  styleUrls: [
    '../styles/fields.css',
    '../styles/checkboxes.css',
    '../../../../../../../shared/styles/material-dark-overrides.css',
    './contact-step.css',
  ],
})
export class ContactStep {
  @Input({ required: true }) form!: FormGroup;
  @Input() internationalCodes: InternationalCodePhone[] = [];
  @Input() serviceModalities: CatalogItem[] = [];

  private readonly catalogsService = inject(CatalogsService);

  get isAvailable247(): boolean {
    return this.form.get('availableAllDay')?.value === true;
  }

  getControlModalityNameByFormula(id: number): string {
    return this.catalogsService.getFormulaMap('modality').get(id) ?? 'Modalities not found';
  }
}
