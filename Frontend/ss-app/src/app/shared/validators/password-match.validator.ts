import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordControlName: string): ValidatorFn {
  return (confirmControl: AbstractControl): ValidationErrors | null => {
    if (!confirmControl.parent) return null;

    const password = confirmControl.parent.get(passwordControlName)?.value;
    return password === confirmControl.value ? null : { passwordMismatch: true };
  };
}
