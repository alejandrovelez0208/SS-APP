export type GenderValue = 'MALE' | 'FEMALE' | 'NON_BINARY';

export interface GenderOption {
  value: GenderValue;
  label: string;
}

/**
 * Valores canónicos del enum `Gender` del backend, con etiquetas de UI.
 * Así el formulario guarda exactamente lo que espera la entidad Profile.
 */
export const GENDER_OPTIONS: readonly GenderOption[] = [
  { value: 'MALE', label: 'Man' },
  { value: 'FEMALE', label: 'Woman' },
  { value: 'NON_BINARY', label: 'Trans' },
];
