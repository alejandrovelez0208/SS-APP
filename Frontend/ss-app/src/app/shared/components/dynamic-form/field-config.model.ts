interface BaseField {
  nombre: string;
  etiqueta: string;
  valor?: unknown;
  requerido?: boolean;
}

export interface TextFieldConfig extends BaseField {
  tipo: 'text' | 'number' | 'email';
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