import { FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { CampoConfig } from "./field-config.model";

function validatorsFor(c: CampoConfig): ValidatorFn[] {
  const base = c.requerido === false ? [] : [Validators.required];
  return [...base, ...(c.validators ?? [])];
}

export function buildFormGroup(campos: CampoConfig[]): FormGroup {
  const controls = Object.fromEntries(
    campos.map(c => [
      c.nombre,
      new FormControl(c.valor ?? '', {
        nonNullable: true,
        validators: validatorsFor(c),
      }),
    ])
  );
  return new FormGroup(controls);
}