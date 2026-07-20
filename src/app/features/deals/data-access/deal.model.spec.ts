import { EMPTY_DEAL_FILTERS } from './deal.model';

describe('deal model defaults', () => {
  it('exposes an immutable empty filter value', () => {
    expect(EMPTY_DEAL_FILTERS).toEqual({
      name: '',
      minimumPrice: null,
      maximumPrice: null,
    });
    expect(Object.isFrozen(EMPTY_DEAL_FILTERS)).toBe(true);
  });
});
