import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

import { BrowserStorageService } from '../storage/browser-storage.service';

const AUTH_SESSION_KEY = 'termsheet.authenticated';

export const DEMO_CREDENTIALS = Object.freeze({
  username: 'analyst',
  password: 'termsheet',
});

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(BrowserStorageService);
  private readonly authenticatedSubject = new BehaviorSubject<boolean>(this.restoreSession());

  readonly authenticated$ = this.authenticatedSubject.asObservable().pipe(distinctUntilChanged());

  login(username: string, password: string): boolean {
    const accepted =
      username.trim().toLowerCase() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password;

    if (accepted) {
      this.storage.setSession(AUTH_SESSION_KEY, 'true');
      this.authenticatedSubject.next(true);
    }

    return accepted;
  }

  logout(): void {
    this.storage.removeSession(AUTH_SESSION_KEY);
    this.authenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  private restoreSession(): boolean {
    return this.storage.getSession(AUTH_SESSION_KEY) === 'true';
  }
}
