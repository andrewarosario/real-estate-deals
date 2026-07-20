import { CapRatePipe } from './cap-rate.pipe';

describe('CapRatePipe', () => {
  const pipe = new CapRatePipe();

  it('formats rates as percentages with two decimals', () => {
    expect(pipe.transform(7.5)).toBe('7.50%');
    expect(pipe.transform(-2)).toBe('-2.00%');
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'renders non-finite value %s as unavailable',
    (value) => {
      expect(pipe.transform(value)).toBe('—');
    },
  );
});
