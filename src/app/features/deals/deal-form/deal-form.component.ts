import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NotificationService } from '../../../core/notifications/notification.service';
import { CapRateRailComponent } from '../../../shared/components/cap-rate-rail/cap-rate-rail.component';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';
import { CurrencyMaskDirective } from '../../../shared/directives/currency-mask.directive';
import { DealStoreService } from '../data-access/deal-store.service';
import { Deal, DealDraft } from '../data-access/deal.model';
import { calculateCapRate, isTypicalCapRate } from '../domain/deal-rules';

@Component({
  selector: 'app-deal-form',
  standalone: true,
  imports: [
    AutofocusDirective,
    CapRateRailComponent,
    CurrencyMaskDirective,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './deal-form.component.html',
  styleUrl: './deal-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DealFormComponent {
  private readonly document = inject(DOCUMENT);
  private readonly formBuilder = inject(FormBuilder);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(DealStoreService);

  protected readonly editingDeal = signal<Deal | null>(null);
  protected readonly form = this.formBuilder.group({
    name: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(80),
    ]),
    address: this.formBuilder.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(160),
    ]),
    purchasePrice: this.formBuilder.control<number | null>(null, [
      Validators.required,
      Validators.min(0.01),
    ]),
    noi: this.formBuilder.control<number | null>(null, [Validators.required]),
  });

  constructor() {
    const dealId = this.route.snapshot.paramMap.get('id');
    if (!dealId) {
      return;
    }

    const deal = this.store.findById(dealId);
    if (!deal) {
      this.notifications.show('That deal could not be found.', 'info');
      void this.router.navigate(['/deals']);
      return;
    }

    this.editingDeal.set(deal);
    this.form.setValue({
      name: deal.name,
      address: deal.address,
      purchasePrice: deal.purchasePrice,
      noi: deal.noi,
    });
  }

  protected get capRate(): number | null {
    const purchasePrice = this.form.controls.purchasePrice.value;
    const noi = this.form.controls.noi.value;
    return purchasePrice !== null && purchasePrice > 0 && noi !== null
      ? calculateCapRate(noi, purchasePrice)
      : null;
  }

  protected get capRateIsTypical(): boolean {
    return this.capRate !== null && isTypicalCapRate(this.capRate);
  }

  protected submit(destination: 'list' | 'another'): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const draft = this.readDraft();
    const editingDeal = this.editingDeal();

    if (editingDeal) {
      this.store.update(editingDeal.id, draft);
      this.notifications.show(`${draft.name} was updated.`);
      void this.router.navigate(['/deals']);
      return;
    }

    this.store.add(draft);
    this.notifications.show(`${draft.name} was added to the deal book.`);

    if (destination === 'another') {
      this.form.reset({ name: '', address: '', purchasePrice: null, noi: null });
      requestAnimationFrame(() => this.document.getElementById('deal-name')?.focus());
      return;
    }

    void this.router.navigate(['/deals']);
  }

  private readDraft(): DealDraft {
    const value = this.form.getRawValue();
    return {
      name: value.name,
      address: value.address,
      purchasePrice: Number(value.purchasePrice),
      noi: Number(value.noi),
    };
  }
}
