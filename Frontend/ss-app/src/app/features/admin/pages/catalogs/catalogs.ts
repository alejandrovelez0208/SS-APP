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

@Component({
  selector: 'app-catalogs',
  imports: [MatIcon],
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.css',
})
export class Catalogs {
  private readonly formDialog = inject(FormDialogService);
  readonly catalogTypes = Object.values(CatalogType);

  abrirDialogoCatalogo(): void {
    this.formDialog
      .open<{ tipoCatalogo: string }>({
        titulo: 'Seleccionar Catálogo',
        campos: [{
          tipo: 'select',
          nombre: 'tipoCatalogo',
          etiqueta: 'Catalog Type',
          opciones: this.catalogTypes,
        }],
      })
      .subscribe(res => { if (res) console.log(res.tipoCatalogo); });
  }
}
