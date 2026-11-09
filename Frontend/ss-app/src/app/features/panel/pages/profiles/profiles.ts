import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ProfileStatusChip } from '../../components/profile-status-chip/profile-status-chip';
import { computeCompletion } from '../../constants/completion-weights';
import { ProfileStateService } from '../../data-access/profile-state.service';
import { Profile, ProfileStatus } from '../../models/profile.model';

interface ProfileRow {
  profile: Profile;
  completion: number;
  photoCount: number;
}

@Component({
  selector: 'app-panel-profiles',
  imports: [MatButtonModule, MatIconModule, ProfileStatusChip, RouterLink],
  templateUrl: './profiles.html',
  styleUrls: ['../../styles/panel-page.css', './profiles.css'],
})
export class Profiles {
  private readonly state = inject(ProfileStateService);

  readonly isAgency = this.state.isAgency;
  readonly canAddProfile = this.state.canAddProfile;
  readonly maxProfiles = computed(() => this.state.account()?.maxProfiles ?? 1);

  readonly rows = computed<ProfileRow[]>(() =>
    this.state.profiles().map((profile) => ({
      profile,
      completion: computeCompletion(profile).percent,
      photoCount: profile.photos.length,
    })),
  );

  readonly profileStatus = ProfileStatus;

  pause(row: ProfileRow): void {
    const nextStatus = row.profile.status === ProfileStatus.PAUSED
      ? ProfileStatus.ACTIVE
      : ProfileStatus.PAUSED;
    this.state.selectProfile(row.profile.id);
    void this.state.setStatus(nextStatus);
  }
}
