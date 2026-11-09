import { Routes } from '@angular/router';
import { adminGuard } from './features/admin/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup').then((m) => m.Signup),
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: 'agency',
    pathMatch: 'full',
    redirectTo: 'panel/profiles',
  },
  {
    path: 'panel',
    loadChildren: () => import('./features/panel/panel.routes').then((m) => m.panelRoutes),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },
  {
    path: 'access-restricted',
    loadComponent: () =>
      import('./features/admin/pages/access-restricted/access-restricted').then(
        (m) => m.AccessRestricted,
      ),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
