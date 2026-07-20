import { WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { NotificationService } from '../../../core/notifications/notification.service';
import { DealStoreService } from '../data-access/deal-store.service';
import { Deal, DealFilters, EMPTY_DEAL_FILTERS } from '../data-access/deal.model';
import { DealListComponent } from './deal-list.component';

interface DealListHarness {
  readonly filterForm: FormGroup;
  readonly filtersExpanded: WritableSignal<boolean>;
  readonly pendingDelete: WritableSignal<Deal | null>;
  readonly resetRequested: WritableSignal<boolean>;
  readonly viewModel$: DealListComponent['viewModel$'];
  hasActiveFilters(filters: DealFilters): boolean;
  hasPriceFilter(filters: DealFilters): boolean;
  clearFilters(): void;
  confirmDelete(): void;
  confirmReset(): void;
}

const harborDeal: Deal = {
  id: 'harbor-exchange',
  name: 'Harbor Exchange',
  address: '112 Water Street, Boston, MA',
  purchasePrice: 10_000_000,
  noi: 750_000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const turnaroundDeal: Deal = {
  ...harborDeal,
  id: 'turnaround',
  name: 'Turnaround Center',
  purchasePrice: 5_000_000,
  noi: 100_000,
};

describe('DealListComponent', () => {
  const dealsSubject = new BehaviorSubject<readonly Deal[]>([harborDeal, turnaroundDeal]);
  const filteredDealsSubject = new BehaviorSubject<readonly Deal[]>([harborDeal, turnaroundDeal]);
  const filtersSubject = new BehaviorSubject<DealFilters>(EMPTY_DEAL_FILTERS);
  let fixture: ComponentFixture<DealListComponent>;
  let harness: DealListHarness;
  let notifications: { show: jest.Mock };
  let store: {
    readonly deals$: typeof dealsSubject;
    readonly filteredDeals$: typeof filteredDealsSubject;
    readonly filters$: typeof filtersSubject;
    filtersSnapshot: DealFilters;
    setFilters: jest.Mock;
    clearFilters: jest.Mock;
    delete: jest.Mock;
    reset: jest.Mock;
  };

  beforeEach(async () => {
    dealsSubject.next([harborDeal, turnaroundDeal]);
    filteredDealsSubject.next([harborDeal, turnaroundDeal]);
    filtersSubject.next(EMPTY_DEAL_FILTERS);
    notifications = { show: jest.fn() };
    store = {
      deals$: dealsSubject,
      filteredDeals$: filteredDealsSubject,
      filters$: filtersSubject,
      filtersSnapshot: EMPTY_DEAL_FILTERS,
      setFilters: jest.fn(),
      clearFilters: jest.fn(),
      delete: jest.fn(() => true),
      reset: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [DealListComponent],
      providers: [
        { provide: DealStoreService, useValue: store },
        { provide: NotificationService, useValue: notifications },
      ],
    })
      .overrideComponent(DealListComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(DealListComponent);
    harness = fixture.componentInstance as unknown as DealListHarness;
  });

  it('builds portfolio totals and typical-rate counts', async () => {
    const viewModel = await firstValueFrom(harness.viewModel$);

    expect(viewModel.totalPurchasePrice).toBe(15_000_000);
    expect(viewModel.typicalCount).toBe(1);
    expect(viewModel.filteredDeals).toHaveLength(2);
  });

  it('identifies active name and price filters', () => {
    expect(harness.hasActiveFilters(EMPTY_DEAL_FILTERS)).toBe(false);
    expect(harness.hasActiveFilters({ ...EMPTY_DEAL_FILTERS, name: 'harbor' })).toBe(true);
    expect(harness.hasPriceFilter({ ...EMPTY_DEAL_FILTERS, minimumPrice: 1 })).toBe(true);
    expect(harness.hasPriceFilter(EMPTY_DEAL_FILTERS)).toBe(false);
  });

  it('debounces valid filter updates', () => {
    jest.useFakeTimers();

    harness.filterForm.setValue({
      name: 'harbor',
      minimumPrice: 5_000_000,
      maximumPrice: 15_000_000,
    });
    jest.advanceTimersByTime(119);
    expect(store.setFilters).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(store.setFilters).toHaveBeenCalledWith({
      name: 'harbor',
      minimumPrice: 5_000_000,
      maximumPrice: 15_000_000,
    });
    jest.useRealTimers();
  });

  it('rejects an inverted purchase-price range', () => {
    jest.useFakeTimers();

    harness.filterForm.setValue({ name: '', minimumPrice: 20, maximumPrice: 10 });
    jest.advanceTimersByTime(120);

    expect(harness.filterForm.hasError('invalidPriceRange')).toBe(true);
    expect(store.setFilters).not.toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('clears filters in the form and store', () => {
    harness.filterForm.setValue({ name: 'harbor', minimumPrice: 1, maximumPrice: 2 });

    harness.clearFilters();

    expect(harness.filterForm.getRawValue()).toEqual(EMPTY_DEAL_FILTERS);
    expect(store.clearFilters).toHaveBeenCalledTimes(1);
  });

  it('deletes the pending deal and reports success', () => {
    harness.pendingDelete.set(harborDeal);

    harness.confirmDelete();

    expect(store.delete).toHaveBeenCalledWith(harborDeal.id);
    expect(notifications.show).toHaveBeenCalledWith('Harbor Exchange was deleted.');
    expect(harness.pendingDelete()).toBeNull();
  });

  it('does not report deletion when nothing was removed', () => {
    store.delete.mockReturnValue(false);
    harness.pendingDelete.set(harborDeal);

    harness.confirmDelete();
    harness.confirmDelete();

    expect(notifications.show).not.toHaveBeenCalled();
    expect(harness.pendingDelete()).toBeNull();
  });

  it('restores sample data and resets the controls', () => {
    harness.filterForm.setValue({ name: 'harbor', minimumPrice: 1, maximumPrice: 2 });
    harness.resetRequested.set(true);

    harness.confirmReset();

    expect(store.reset).toHaveBeenCalledTimes(1);
    expect(harness.filterForm.getRawValue()).toEqual(EMPTY_DEAL_FILTERS);
    expect(harness.resetRequested()).toBe(false);
    expect(notifications.show).toHaveBeenCalledWith(
      'The original sample deals have been restored.',
      'info',
    );
  });
});
