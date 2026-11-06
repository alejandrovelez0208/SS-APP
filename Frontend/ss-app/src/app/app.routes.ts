import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./features/agency-dashboard/agency-dashboard').then((m) => m.AgencyDashboard),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
