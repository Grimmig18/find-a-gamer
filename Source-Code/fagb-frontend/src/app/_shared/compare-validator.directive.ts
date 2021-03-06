import { Directive } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, NG_VALIDATORS } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appCompareValidator]',
  providers: [{ provide: NG_VALIDATORS, useValue: CompareValidatorDirective, multi: true }]
})
export class CompareValidatorDirective {

  public constructor() { }

}

export function compareValidator(controlNameToCompare: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
  // return function(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null || control.value.lenght === 0) {
      return null;
    }
    const controlToCompare = control.root.get(controlNameToCompare);

    if (controlToCompare) {
      const subscription: Subscription = controlToCompare.valueChanges.subscribe(() => {
        control.updateValueAndValidity();
        subscription.unsubscribe();
      });
    }
    return (controlToCompare && (controlToCompare.value !== control.value)) ? { compare: true } : null;
    };
  }
