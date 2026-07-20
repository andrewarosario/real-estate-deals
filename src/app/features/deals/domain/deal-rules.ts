import { Deal, DealFilters } from '../data-access/deal.model';

export const TYPICAL_CAP_RATE_MIN = 5;
export const TYPICAL_CAP_RATE_MAX = 12;

export function calculateCapRate(noi: number, purchasePrice: number): number {
  return purchasePrice > 0 ? (noi / purchasePrice) * 100 : Number.NaN;
}

export function isTypicalCapRate(rate: number): boolean {
  return rate >= TYPICAL_CAP_RATE_MIN && rate <= TYPICAL_CAP_RATE_MAX;
}

export function dealMatchesFilters(deal: Deal, filters: DealFilters): boolean {
  const normalizedName = filters.name.trim().toLocaleLowerCase('en-US');
  const nameMatches =
    normalizedName.length === 0 ||
    deal.name.toLocaleLowerCase('en-US').includes(normalizedName);
  const minimumMatches =
    filters.minimumPrice === null || deal.purchasePrice >= filters.minimumPrice;
  const maximumMatches =
    filters.maximumPrice === null || deal.purchasePrice <= filters.maximumPrice;

  return nameMatches && minimumMatches && maximumMatches;
}
