import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { CurrencyMaskDirective } from './currency-mask.directive';

@Component({
  standalone: true,
  imports: [CurrencyMaskDirective, ReactiveFormsModule],
  template: `
    <input
      appCurrencyMask
      [appCurrencyMaskAllowNegative]="allowNegative"
      [formControl]="control"
    >
  `,
})
class CurrencyMaskHostComponent {
  readonly control = new FormControl<number | null>(null);
  allowNegative = false;
}

describe('CurrencyMaskDirective', () => {
  let fixture: ComponentFixture<CurrencyMaskHostComponent>;
  let host: CurrencyMaskHostComponent;
  let input: HTMLInputElement;

  function enterValue(value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [CurrencyMaskHostComponent] });
    fixture = TestBed.createComponent(CurrencyMaskHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  });

  it('formats numeric form values with grouping and up to two decimals', () => {
    host.control.setValue(1_234_567.5);
    fixture.detectChanges();

    expect(input.value).toBe('1,234,567.5');
  });

  it('masks typed and pasted currency while keeping a numeric form value', () => {
    enterValue('$0012,345.678');

    expect(input.value).toBe('12,345.67');
    expect(host.control.value).toBe(12_345.67);
  });

  it('supports fractional values without a leading zero', () => {
    enterValue('.5');

    expect(input.value).toBe('0.5');
    expect(host.control.value).toBe(0.5);
  });

  it('allows negative values only when configured', () => {
    enterValue('-2500.5');
    expect(input.value).toBe('2,500.5');
    expect(host.control.value).toBe(2_500.5);

    host.allowNegative = true;
    fixture.detectChanges();
    enterValue('-2500.5');

    expect(input.value).toBe('-2,500.5');
    expect(host.control.value).toBe(-2_500.5);
  });

  it('clears incomplete values on blur and marks the control as touched', () => {
    host.allowNegative = true;
    fixture.detectChanges();
    enterValue('-');

    expect(input.value).toBe('-');
    expect(host.control.value).toBeNull();
    expect(host.control.touched).toBe(false);

    input.dispatchEvent(new Event('blur'));

    expect(input.value).toBe('');
    expect(host.control.touched).toBe(true);
  });

  it('reflects disabled state and ignores non-finite model values', () => {
    const directive = fixture.debugElement
      .query(By.directive(CurrencyMaskDirective))
      .injector.get(CurrencyMaskDirective);

    host.control.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);

    directive.writeValue(Number.POSITIVE_INFINITY);
    expect(input.value).toBe('');
  });

  it('returns null when typed digits exceed the numeric range', () => {
    enterValue('9'.repeat(400));

    expect(host.control.value).toBeNull();
  });
});
