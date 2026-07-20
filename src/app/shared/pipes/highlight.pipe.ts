import { Pipe, PipeTransform } from '@angular/core';

export interface HighlightSegment {
  readonly text: string;
  readonly match: boolean;
}

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  transform(value: string, query: string): readonly HighlightSegment[] {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      return [{ text: value, match: false }];
    }

    const segments: HighlightSegment[] = [];
    const source = value.toLocaleLowerCase('en-US');
    const search = normalizedQuery.toLocaleLowerCase('en-US');
    let cursor = 0;
    let matchIndex = source.indexOf(search, cursor);

    while (matchIndex !== -1) {
      if (matchIndex > cursor) {
        segments.push({ text: value.slice(cursor, matchIndex), match: false });
      }
      segments.push({ text: value.slice(matchIndex, matchIndex + search.length), match: true });
      cursor = matchIndex + search.length;
      matchIndex = source.indexOf(search, cursor);
    }

    if (cursor < value.length) {
      segments.push({ text: value.slice(cursor), match: false });
    }

    return segments.length > 0 ? segments : [{ text: value, match: false }];
  }
}
