import { Type } from '@angular/core';

import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { DEALS_ROUTES } from './features/deals/deals.routes';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { routes } from './app.routes';

function loadComponent(loader: unknown): Promise<Type<unknown>> {
  return (loader as () => Promise<Type<unknown>>)();
}

function loadChildren(loader: unknown): Promise<unknown> {
  return (loader as () => Promise<unknown>)();
}

describe('application routes', () => {
  it('guards public and private route boundaries', () => {
    const loginRoute = routes.find((route) => route.path === 'login');
    const privateRoute = routes.find((route) => route.path === '');

    expect(loginRoute?.canActivate).toContain(guestGuard);
    expect(privateRoute?.canActivate).toContain(authGuard);
    expect(privateRoute?.children).toBeUndefined();
    expect(privateRoute?.loadChildren).toBeDefined();
    expect(routes.at(-1)).toMatchObject({ path: '**', redirectTo: '' });
  });

  it('lazy-loads the public component, private shell, and deal routes', async () => {
    const loginRoute = routes.find((route) => route.path === 'login');
    const privateRoute = routes.find((route) => route.path === '');

    await expect(loadComponent(loginRoute?.loadComponent)).resolves.toBe(LoginComponent);
    await expect(loadComponent(privateRoute?.loadComponent)).resolves.toBe(AppShellComponent);
    await expect(loadChildren(privateRoute?.loadChildren)).resolves.toBe(DEALS_ROUTES);
  });
});
