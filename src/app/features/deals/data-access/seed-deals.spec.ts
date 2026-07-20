import { calculateCapRate } from '../domain/deal-rules';
import { SEED_DEALS } from './seed-deals';

describe('SEED_DEALS', () => {
  it('provides eight valid deals with stable unique identifiers', () => {
    expect(SEED_DEALS).toHaveLength(8);
    expect(new Set(SEED_DEALS.map((deal) => deal.id)).size).toBe(SEED_DEALS.length);

    for (const deal of SEED_DEALS) {
      expect(deal.name).not.toHaveLength(0);
      expect(deal.address).not.toHaveLength(0);
      expect(deal.purchasePrice).toBeGreaterThan(0);
      expect(Number.isFinite(deal.noi)).toBe(true);
      expect(Number.isNaN(Date.parse(deal.createdAt))).toBe(false);
      expect(Number.isNaN(Date.parse(deal.updatedAt))).toBe(false);
      expect(Number.isFinite(calculateCapRate(deal.noi, deal.purchasePrice))).toBe(true);
    }
  });

  it('is frozen so the sample collection cannot be reordered', () => {
    expect(Object.isFrozen(SEED_DEALS)).toBe(true);
  });
});
