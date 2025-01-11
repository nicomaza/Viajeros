import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const password = control.value;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const validLength = password && password.length >= 6;

    const valid = hasUpperCase && hasNumber && validLength;
    return valid ? null : { invalidPassword: true };
  };
}
