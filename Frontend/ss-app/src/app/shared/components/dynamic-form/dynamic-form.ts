import { Component, input } from "@angular/core";
import { CampoConfig } from "./field-config.model";
import { FormControl, FormGroup } from "@angular/forms";
import { TextField } from "./fields/text-field/text-field";
import { SelectField } from "./fields/select-field/select-field";

@Component({
    selector: 'app-dynamic-form',
    imports: [TextField, SelectField],
    template: `
    @for (campo of campos(); track campo.nombre) {
      @switch (campo.tipo) {
        @case ('select') {
          <app-select-field [config]="campo" [control]="ctrl(campo.nombre)" />
        }
        @default {
          <app-text-field [config]="campo" [control]="ctrl(campo.nombre)" />
        }
      }
    }`,
})
export class DynamicForm {
    campos = input.required<CampoConfig[]>();
    form = input.required<FormGroup>();
    ctrl(nombre: string) { return this.form().get(nombre) as FormControl; }
}