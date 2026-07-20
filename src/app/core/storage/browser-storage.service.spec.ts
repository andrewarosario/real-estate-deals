import { TestBed } from '@angular/core/testing';

import { BrowserStorageService } from './browser-storage.service';

describe('BrowserStorageService', () => {
  it('reads, writes, and removes local and session values', () => {
    TestBed.configureTestingModule({});
    const service = TestBed.inject(BrowserStorageService);

    service.setLocal('local-key', 'local-value');
    service.setSession('session-key', 'session-value');

    expect(service.getLocal('local-key')).toBe('local-value');
    expect(service.getSession('session-key')).toBe('session-value');

    service.removeLocal('local-key');
    service.removeSession('session-key');

    expect(service.getLocal('local-key')).toBeNull();
    expect(service.getSession('session-key')).toBeNull();
  });

  it('degrades safely when browser storage is unavailable', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable');
    });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable');
    });
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new DOMException('Storage is unavailable');
    });

    TestBed.configureTestingModule({});
    const service = TestBed.inject(BrowserStorageService);

    expect(service.getLocal('key')).toBeNull();
    expect(service.getSession('key')).toBeNull();
    expect(() => service.setLocal('key', 'value')).not.toThrow();
    expect(() => service.setSession('key', 'value')).not.toThrow();
    expect(() => service.removeLocal('key')).not.toThrow();
    expect(() => service.removeSession('key')).not.toThrow();

    jest.restoreAllMocks();
  });
});
