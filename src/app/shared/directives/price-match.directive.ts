import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appPriceMatch]',
  standalone: true,
  host: {
    '[class.price-match]': 'appPriceMatch',
  },
})
export class PriceMatchDirective {
  @Input() appPriceMatch = false;
}
