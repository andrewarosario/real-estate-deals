import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceMatchDirective } from './price-match.directive';

@Component({
  standalone: true,
  imports: [PriceMatchDirective],
  template: '<span [appPriceMatch]="matches">$10,000,000</span>',
})
class PriceMatchHostComponent {
  matches = false;
}

describe('PriceMatchDirective', () => {
  let fixture: ComponentFixture<PriceMatchHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [PriceMatchHostComponent] });
    fixture = TestBed.createComponent(PriceMatchHostComponent);
  });

  it('toggles the matching-price class from its input', () => {
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('span') as HTMLSpanElement;
    expect(element.classList.contains('price-match')).toBe(false);

    fixture.componentInstance.matches = true;
    fixture.detectChanges();

    expect(element.classList.contains('price-match')).toBe(true);
  });
});
