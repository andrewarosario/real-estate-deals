import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capRate',
  standalone: true,
})
export class CapRatePipe implements PipeTransform {
  transform(value: number): string {
    if (!Number.isFinite(value)) {
      return '—';
    }

    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100);
  }
}
