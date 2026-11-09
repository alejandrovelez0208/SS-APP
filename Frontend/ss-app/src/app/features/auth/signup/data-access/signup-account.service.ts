import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, of, switchMap, tap } from 'rxjs';
import { AuthApiService } from '@core/auth/auth-api.service';
import { AuthSessionService } from '@core/auth/auth-session.service';
import { AccountType } from '@core/auth/auth.models';
import { ProfileApiService, ProfileUpdatePayload } from '@shared/services/profiles/profile-api.service';
import { CatalogKey, SignupCatalogStateService } from './signup-catalog-state.service';

const SIGNUP_ACCOUNT_TYPE: Record<string, AccountType> = {
  escort: 'INDEPENDENT',
  agency: 'AGENCY',
};

/**
 * Crea la cuenta en el paso de credenciales y guarda el perfil de forma
 * progresiva. El usuario no ve el proceso: al pulsar "next" se persiste en
 * segundo plano y el flujo continúa.
 */
@Injectable({ providedIn: 'root' })
export class SignupAccountService {
  private readonly authApi = inject(AuthApiService);
  private readonly profileApi = inject(ProfileApiService);
  private readonly session = inject(AuthSessionService);
  private readonly catalogs = inject(SignupCatalogStateService);

  register(form: FormGroup, accountType: string): Observable<unknown> {
    if (this.session.getProfileId()) {
      return of(null);
    }

    const value = form.getRawValue();

    return this.authApi
      .signup({
        userName: value.userName,
        email: value.email?.trim().toLowerCase(),
        password: value.password,
        accountType: SIGNUP_ACCOUNT_TYPE[accountType] ?? 'INDEPENDENT',
      })
      .pipe(tap((response) => this.session.handleAuthSuccess(response)));
  }

  saveProgress(form: FormGroup): Observable<unknown> {
    if (!this.session.getProfileId()) {
      return of(null);
    }

    return this.profileApi.updateMe(this.buildPayload(form));
  }

  complete(form: FormGroup): Observable<unknown> {
    if (!this.session.getProfileId()) {
      return of(null);
    }

    return this.profileApi
      .updateMe(this.buildPayload(form))
      .pipe(switchMap(() => this.profileApi.completeMe()));
  }

  buildPayload(form: FormGroup): ProfileUpdatePayload {
    const value = form.getRawValue();

    return {
      profileName: value.nameCompanion?.trim(),
      gender: value.gender,
      age: value.age,
      hairColor: value.hairColor,
      heightCm: value.heightCm,
      weightKg: value.weight,
      orientation: value.orientation,
      country: this.countryName(value.nationality),
      city: value.baseCity,
      phoneCountryCode: value.interCodePhone,
      phoneNumber: value.phone,
      availableAllDay: value.availableAllDay,
      scheduleFrom: value.scheduleFrom,
      scheduleTo: value.scheduleTo,
      website: value.website,
      basicRate: value.basicRate,
      currency: 'COP',
      serviceIds: this.selectedIds(form, 'serviceType', 'typeOfServices'),
      departureIds: this.selectedIds(form, 'departures', 'departures'),
      channelIds: this.selectedIds(form, 'applications', 'channels'),
      modalityIds: this.selectedIds(form, 'serviceModality', 'modality'),
    };
  }

  private countryName(nationality: unknown): string | undefined {
    if (!nationality) {
      return undefined;
    }
    if (typeof nationality === 'string') {
      return nationality;
    }

    const names = (nationality as { names?: { common?: string } }).names;
    return names?.common;
  }

  private selectedIds(form: FormGroup, groupName: string, catalogKey: CatalogKey): number[] {
    const group = form.get(groupName);
    if (!(group instanceof FormGroup)) {
      return [];
    }

    const ids: number[] = [];
    this.catalogs.getFormulaMap(catalogKey).forEach((formula, code) => {
      if (group.get(formula)?.value === true) {
        ids.push(code);
      }
    });

    return ids;
  }
}
