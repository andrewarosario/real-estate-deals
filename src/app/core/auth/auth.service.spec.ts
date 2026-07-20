import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from '../storage/browser-storage.service';
import { AuthService, DEMO_CREDENTIALS } from './auth.service';

describe('AuthService', () => {
  let sessionValue: string | null;
  let service: AuthService;

  beforeEach(() => {
    sessionValue = null;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BrowserStorageService,
          useValue: {
            getSession: () => sessionValue,
            setSession: (_key: string, value: string) => (sessionValue = value),
            removeSession: () => (sessionValue = null),
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('accepts only the labeled demo credential', () => {
    expect(service.login('wrong', 'wrong')).toBe(false);
    expect(service.isAuthenticated()).toBe(false);

    expect(service.login(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password)).toBe(true);
    expect(service.isAuthenticated()).toBe(true);
    expect(sessionValue).toBe('true');
  });

  it('clears only the authentication session on logout', () => {
    service.login(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password);
    service.logout();

    expect(service.isAuthenticated()).toBe(false);
    expect(sessionValue).toBeNull();
  });

  it('restores an authenticated browser session', () => {
    sessionValue = 'true';

    const restoredService = TestBed.runInInjectionContext(() => new AuthService());

    expect(restoredService.isAuthenticated()).toBe(true);
  });
});
