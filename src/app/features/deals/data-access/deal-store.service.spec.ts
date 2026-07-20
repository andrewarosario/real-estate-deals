import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { BrowserStorageService } from '../../../core/storage/browser-storage.service';
import { DealStoreService } from './deal-store.service';

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
    expect(service.dealsSnapshot.some((deal) => deal.name === 'Harbor Exchange')).toBeTrue();
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

    expect(service.delete(created.id)).toBeTrue();
    expect(service.findById(created.id)).toBeUndefined();
  });

  it('applies combined filters and resets them with the sample data', async () => {
    service.setFilters({ name: 'harbor', minimumPrice: 48_500_000, maximumPrice: 48_500_000 });

    const filtered = await firstValueFrom(service.filteredDeals$);
    expect(filtered.map((deal) => deal.name)).toEqual(['Harbor Exchange']);

    service.reset();
    expect(service.filtersSnapshot).toEqual({ name: '', minimumPrice: null, maximumPrice: null });
    expect(service.dealsSnapshot.length).toBe(8);
  });
});
