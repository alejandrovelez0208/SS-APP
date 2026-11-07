import { Component, inject } from '@angular/core';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RoleBadge } from '../../components/role-badge/role-badge';
import { MatSelectModule } from '@angular/material/select';
import { CatalogType } from './Constants/Catalog';
import { CampoConfig, DialogDinamic } from '../../components/dialog-dinamic/dialog-dinamic';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-catalogs',
  imports: [
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
    MatSelectModule],
  templateUrl: './catalogs.html',
  styleUrl: './catalogs.css',
})
export class Catalogs {
  readonly catalogTypes = Object.values(CatalogType);


  // Inyectar el servicio MatDialog usando la función inject() (moderno en Angular)
  private dialog = inject(MatDialog);

  // Método que abre el diálogo con el campo select de catálogos
  abrirDialogoCatalogo(): void {
    const camposCatalogo: CampoConfig[] = [
      {
        nombre: 'CatalogFather',
        etiqueta: 'Catalog Father',
        tipo: 'select', // <-- Definimos que será un select
        opciones: this.catalogTypes // (Nota: Asegúrate de soportar opciones en tu DialogDinamic si las usas)
      },
      {
        nombre: 'CatalogType',
        etiqueta: 'Catalog Type',
        tipo: 'field', // <-- Definimos que será un select
      }
    ];

    const dialogRef = this.dialog.open(DialogDinamic, {
      width: '500px',
      panelClass: 'dialog-dinamic-panel',
      data: { titulo: 'Crear Catálogo', campos: camposCatalogo }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) {
        console.log('Valor seleccionado:', resultado);
        // Aquí puedes realizar la lógica cuando el usuario guarde
      }
    });
  }
}
