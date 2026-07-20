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
    loadChildren: () =>
      import('./features/deals/deals.routes').then((routeModule) => routeModule.DEALS_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
