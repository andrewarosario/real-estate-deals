import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { combineLatest, debounceTime, map } from 'rxjs';

import { NotificationService } from '../../../core/notifications/notification.service';
import { CapRateRailComponent } from '../../../shared/components/cap-rate-rail/cap-rate-rail.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PriceMatchDirective } from '../../../shared/directives/price-match.directive';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import { DealStoreService } from '../data-access/deal-store.service';
import { Deal, DealFilters } from '../data-access/deal.model';
import { calculateCapRate, isTypicalCapRate } from '../domain/deal-rules';
import { validPriceRange } from './valid-price-range.validator';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CapRateRailComponent,
    ConfirmDialogComponent,
    CurrencyPipe,
    HighlightPipe,
    PriceMatchDirective,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealListComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly notifications = inject(NotificationService);
  protected readonly store = inject(DealStoreService);

  protected readonly calculateCapRate = calculateCapRate;
  protected readonly filtersExpanded = signal(false);
  protected readonly pendingDelete = signal<Deal | null>(null);
  protected readonly resetRequested = signal(false);
  protected readonly filterForm = this.formBuilder.group(
    {
      name: this.formBuilder.nonNullable.control(this.store.filtersSnapshot.name),
      minimumPrice: this.formBuilder.control<number | null>(
        this.store.filtersSnapshot.minimumPrice,
        Validators.min(0),
      ),
      maximumPrice: this.formBuilder.control<number | null>(
        this.store.filtersSnapshot.maximumPrice,
        Validators.min(0),
      ),
    },
    { validators: validPriceRange },
  );

  protected readonly viewModel$ = combineLatest([
    this.store.deals$,
    this.store.filteredDeals$,
    this.store.filters$,
  ]).pipe(
    map(([allDeals, filteredDeals, filters]) => ({
      allDeals,
      filteredDeals,
      filters,
      totalPurchasePrice: allDeals.reduce((total, deal) => total + deal.purchasePrice, 0),
      typicalCount: allDeals.filter((deal) => isTypicalCapRate(calculateCapRate(deal.noi, deal.purchasePrice)))
        .length,
    })),
  );

  constructor() {
    this.filterForm.valueChanges
      .pipe(debounceTime(120), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.filterForm.valid) {
          this.store.setFilters(this.readFilters());
        }
      });
  }

  protected hasActiveFilters(filters: DealFilters): boolean {
    return Boolean(filters.name || filters.minimumPrice !== null || filters.maximumPrice !== null);
  }

  protected hasPriceFilter(filters: DealFilters): boolean {
    return filters.minimumPrice !== null || filters.maximumPrice !== null;
  }

  protected clearFilters(): void {
    this.filterForm.reset({ name: '', minimumPrice: null, maximumPrice: null });
    this.store.clearFilters();
  }

  protected confirmDelete(): void {
    const deal = this.pendingDelete();
    if (deal && this.store.delete(deal.id)) {
      this.notifications.show(`${deal.name} was deleted.`);
    }
    this.pendingDelete.set(null);
  }

  protected confirmReset(): void {
    this.store.reset();
    this.filterForm.reset({ name: '', minimumPrice: null, maximumPrice: null });
    this.resetRequested.set(false);
    this.notifications.show('The original sample deals have been restored.', 'info');
  }

  private readFilters(): DealFilters {
    const value = this.filterForm.getRawValue();
    return {
      name: value.name,
      minimumPrice: value.minimumPrice,
      maximumPrice: value.maximumPrice,
    };
  }
}
