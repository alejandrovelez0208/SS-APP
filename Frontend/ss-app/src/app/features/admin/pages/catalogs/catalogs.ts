import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { filter, switchMap } from 'rxjs';
import { Catalog, CatalogFormValue, CatalogType } from '@shared/models/catalog.model';
import { DialogService } from '@shared/services/dialog/dialog.service';
import { FormDialogService } from '@shared/services/dialog/form-dialog.service';
import { NotificationService } from '@shared/services/notification/notification.service';
import { AccountStatusChip } from '../../components/account-status-chip/account-status-chip';
import { CATALOG_TYPE_OPTIONS } from '../../constants/catalog-type-options';
import { AdminCatalogFacade } from '../../data-access/admin-catalog.facade';

type CatalogStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE';

@Component({
  selector: 'app-catalogs',
  imports: [
    AccountStatusChip,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
  ],
  templateUrl: './catalogs.html',
  styleUrls: ['../../styles/admin-page.css', '../../styles/admin-material.css', './catalogs.css'],
})
export class Catalogs implements OnInit {
  private readonly formDialog = inject(FormDialogService);
  private readonly adminCatalog = inject(AdminCatalogFacade);
  private readonly dialogService = inject(DialogService);
  private readonly notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  readonly pageSize = 10;
  readonly catalogTypes = CATALOG_TYPE_OPTIONS.map((option) => option.label);
  readonly typeOptions = CATALOG_TYPE_OPTIONS;
  readonly statusOptions: readonly CatalogStatusFilter[] = ['ALL', 'ACTIVE', 'INACTIVE'];
  readonly displayedColumns = ['name', 'type', 'status', 'action'];

  readonly catalogs = signal<Catalog[]>([]);
  readonly nameFilter = signal('');
  readonly typeFilter = signal<CatalogType | 'ALL'>('ALL');
  readonly statusFilter = signal<CatalogStatusFilter>('ALL');
  readonly pageIndex = signal(0);

  readonly filteredCatalogs = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();
    const type = this.typeFilter();
    const status = this.statusFilter();

    return this.catalogs().filter((catalog) => {
      const matchesName = !name || catalog.name.toLowerCase().includes(name);
      const matchesType = type === 'ALL' || catalog.catalogType === type;
      const matchesStatus =
        status === 'ALL' || (status === 'ACTIVE' ? catalog.active : !catalog.active);

      return matchesName && matchesType && matchesStatus;
    });
  });

  readonly visibleCatalogs = computed(() => {
    const start = this.pageIndex() * this.pageSize;
    return this.filteredCatalogs().slice(start, start + this.pageSize);
  });

  ngOnInit(): void {
    this.loadCatalogs();
  }

  createCatalog(): void {
    this.formDialog
      .open<CatalogFormValue>({
        titulo: 'New Catalog Item',
        icono: 'add_circle',
        campos: [
          {
            tipo: 'select',
            nombre: 'catalogType',
            etiqueta: 'Catalog Type',
            opciones: this.catalogTypes,
            icono: 'category',
          },
          {
            tipo: 'text',
            nombre: 'name',
            etiqueta: 'Name',
            icono: 'label',
          },
        ],
      })
      .pipe(
        filter((value): value is CatalogFormValue => !!value),
        switchMap((value) => this.adminCatalog.create(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (catalog) => {
          this.notification.success(`Catalog "${catalog.name}" created.`);
          this.loadCatalogs();
        },
        error: (error: unknown) => {
          console.error('Error creating catalog', error);
          this.notification.error('Could not create the catalog item.');
        },
      });
  }

  updateName(event: Event): void {
    this.nameFilter.set((event.target as HTMLInputElement).value);
    this.pageIndex.set(0);
  }

  updateType(type: CatalogType | 'ALL'): void {
    this.typeFilter.set(type);
    this.pageIndex.set(0);
  }

  updateStatus(status: CatalogStatusFilter): void {
    this.statusFilter.set(status);
    this.pageIndex.set(0);
  }

  updatePage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
  }

  clearFilters(): void {
    this.nameFilter.set('');
    this.typeFilter.set('ALL');
    this.statusFilter.set('ALL');
    this.pageIndex.set(0);
  }

  confirmAndExecute(actionType: 'activate' | 'deactivate' | 'delete', catalog: Catalog): void {
    const config = {
      activate: {
        title: 'Activate catalog item?',
        message: `"${catalog.name}" will be available again in the signup.`,
        confirmText: 'Activate',
        severity: 'warning' as const,
        action: () => this.applyStatus(catalog, true),
      },
      deactivate: {
        title: 'Deactivate catalog item?',
        message: `"${catalog.name}" will stop appearing in the signup until reactivated.`,
        confirmText: 'Deactivate',
        severity: 'warning' as const,
        action: () => this.applyStatus(catalog, false),
      },
      delete: {
        title: 'Delete catalog item?',
        message: `"${catalog.name}" will be permanently removed.`,
        confirmText: 'Delete',
        severity: 'danger' as const,
        action: () => this.applyDelete(catalog),
      }
    }[actionType];

    this.dialogService
      .openConfirmation(
        config.title,
        config.message,
        config.confirmText,
        'Cancel',
        config.severity
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((confirmed) => {
        if (confirmed) {
          config.action();
        }
      });
  }

  private applyStatus(catalog: Catalog, active: boolean): void {
    this.adminCatalog
      .updateStatus(catalog.id, active)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.catalogs.update((items) =>
            items.map((item) => (item.id === updated.id ? updated : item)),
          );
          this.pageIndex.set(0);
          this.notification.success(
            active ? 'Catalog item activated.' : 'Catalog item deactivated.',
          );
        },
        error: (error: unknown) => {
          console.error('Error updating catalog status', error);
          this.notification.error('Could not update the catalog item.');
        },
      });
  }

  private applyDelete(catalog: Catalog): void {
    this.adminCatalog
      .deleteItem(catalog.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.catalogs.update((items) => items.filter((item) => item.id !== catalog.id));
          this.pageIndex.set(0);
          this.notification.success('Catalog item deleted.');
        },
        error: (error: unknown) => {
          console.error('Error deleting catalog item', error);
          this.notification.error('Could not delete the catalog item.');
        },
      });
  }

  private loadCatalogs(): void {
    this.adminCatalog
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (catalogs) => {
          this.catalogs.set(catalogs);
          this.pageIndex.set(0);
        },
        error: (error: unknown) => {
          console.error('Error loading catalogs', error);
          this.notification.error('Could not load catalog items.');
        },
      });
  }
}
