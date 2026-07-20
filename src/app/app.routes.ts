import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Sign in | TermSheet',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then((component) => component.LoginComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./layout/app-shell/app-shell.component').then(
        (component) => component.AppShellComponent,
      ),
    children: [
      {
        path: 'deals',
        title: 'Deal book | TermSheet',
        loadComponent: () =>
          import('./features/deals/deal-list/deal-list.component').then(
            (component) => component.DealListComponent,
          ),
      },
      {
        path: 'deals/new',
        title: 'Add deal | TermSheet',
        loadComponent: () =>
          import('./features/deals/deal-form/deal-form.component').then(
            (component) => component.DealFormComponent,
          ),
      },
      {
        path: 'deals/:id/edit',
        title: 'Edit deal | TermSheet',
        loadComponent: () =>
          import('./features/deals/deal-form/deal-form.component').then(
            (component) => component.DealFormComponent,
          ),
      },
      { path: '', pathMatch: 'full', redirectTo: 'deals' },
    ],
  },
  { path: '**', redirectTo: '' },
];
