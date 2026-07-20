export interface Deal {
  readonly id: string;
  readonly name: string;
  readonly purchasePrice: number;
  readonly address: string;
  readonly noi: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type DealDraft = Pick<Deal, 'name' | 'purchasePrice' | 'address' | 'noi'>;

export interface DealFilters {
  readonly name: string;
  readonly minimumPrice: number | null;
  readonly maximumPrice: number | null;
}

export const EMPTY_DEAL_FILTERS: DealFilters = Object.freeze({
  name: '',
  minimumPrice: null,
  maximumPrice: null,
});
