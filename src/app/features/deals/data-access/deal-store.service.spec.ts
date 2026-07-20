import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { BrowserStorageService } from '../../../core/storage/browser-storage.service';
import { Deal } from './deal.model';
import { DealStoreService } from './deal-store.service';

const storedDeal: Deal = {
  id: 'stored-deal',
  name: 'Stored Deal',
  address: '1 Storage Lane',
  purchasePrice: 9_000_000,
  noi: 630_000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-02T00:00:00.000Z',
};

describe('DealStoreService', () => {
  let localValue: string | null;
  let service: DealStoreService;

  beforeEach(() => {
    localValue = null;
    TestBed.configureTestingModule({
      providers: [
        {
          provide: BrowserStorageService,
          useValue: {
            getLocal: () => localValue,
            setLocal: (_key: string, value: string) => (localValue = value),
            removeLocal: () => (localValue = null),
          },
        },
      ],
    });
    service = TestBed.inject(DealStoreService);
  });

  it('starts with the realistic sample deal book', () => {
    expect(service.dealsSnapshot.length).toBe(8);
    expect(service.dealsSnapshot.some((deal) => deal.name === 'Harbor Exchange')).toBe(true);
  });

  it('adds, updates, deletes, and persists a deal', () => {
    const created = service.add({
      name: '  Market Square  ',
      address: '  10 Main Street  ',
      purchasePrice: 20_000_000,
      noi: 1_400_000,
    });

    expect(service.dealsSnapshot[0].name).toBe('Market Square');
    expect(localValue).toContain('Market Square');

    service.update(created.id, {
      name: 'Market Square Updated',
      address: created.address,
      purchasePrice: created.purchasePrice,
      noi: created.noi,
    });
    expect(service.findById(created.id)?.name).toBe('Market Square Updated');

    expect(service.delete(created.id)).toBe(true);
    expect(service.findById(created.id)).toBeUndefined();
  });

  it('applies combined filters and resets them with the sample data', async () => {
    service.setFilters({
      name: '  harbor  ',
      minimumPrice: 48_500_000,
      maximumPrice: 48_500_000,
    });

    const filtered = await firstValueFrom(service.filteredDeals$);
    expect(filtered.map((deal) => deal.name)).toEqual(['Harbor Exchange']);
    expect(service.filtersSnapshot.name).toBe('harbor');

    service.reset();
    expect(service.filtersSnapshot).toEqual({ name: '', minimumPrice: null, maximumPrice: null });
    expect(service.dealsSnapshot.length).toBe(8);
  });

  it('returns a no-op result when updating or deleting an unknown deal', () => {
    expect(
      service.update('missing', {
        name: 'Missing',
        address: 'Nowhere',
        purchasePrice: 1,
        noi: 0,
      }),
    ).toBeUndefined();
    expect(service.delete('missing')).toBe(false);
  });

  it('restores valid persisted deals', () => {
    localValue = JSON.stringify([storedDeal]);

    const restoredService = TestBed.runInInjectionContext(() => new DealStoreService());

    expect(restoredService.dealsSnapshot).toEqual([storedDeal]);
  });

  it.each([
    ['invalid JSON', '{'],
    ['a non-array value', JSON.stringify({ deal: storedDeal })],
    ['a null item', JSON.stringify([null])],
  ])('falls back to sample data for %s', (_label, savedValue) => {
    localValue = savedValue;

    const restoredService = TestBed.runInInjectionContext(() => new DealStoreService());

    expect(restoredService.dealsSnapshot).toHaveLength(8);
  });

  it.each([
    ['id', { ...storedDeal, id: 1 }],
    ['name', { ...storedDeal, name: null }],
    ['address', { ...storedDeal, address: false }],
    ['purchase-price type', { ...storedDeal, purchasePrice: '9000000' }],
    ['non-finite purchase price', { ...storedDeal, purchasePrice: null }],
    ['non-positive purchase price', { ...storedDeal, purchasePrice: 0 }],
    ['NOI type', { ...storedDeal, noi: '630000' }],
    ['non-finite NOI', { ...storedDeal, noi: null }],
    ['created date', { ...storedDeal, createdAt: 1 }],
    ['updated date', { ...storedDeal, updatedAt: 1 }],
  ])('rejects persisted deals with an invalid %s', (_field, invalidDeal) => {
    localValue = JSON.stringify([invalidDeal]);

    const restoredService = TestBed.runInInjectionContext(() => new DealStoreService());

    expect(restoredService.dealsSnapshot).toHaveLength(8);
  });
});
