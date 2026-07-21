import { FormControl, FormGroup } from '@angular/forms';

import { validPriceRange } from './valid-price-range.validator';

describe('validPriceRange', () => {
  const form = new FormGroup({
    minimumPrice: new FormControl<number | null>(null),
    maximumPrice: new FormControl<number | null>(null),
  });

  it.each([
    [null, null],
    [10, null],
    [null, 20],
    [10, 10],
    [10, 20],
  ])('accepts minimum %s and maximum %s', (minimumPrice, maximumPrice) => {
    form.setValue({ minimumPrice, maximumPrice });

    expect(validPriceRange(form)).toBeNull();
  });

  it('rejects a minimum price greater than the maximum price', () => {
    form.setValue({ minimumPrice: 20, maximumPrice: 10 });

    expect(validPriceRange(form)).toEqual({ invalidPriceRange: true });
  });

  it('ignores controls that do not contain price fields', () => {
    expect(validPriceRange(new FormGroup({}))).toBeNull();
  });
});
