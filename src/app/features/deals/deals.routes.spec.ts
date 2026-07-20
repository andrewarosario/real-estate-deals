import { Type } from '@angular/core';

import { DealFormComponent } from './deal-form/deal-form.component';
import { DealListComponent } from './deal-list/deal-list.component';
import { DEALS_ROUTES } from './deals.routes';

function loadComponent(loader: unknown): Promise<Type<unknown>> {
  return (loader as () => Promise<Type<unknown>>)();
}

describe('deal routes', () => {
  it('groups list, create, and edit pages under the deals path', () => {
    const dealsRoute = DEALS_ROUTES.find((route) => route.path === 'deals');

    expect(dealsRoute?.children?.map((route) => route.path)).toEqual(['', 'new', ':id/edit']);
    expect(DEALS_ROUTES.at(-1)).toMatchObject({
      path: '',
      pathMatch: 'full',
      redirectTo: 'deals',
    });
  });

  it('lazy-loads each deal component', async () => {
    const children = DEALS_ROUTES.find((route) => route.path === 'deals')?.children ?? [];

    await expect(loadComponent(children.find((route) => route.path === '')?.loadComponent)).resolves.toBe(
      DealListComponent,
    );
    await expect(
      loadComponent(children.find((route) => route.path === 'new')?.loadComponent),
    ).resolves.toBe(DealFormComponent);
    await expect(
      loadComponent(children.find((route) => route.path === ':id/edit')?.loadComponent),
    ).resolves.toBe(DealFormComponent);
  });
});
