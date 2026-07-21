import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validPriceRange(control: AbstractControl): ValidationErrors | null {
  const minimum = control.get('minimumPrice')?.value as number | null;
  const maximum = control.get('maximumPrice')?.value as number | null;

  return minimum !== null && maximum !== null && minimum > maximum
    ? { invalidPriceRange: true }
    : null;
}
