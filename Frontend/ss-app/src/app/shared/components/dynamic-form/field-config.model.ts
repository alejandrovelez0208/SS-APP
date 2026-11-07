import { ValidatorFn } from '@angular/forms';
interface BaseField {
  nombre: string;
  etiqueta: string;
  valor?: unknown;
  requerido?: boolean;
  validators?: ValidatorFn[];
}

export interface TextFieldConfig extends BaseField {
  tipo: 'text' | 'number' | 'email' | 'Field';
}

export interface SelectFieldConfig extends BaseField {
  tipo: 'select';
  opciones: readonly string[];
}

export type CampoConfig = TextFieldConfig | SelectFieldConfig;

export interface DialogData {
  titulo: string;
  campos: CampoConfig[];
}