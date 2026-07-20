import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class BrowserStorageService {
  private readonly document = inject(DOCUMENT);

  getLocal(key: string): string | null {
    return this.read('localStorage', key);
  }

  setLocal(key: string, value: string): void {
    this.write('localStorage', key, value);
  }

  removeLocal(key: string): void {
    this.remove('localStorage', key);
  }

  getSession(key: string): string | null {
    return this.read('sessionStorage', key);
  }

  setSession(key: string, value: string): void {
    this.write('sessionStorage', key, value);
  }

  removeSession(key: string): void {
    this.remove('sessionStorage', key);
  }

  private read(type: 'localStorage' | 'sessionStorage', key: string): string | null {
    try {
      return this.document.defaultView?.[type].getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private write(type: 'localStorage' | 'sessionStorage', key: string, value: string): void {
    try {
      this.document.defaultView?.[type].setItem(key, value);
    } catch {
      // Storage can be unavailable in private or hardened browser contexts.
    }
  }

  private remove(type: 'localStorage' | 'sessionStorage', key: string): void {
    try {
      this.document.defaultView?.[type].removeItem(key);
    } catch {
      // The in-memory subjects still provide a working session when storage is unavailable.
    }
  }
}
