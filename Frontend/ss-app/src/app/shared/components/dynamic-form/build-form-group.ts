import { FormControl, FormGroup, Validators } from "@angular/forms";
import { CampoConfig } from "./field-config.model";

export function buildFormGroup(campos: CampoConfig[]): FormGroup {
  const controls = Object.fromEntries(
    campos.map(c => [
      c.nombre,
      new FormControl(c.valor ?? '', {
        nonNullable: true,
        validators: c.requerido === false ? [] : [Validators.required],
      }),
    ])
  );
  return new FormGroup(controls);
}