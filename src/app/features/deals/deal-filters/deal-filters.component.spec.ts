import { WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';

import { DealFilters, EMPTY_DEAL_FILTERS } from '../data-access/deal.model';
import { DealFiltersComponent } from './deal-filters.component';

interface DealFiltersHarness {
  readonly filterForm: FormGroup;
  readonly filtersExpanded: WritableSignal<boolean>;
  readonly hasActiveFilters: boolean;
  clearFilters(): void;
}

describe('DealFiltersComponent', () => {
  let fixture: ComponentFixture<DealFiltersComponent>;
  let harness: DealFiltersHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DealFiltersComponent] }).compileComponents();
    fixture = TestBed.createComponent(DealFiltersComponent);
    harness = fixture.componentInstance as unknown as DealFiltersHarness;
    fixture.componentRef.setInput('filters', EMPTY_DEAL_FILTERS);
    fixture.componentRef.setInput('filteredCount', 8);
    fixture.componentRef.setInput('totalCount', 8);
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('synchronizes and summarizes the supplied filters', () => {
    const filters: DealFilters = {
      name: 'harbor',
      minimumPrice: 10_000_000,
      maximumPrice: 50_000_000,
    };
    fixture.componentRef.setInput('filters', filters);
    fixture.componentRef.setInput('filteredCount', 1);
    fixture.detectChanges();

    expect(harness.filterForm.getRawValue()).toEqual(filters);
    expect(harness.hasActiveFilters).toBe(true);
    expect(fixture.nativeElement.textContent).toContain('1 of 8 shown');
    expect(fixture.nativeElement.querySelector('.clear-filter')).not.toBeNull();
  });

  it('debounces valid filter changes before emitting them', () => {
    jest.useFakeTimers();
    const emitted: DealFilters[] = [];
    fixture.componentInstance.filtersChange.subscribe((filters) => emitted.push(filters));

    harness.filterForm.setValue({
      name: 'harbor',
      minimumPrice: 5_000_000,
      maximumPrice: 15_000_000,
    });
    jest.advanceTimersByTime(119);
    expect(emitted).toEqual([]);

    jest.advanceTimersByTime(1);
    expect(emitted).toEqual([
      { name: 'harbor', minimumPrice: 5_000_000, maximumPrice: 15_000_000 },
    ]);
  });

  it('does not emit an invalid purchase-price range', () => {
    jest.useFakeTimers();
    const emitted = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(emitted);

    harness.filterForm.setValue({ name: '', minimumPrice: 20, maximumPrice: 10 });
    jest.advanceTimersByTime(120);

    expect(harness.filterForm.hasError('invalidPriceRange')).toBe(true);
    expect(emitted).not.toHaveBeenCalled();
  });

  it('clears the form and emits empty filters', () => {
    const emitted = jest.fn();
    fixture.componentInstance.filtersChange.subscribe(emitted);
    fixture.componentRef.setInput('filters', {
      name: 'harbor',
      minimumPrice: null,
      maximumPrice: null,
    });
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('.clear-filter') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(harness.filterForm.getRawValue()).toEqual(EMPTY_DEAL_FILTERS);
    expect(harness.hasActiveFilters).toBe(false);
    expect(emitted).toHaveBeenCalledWith(EMPTY_DEAL_FILTERS);
    expect(fixture.nativeElement.querySelector('.clear-filter')).toBeNull();
  });

  it('toggles its compact filter panel', () => {
    const toggle = fixture.nativeElement.querySelector('.filter-toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();

    expect(harness.filtersExpanded()).toBe(true);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(toggle.textContent).toContain('Hide filters');
    expect(fixture.nativeElement.querySelector('.filter-workbench').classList).toContain(
      'filter-workbench--expanded',
    );
  });
});
