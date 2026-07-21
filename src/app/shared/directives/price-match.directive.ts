import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[appPriceMatch]',
  standalone: true,
})
export class PriceMatchDirective {
  @HostBinding('class.price-match')
  @Input() appPriceMatch = false;
}
