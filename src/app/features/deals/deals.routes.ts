import { Routes } from '@angular/router';

export const DEALS_ROUTES: Routes = [
  {
    path: 'deals',
    children: [
      {
        path: '',
        title: 'Deal book | TermSheet',
        loadComponent: () =>
          import('./deal-list/deal-list.component').then(
            (component) => component.DealListComponent,
          ),
      },
      {
        path: 'new',
        title: 'Add deal | TermSheet',
        loadComponent: () =>
          import('./deal-form/deal-form.component').then(
            (component) => component.DealFormComponent,
          ),
      },
      {
        path: ':id/edit',
        title: 'Edit deal | TermSheet',
        loadComponent: () =>
          import('./deal-form/deal-form.component').then(
            (component) => component.DealFormComponent,
          ),
      },
    ],
  },
  { path: '', pathMatch: 'full', redirectTo: 'deals' },
];
