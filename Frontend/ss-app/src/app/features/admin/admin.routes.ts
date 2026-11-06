import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/admin-shell/admin-shell').then((m) => m.AdminShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'accounts',
        loadComponent: () => import('./pages/accounts/accounts').then((m) => m.Accounts),
      },
      {
        path: 'accounts/:id',
        loadComponent: () =>
          import('./pages/account-detail/account-detail').then((m) => m.AccountDetailPage),
      },
      {
        path: 'user-control',
        loadComponent: () => import('./pages/user-control/user-control').then((m) => m.UserControl),
      },
    ],
  },
];
