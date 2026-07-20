import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, shareReplay } from 'rxjs';

import { BrowserStorageService } from '../../../core/storage/browser-storage.service';
import { dealMatchesFilters } from '../domain/deal-rules';
import { Deal, DealDraft, DealFilters, EMPTY_DEAL_FILTERS } from './deal.model';
import { SEED_DEALS } from './seed-deals';

const DEAL_STORAGE_KEY = 'termsheet.deals.v1';

@Injectable({ providedIn: 'root' })
export class DealStoreService {
  private readonly storage = inject(BrowserStorageService);
  private readonly dealsSubject = new BehaviorSubject<readonly Deal[]>(this.restoreDeals());
  private readonly filtersSubject = new BehaviorSubject<DealFilters>(EMPTY_DEAL_FILTERS);

  readonly deals$ = this.dealsSubject.asObservable();
  readonly filters$ = this.filtersSubject.asObservable();
  readonly filteredDeals$ = combineLatest([this.deals$, this.filters$]).pipe(
    map(([deals, filters]) => deals.filter((deal) => dealMatchesFilters(deal, filters))),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  get dealsSnapshot(): readonly Deal[] {
    return this.dealsSubject.value;
  }

  get filtersSnapshot(): DealFilters {
    return this.filtersSubject.value;
  }

  setFilters(filters: DealFilters): void {
    this.filtersSubject.next({ ...filters, name: filters.name.trim() });
  }

  clearFilters(): void {
    this.filtersSubject.next(EMPTY_DEAL_FILTERS);
  }

  findById(id: string): Deal | undefined {
    return this.dealsSubject.value.find((deal) => deal.id === id);
  }

  add(draft: DealDraft): Deal {
    const now = new Date().toISOString();
    const deal: Deal = {
      ...this.normalizeDraft(draft),
      id: this.createId(),
      createdAt: now,
      updatedAt: now,
    };
    this.commit([deal, ...this.dealsSubject.value]);
    return deal;
  }

  update(id: string, draft: DealDraft): Deal | undefined {
    const existing = this.findById(id);
    if (!existing) {
      return undefined;
    }

    const updated: Deal = {
      ...existing,
      ...this.normalizeDraft(draft),
      updatedAt: new Date().toISOString(),
    };
    this.commit(this.dealsSubject.value.map((deal) => (deal.id === id ? updated : deal)));
    return updated;
  }

  delete(id: string): boolean {
    const remainingDeals = this.dealsSubject.value.filter((deal) => deal.id !== id);
    if (remainingDeals.length === this.dealsSubject.value.length) {
      return false;
    }
    this.commit(remainingDeals);
    return true;
  }

  reset(): void {
    this.commit(this.cloneSeedDeals());
    this.clearFilters();
  }

  private commit(deals: readonly Deal[]): void {
    const immutableDeals = deals.map((deal) => ({ ...deal }));
    this.dealsSubject.next(immutableDeals);
    this.storage.setLocal(DEAL_STORAGE_KEY, JSON.stringify(immutableDeals));
  }

  private restoreDeals(): readonly Deal[] {
    const saved = this.storage.getLocal(DEAL_STORAGE_KEY);
    if (!saved) {
      return this.cloneSeedDeals();
    }

    try {
      const value: unknown = JSON.parse(saved);
      return Array.isArray(value) && value.every((item) => this.isDeal(item))
        ? value.map((deal) => ({ ...deal }))
        : this.cloneSeedDeals();
    } catch {
      return this.cloneSeedDeals();
    }
  }

  private cloneSeedDeals(): Deal[] {
    return SEED_DEALS.map((deal) => ({ ...deal }));
  }

  private normalizeDraft(draft: DealDraft): DealDraft {
    return {
      name: draft.name.trim(),
      address: draft.address.trim(),
      purchasePrice: Number(draft.purchasePrice),
      noi: Number(draft.noi),
    };
  }

  private createId(): string {
    return globalThis.crypto?.randomUUID?.() ?? `deal-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private isDeal(value: unknown): value is Deal {
    if (!value || typeof value !== 'object') {
      return false;
    }

    const deal = value as Partial<Deal>;
    return (
      typeof deal.id === 'string' &&
      typeof deal.name === 'string' &&
      typeof deal.address === 'string' &&
      typeof deal.purchasePrice === 'number' &&
      Number.isFinite(deal.purchasePrice) &&
      deal.purchasePrice > 0 &&
      typeof deal.noi === 'number' &&
      Number.isFinite(deal.noi) &&
      typeof deal.createdAt === 'string' &&
      typeof deal.updatedAt === 'string'
    );
  }
}
