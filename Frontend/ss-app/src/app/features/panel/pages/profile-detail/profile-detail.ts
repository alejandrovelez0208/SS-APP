import { DecimalPipe, SlicePipe } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NotificationService } from '@shared/services/notification/notification.service';
import { ProfileStatusChip } from '../../components/profile-status-chip/profile-status-chip';
import {
  MOCK_CHANNELS,
  MOCK_DEPARTURES,
  MOCK_GENDERS,
  MOCK_HAIR_COLORS,
  MOCK_ORIENTATIONS,
  MOCK_SERVICES,
} from '../../constants/mock-account.data';
import { ProfileStateService } from '../../data-access/profile-state.service';
import {
  Profile,
  ProfileStatus,
  VerificationStatus,
} from '../../models/profile.model';

const TAB_BY_SECTION: Record<string, number> = {
  basics: 0,
  about: 1,
  photos: 2,
  rates: 3,
  services: 4,
  schedule: 5,
  departures: 6,
  contact: 7,
};

@Component({
  selector: 'app-panel-profile-detail',
  imports: [
    DecimalPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatTabsModule,
    ProfileStatusChip,
    ReactiveFormsModule,
    RouterLink,
    SlicePipe,
  ],
  templateUrl: './profile-detail.html',
  styleUrls: [
    '../../styles/panel-page.css',
    '../../styles/panel-material.css',
    './profile-detail.css',
  ],
})
export class ProfileDetail {
  private readonly state = inject(ProfileStateService);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);

  readonly profile = this.state.selectedProfile;
  readonly isAgency = this.state.isAgency;

  readonly genders = MOCK_GENDERS;
  readonly hairColors = MOCK_HAIR_COLORS;
  readonly orientations = MOCK_ORIENTATIONS;
  readonly services = MOCK_SERVICES;
  readonly serviceGroups = [...new Set(MOCK_SERVICES.map((service) => service.group))];
  readonly departures = MOCK_DEPARTURES;
  readonly channels = MOCK_CHANNELS;

  readonly activeTab = signal(0);
  readonly saving = signal(false);
  readonly profileStatus = ProfileStatus;
  readonly verificationStatus = VerificationStatus;

  form = new FormGroup({
    profileName: new FormControl('', { nonNullable: true }),
    gender: new FormControl<Profile['gender']>('FEMALE', { nonNullable: true }),
    age: new FormControl(25, { nonNullable: true }),
    hairColor: new FormControl('Brown', { nonNullable: true }),
    heightCm: new FormControl(168, { nonNullable: true }),
    weightKg: new FormControl(58, { nonNullable: true }),
    orientation: new FormControl<Profile['orientation']>('HETEROSEXUAL', {
      nonNullable: true,
    }),
    country: new FormControl('Colombia', { nonNullable: true }),
    city: new FormControl({ value: 'Medellín', disabled: true }, { nonNullable: true }),
    headline: new FormControl('', { nonNullable: true }),
    aboutShort: new FormControl('', { nonNullable: true }),
    aboutLong: new FormControl('', { nonNullable: true }),
    bustCm: new FormControl<number | null>(null),
    waistCm: new FormControl<number | null>(null),
    hipsCm: new FormControl<number | null>(null),
    phoneCountryCode: new FormControl('+57', { nonNullable: true }),
    phoneNumber: new FormControl('', { nonNullable: true }),
    website: new FormControl('', { nonNullable: true }),
    availableAllDay: new FormControl(true, { nonNullable: true }),
    scheduleFrom: new FormControl('09:00', { nonNullable: true }),
    scheduleTo: new FormControl('21:00', { nonNullable: true }),
    basicRate: new FormControl(0, { nonNullable: true }),
  });

  readonly servicesByGroup = computed(() =>
    this.serviceGroups.map((group) => ({
      group,
      items: this.services.filter((service) => service.group === group),
    })),
  );

  private lastBuiltId: string | null = null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.state.selectProfile(id);
      }
    });

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      const section = params.get('section') ?? 'basics';
      this.activeTab.set(TAB_BY_SECTION[section] ?? 0);
    });

    effect(() => {
      const profile = this.profile();
      if (profile && profile.id !== this.lastBuiltId) {
        this.lastBuiltId = profile.id;
        this.writeForm(profile);
      }
    });
  }

  get availableAllDay(): boolean {
    return this.form.controls.availableAllDay.value;
  }

  selectService(id: number, checked: boolean): void {
    const current = this.profile()?.serviceIds ?? [];
    this.patchServices(
      checked ? [...current, id] : current.filter((value) => value !== id),
    );
  }

  isServiceSelected(id: number): boolean {
    return this.profile()?.serviceIds.includes(id) ?? false;
  }

  selectChannel(id: number, checked: boolean): void {
    const current = this.profile()?.channelIds ?? [];
    this.patchChannels(
      checked ? [...current, id] : current.filter((value) => value !== id),
    );
  }

  isChannelSelected(id: number): boolean {
    return this.profile()?.channelIds.includes(id) ?? false;
  }

  selectDeparture(city: string, checked: boolean): void {
    const current = this.profile()?.departureCities ?? [];
    this.patchDepartures(
      checked ? [...current, city] : current.filter((value) => value !== city),
    );
  }

  isDepartureSelected(city: string): boolean {
    return this.profile()?.departureCities.includes(city) ?? false;
  }

  async save(): Promise<void> {
    const profile = this.profile();
    if (!profile) {
      return;
    }

    this.saving.set(true);
    try {
      const value = this.form.getRawValue();
      await this.state.updateProfile({
        profileName: value.profileName,
        gender: value.gender,
        age: value.age,
        hairColor: value.hairColor,
        heightCm: value.heightCm,
        weightKg: value.weightKg,
        orientation: value.orientation,
        country: value.country,
        city: value.city,
        headline: value.headline,
        aboutShort: value.aboutShort,
        aboutLong: value.aboutLong,
        bustCm: value.bustCm,
        waistCm: value.waistCm,
        hipsCm: value.hipsCm,
        phoneCountryCode: value.phoneCountryCode,
        phoneNumber: value.phoneNumber,
        website: value.website,
        availableAllDay: value.availableAllDay,
        scheduleFrom: value.scheduleFrom,
        scheduleTo: value.scheduleTo,
        basicRate: value.basicRate,
        serviceIds: profile.serviceIds,
        channelIds: profile.channelIds,
        departureCities: profile.departureCities,
      });
      this.notification.success('Profile saved.');
    } finally {
      this.saving.set(false);
    }
  }

  async togglePause(): Promise<void> {
    const profile = this.profile();
    if (!profile) {
      return;
    }
    const next =
      profile.status === ProfileStatus.PAUSED ? ProfileStatus.ACTIVE : ProfileStatus.PAUSED;
    await this.state.setStatus(next);
    this.notification.success(next === ProfileStatus.PAUSED ? 'Profile paused.' : 'Profile resumed.');
  }

  addPhoto(files: FileList | null): void {
    if (!files?.length) {
      return;
    }
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          void this.state.addPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(photoId: string): void {
    void this.state.removePhoto(photoId);
  }

  setCover(photoId: string): void {
    void this.state.setCover(photoId);
  }

  private writeForm(profile: Profile): void {
    this.form.patchValue({
      profileName: profile.profileName,
      gender: profile.gender,
      age: profile.age,
      hairColor: profile.hairColor,
      heightCm: profile.heightCm,
      weightKg: profile.weightKg,
      orientation: profile.orientation,
      country: profile.country,
      city: profile.city,
      headline: profile.headline,
      aboutShort: profile.aboutShort,
      aboutLong: profile.aboutLong,
      bustCm: profile.bustCm,
      waistCm: profile.waistCm,
      hipsCm: profile.hipsCm,
      phoneCountryCode: profile.phoneCountryCode,
      phoneNumber: profile.phoneNumber,
      website: profile.website,
      availableAllDay: profile.availableAllDay,
      scheduleFrom: profile.scheduleFrom,
      scheduleTo: profile.scheduleTo,
      basicRate: profile.basicRate,
    });
  }

  private patchServices(serviceIds: number[]): void {
    void this.state.updateProfile({ serviceIds });
  }

  private patchChannels(channelIds: number[]): void {
    void this.state.updateProfile({ channelIds });
  }

  private patchDepartures(departureCities: string[]): void {
    void this.state.updateProfile({ departureCities });
  }
}
