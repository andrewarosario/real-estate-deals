import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { NotificationService } from '../../../core/notifications/notification.service';
import { CapRateRailComponent } from '../../../shared/components/cap-rate-rail/cap-rate-rail.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { PriceMatchDirective } from '../../../shared/directives/price-match.directive';
import { HighlightPipe } from '../../../shared/pipes/highlight.pipe';
import { DealStoreService } from '../data-access/deal-store.service';
import { Deal, DealFilters } from '../data-access/deal.model';
import { DealFiltersComponent } from '../deal-filters/deal-filters.component';
import { calculateCapRate, isTypicalCapRate } from '../domain/deal-rules';

@Component({
  selector: 'app-deal-list',
  standalone: true,
  imports: [
    AsyncPipe,
    CapRateRailComponent,
    ConfirmDialogComponent,
    CurrencyPipe,
    DealFiltersComponent,
    HighlightPipe,
    PriceMatchDirective,
    RouterLink,
  ],
  templateUrl: './deal-list.component.html',
  styleUrl: './deal-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealListComponent {
  private readonly notifications = inject(NotificationService);
  protected readonly store = inject(DealStoreService);

  protected readonly calculateCapRate = calculateCapRate;
  protected readonly pendingDelete = signal<Deal | null>(null);
  protected readonly resetRequested = signal(false);

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

  protected hasPriceFilter(filters: DealFilters): boolean {
    return filters.minimumPrice !== null || filters.maximumPrice !== null;
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
    this.resetRequested.set(false);
    this.notifications.show('The original sample deals have been restored.', 'info');
  }
}
