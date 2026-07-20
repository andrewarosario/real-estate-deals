import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;
  const dealsTree = {} as UrlTree;
  let authenticated: boolean;
  let router: { createUrlTree: jest.Mock };

  beforeEach(() => {
    authenticated = false;
    router = { createUrlTree: jest.fn(() => dealsTree) };
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => authenticated } },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows unauthenticated users to view login', () => {
    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));

    expect(result).toBe(true);
  });

  it('redirects authenticated users to the deal book', () => {
    authenticated = true;

    const result = TestBed.runInInjectionContext(() => guestGuard(route, state));

    expect(result).toBe(dealsTree);
    expect(router.createUrlTree).toHaveBeenCalledWith(['/deals']);
  });
});
