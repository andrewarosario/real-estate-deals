import { Type } from '@angular/core';

import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DealFormComponent } from './features/deals/deal-form/deal-form.component';
import { DealListComponent } from './features/deals/deal-list/deal-list.component';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { routes } from './app.routes';

function loadComponent(loader: unknown): Promise<Type<unknown>> {
  return (loader as () => Promise<Type<unknown>>)();
}

describe('application routes', () => {
  it('guards public and private route boundaries', () => {
    const loginRoute = routes.find((route) => route.path === 'login');
    const privateRoute = routes.find((route) => route.path === '');

    expect(loginRoute?.canActivate).toContain(guestGuard);
    expect(privateRoute?.canActivate).toContain(authGuard);
    expect(privateRoute?.children?.map((route) => route.path)).toEqual([
      'deals',
      'deals/new',
      'deals/:id/edit',
      '',
    ]);
    expect(routes.at(-1)).toMatchObject({ path: '**', redirectTo: '' });
  });

  it('lazy-loads each routed component', async () => {
    const loginRoute = routes.find((route) => route.path === 'login');
    const privateRoute = routes.find((route) => route.path === '');
    const children = privateRoute?.children ?? [];

    await expect(loadComponent(loginRoute?.loadComponent)).resolves.toBe(LoginComponent);
    await expect(loadComponent(privateRoute?.loadComponent)).resolves.toBe(AppShellComponent);
    await expect(loadComponent(children.find((route) => route.path === 'deals')?.loadComponent)).resolves.toBe(
      DealListComponent,
    );
    await expect(
      loadComponent(children.find((route) => route.path === 'deals/new')?.loadComponent),
    ).resolves.toBe(DealFormComponent);
    await expect(
      loadComponent(children.find((route) => route.path === 'deals/:id/edit')?.loadComponent),
    ).resolves.toBe(DealFormComponent);
  });
});
