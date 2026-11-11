import { Routes } from '@angular/router';
import { ProfileMockRepository } from './data-access/profile-mock.repository';
import { ProfileRepository } from './data-access/profile.repository';
import { ProfileStateService } from './data-access/profile-state.service';
import { panelGuard } from './panel-guard';
import { ProfileHttpRepository } from './data-access/profile-http.repository';

export const panelRoutes: Routes = [
  {
    path: '',
    canActivate: [panelGuard],
    providers: [
      { provide: ProfileRepository, useClass: ProfileHttpRepository },
      ProfileStateService,
    ],
    loadComponent: () => import('./layout/panel-shell/panel-shell').then((m) => m.PanelShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'overview' },
      {
        path: 'overview',
        loadComponent: () => import('./pages/overview/overview').then((m) => m.Overview),
      },
      {
        path: 'profiles',
        loadComponent: () => import('./pages/profiles/profiles').then((m) => m.Profiles),
      },
      {
        path: 'profiles/:id',
        loadComponent: () =>
          import('./pages/profile-detail/profile-detail').then((m) => m.ProfileDetail),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
    ],
  },
];
