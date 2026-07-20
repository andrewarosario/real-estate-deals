import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  const pipe = new HighlightPipe();

  it('segments every case-insensitive match without changing the source text', () => {
    expect(pipe.transform('Nice place, nice view', 'NICE')).toEqual([
      { text: 'Nice', match: true },
      { text: ' place, ', match: false },
      { text: 'nice', match: true },
      { text: ' view', match: false },
    ]);
  });

  it('returns plain text for an empty query', () => {
    expect(pipe.transform('Harbor Exchange', ' ')).toEqual([
      { text: 'Harbor Exchange', match: false },
    ]);
  });

  it('returns plain text when the query is not present', () => {
    expect(pipe.transform('Harbor Exchange', 'office')).toEqual([
      { text: 'Harbor Exchange', match: false },
    ]);
  });
});
