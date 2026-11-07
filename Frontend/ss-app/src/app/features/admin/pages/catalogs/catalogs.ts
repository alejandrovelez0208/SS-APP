import { Component, inject } from '@angular/core';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RoleBadge } from '../../components/role-badge/role-badge';
import { MatSelectModule } from '@angular/material/select';
import { CATALOG_TYPE_OPTIONS, CatalogType } from './Constants/Catalog';
import { CampoConfig, DialogDinamic } from '../../components/dialog-dinamic/dialog-dinamic';
import { MatDialog } from '@angular/material/dialog';
import { FormDialogService } from '@shared/services/dialog/form-dialog-service';
import { filter, map, switchMap, tap } from 'rxjs';
import { CatalogsService } from '../../services/catalogs-service';

@Component({
  selector: 'app-catalogs',
  imports: [MatIcon],
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.css',
})
export class Catalogs {
  private readonly formDialog = inject(FormDialogService);
  readonly catalogTypes = Object.values(CATALOG_TYPE_OPTIONS).map(option => option.label);

  constructor(private catalogsService: CatalogsService) { }

  abrirDialogoCatalogo(): void {
    this.formDialog
      .open<any>({
        titulo: 'Create Element',
        campos: [{
          tipo: 'select',
          nombre: 'catalogType',
          etiqueta: 'Catalog Type',
          opciones: this.catalogTypes,
        }, {
          tipo: 'text',
          nombre: 'name',
          etiqueta: 'Name',
        }]
      }).pipe(
        filter((res): res is any => !!res),
        map(res => {
          const encontrada = CATALOG_TYPE_OPTIONS.find(opt => opt.label === res.catalogType);
          return {
            catalogType: encontrada ? encontrada.value : res.catalogType,
            name: res.name
          };
        }),
        tap(payloadMapeado => console.log('Payload que se enviará a la API (Enum):', payloadMapeado)),
        switchMap(payloadMapeado => this.catalogsService.createElement(payloadMapeado))
      )
      .subscribe({
        next: (response) => {
          console.log('¡Guardado con éxito!', response);
          this.recargarTabla();
        },
        error: err => console.error('Error al guardar', err),
      });
  }
  recargarTabla(): void {
    /*   this.catalogsService.recargarTabla(); */
  }

}
