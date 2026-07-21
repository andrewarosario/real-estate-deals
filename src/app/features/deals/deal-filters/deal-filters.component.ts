import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs';

import { CurrencyMaskDirective } from '../../../shared/directives/currency-mask.directive';
import { DealFilters, EMPTY_DEAL_FILTERS } from '../data-access/deal.model';
import { validPriceRange } from './valid-price-range.validator';

@Component({
  selector: 'app-deal-filters',
  standalone: true,
  imports: [CurrencyMaskDirective, ReactiveFormsModule],
  templateUrl: './deal-filters.component.html',
  styleUrl: './deal-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFiltersComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly formBuilder = inject(FormBuilder);

  @Input({ required: true }) filteredCount = 0;
  @Input({ required: true }) totalCount = 0;
  @Input({ required: true }) set filters(filters: DealFilters) {
    this.filterForm.reset(filters, { emitEvent: false });
  }

  @Output() readonly filtersChange = new EventEmitter<DealFilters>();

  protected readonly filtersExpanded = signal(false);
  protected readonly filterForm = this.formBuilder.group(
    {
      name: this.formBuilder.nonNullable.control(''),
      minimumPrice: this.formBuilder.control<number | null>(null, Validators.min(0)),
      maximumPrice: this.formBuilder.control<number | null>(null, Validators.min(0)),
    },
    { validators: validPriceRange },
  );

  constructor() {
    this.filterForm.valueChanges
      .pipe(debounceTime(120), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.filterForm.valid) {
          this.filtersChange.emit(this.readFilters());
        }
      });
  }

  protected get hasActiveFilters(): boolean {
    const filters = this.filterForm.getRawValue();
    return Boolean(
      filters.name || filters.minimumPrice !== null || filters.maximumPrice !== null,
    );
  }

  protected clearFilters(): void {
    this.filterForm.reset(EMPTY_DEAL_FILTERS, { emitEvent: false });
    this.filtersChange.emit(EMPTY_DEAL_FILTERS);
  }

  private readFilters(): DealFilters {
    const filters = this.filterForm.getRawValue();
    return {
      name: filters.name,
      minimumPrice: filters.minimumPrice,
      maximumPrice: filters.maximumPrice,
    };
  }
}
