import { Directive, ElementRef, HostListener, Input, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface MaskedCurrencyValue {
  readonly display: string;
  readonly value: number | null;
}

const currencyNumberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

@Directive({
  selector: 'input[appCurrencyMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CurrencyMaskDirective),
      multi: true,
    },
  ],
})
export class CurrencyMaskDirective implements ControlValueAccessor {
  private readonly element = inject(ElementRef<HTMLInputElement>);
  private onChange: ((value: number | null) => void) | undefined;
  private onTouched: (() => void) | undefined;

  @Input() appCurrencyMaskAllowNegative = false;

  writeValue(value: unknown): void {
    const numericValue = typeof value === 'number' && Number.isFinite(value) ? value : null;
    this.element.nativeElement.value =
      numericValue === null ? '' : currencyNumberFormatter.format(numericValue);
  }

  registerOnChange(callback: (value: number | null) => void): void {
    this.onChange = callback;
  }

  registerOnTouched(callback: () => void): void {
    this.onTouched = callback;
  }

  setDisabledState(disabled: boolean): void {
    this.element.nativeElement.disabled = disabled;
  }

  @HostListener('input')
  protected handleInput(): void {
    const maskedValue = this.maskValue(this.element.nativeElement.value);
    this.element.nativeElement.value = maskedValue.display;
    this.onChange?.(maskedValue.value);
  }

  @HostListener('blur')
  protected handleBlur(): void {
    const maskedValue = this.maskValue(this.element.nativeElement.value);
    this.element.nativeElement.value =
      maskedValue.value === null ? '' : currencyNumberFormatter.format(maskedValue.value);
    this.onTouched?.();
  }

  private maskValue(rawValue: string): MaskedCurrencyValue {
    const negative =
      this.appCurrencyMaskAllowNegative && rawValue.trimStart().startsWith('-');
    const unsignedValue = rawValue.replace(/[^\d.]/g, '');
    const [integerPart = '', ...fractionParts] = unsignedValue.split('.');
    const hasDecimal = unsignedValue.includes('.');
    const fractionPart = fractionParts.join('').slice(0, 2);

    if (!integerPart && !fractionPart) {
      return { display: negative ? '-' : '', value: null };
    }

    const normalizedInteger = (integerPart || '0').replace(/^0+(?=\d)/, '');
    const groupedInteger = normalizedInteger.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const sign = negative ? '-' : '';
    const display = `${sign}${groupedInteger}${hasDecimal ? `.${fractionPart}` : ''}`;
    const numericValue = Number(
      `${sign}${normalizedInteger}${fractionPart ? `.${fractionPart}` : ''}`,
    );

    return {
      display,
      value: Number.isFinite(numericValue) ? numericValue : null,
    };
  }
}
