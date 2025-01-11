import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: boolean } | null => {
    const password = control.get('password');
    const passwordConfirm = control.get('passwordConfirm');
    return password && passwordConfirm && password.value !== passwordConfirm.value
      ? { 'passwordMismatch': true }
      : null;
  };
}
