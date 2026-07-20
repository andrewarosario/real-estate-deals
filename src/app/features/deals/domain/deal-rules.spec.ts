import { Deal, DealFilters } from '../data-access/deal.model';
import { calculateCapRate, dealMatchesFilters, isTypicalCapRate } from './deal-rules';

const deal: Deal = {
  id: 'test-deal',
  name: 'Very Nice Deal',
  address: '100 Market Street',
  purchasePrice: 10_000_000,
  noi: 750_000,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('Deal rules', () => {
  it('calculates Cap Rate as NOI divided by Purchase Price', () => {
    expect(calculateCapRate(750_000, 10_000_000)).toBe(7.5);
  });

  it('returns an undefined numeric result for a non-positive Purchase Price', () => {
    expect(Number.isNaN(calculateCapRate(100, 0))).toBeTrue();
  });

  it('treats the inclusive 5% to 12% band as typical', () => {
    expect(isTypicalCapRate(5)).toBeTrue();
    expect(isTypicalCapRate(12)).toBeTrue();
    expect(isTypicalCapRate(4.99)).toBeFalse();
    expect(isTypicalCapRate(12.01)).toBeFalse();
  });

  it('combines case-insensitive name and inclusive price filters', () => {
    const matchingFilters: DealFilters = {
      name: 'nice',
      minimumPrice: 10_000_000,
      maximumPrice: 10_000_000,
    };
    const failingFilters: DealFilters = {
      ...matchingFilters,
      minimumPrice: 10_000_001,
    };

    expect(dealMatchesFilters(deal, matchingFilters)).toBeTrue();
    expect(dealMatchesFilters(deal, failingFilters)).toBeFalse();
  });
});
