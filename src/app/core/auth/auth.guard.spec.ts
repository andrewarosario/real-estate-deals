import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = { url: '/deals/new' } as RouterStateSnapshot;
  const loginTree = {} as UrlTree;
  let authenticated: boolean;
  let router: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authenticated = false;
    router = { createUrlTree: jest.fn(() => loginTree) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => authenticated } },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows authenticated users to enter private routes', () => {
    authenticated = true;

    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(true);
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  it('redirects guests to login while preserving their destination', () => {
    const result = TestBed.runInInjectionContext(() => authGuard(route, state));

    expect(result).toBe(loginTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/deals/new' },
    });
  });
});
