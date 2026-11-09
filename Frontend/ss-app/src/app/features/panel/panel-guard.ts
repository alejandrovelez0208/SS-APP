import { CanActivateFn } from '@angular/router';

/**
 * Guard provisional de la maqueta. Cuando exista backend se validará
 * sesión + tipo de cuenta antes de entrar al panel.
 */
export const panelGuard: CanActivateFn = () => true;
