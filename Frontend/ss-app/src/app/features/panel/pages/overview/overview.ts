import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CompletionCard } from '../../components/completion-card/completion-card';
import { ProfileStatusChip } from '../../components/profile-status-chip/profile-status-chip';
import { ProfileStateService } from '../../data-access/profile-state.service';

interface SectionLink {
  key: string;
  label: string;
  icon: string;
  section: string;
}

const SECTION_LINKS: SectionLink[] = [
  { key: 'identity', label: 'Identity', icon: 'badge', section: 'basics' },
  { key: 'about', label: 'About', icon: 'notes', section: 'about' },
  { key: 'photos', label: 'Photos', icon: 'photo_library', section: 'photos' },
  { key: 'rates', label: 'Rates', icon: 'payments', section: 'rates' },
  { key: 'services', label: 'Services', icon: 'room_service', section: 'services' },
  { key: 'schedule', label: 'Schedule', icon: 'schedule', section: 'schedule' },
  { key: 'contact', label: 'Contact', icon: 'contact_phone', section: 'contact' },
];

@Component({
  selector: 'app-panel-overview',
  imports: [CompletionCard, MatButtonModule, MatIconModule, ProfileStatusChip, RouterLink],
  templateUrl: './overview.html',
  styleUrls: ['../../styles/panel-page.css', './overview.css'],
})
export class Overview {
  private readonly state = inject(ProfileStateService);

  readonly account = this.state.account;
  readonly profile = this.state.selectedProfile;
  readonly completion = this.state.completion;
  readonly isAgency = this.state.isAgency;
  readonly canAddProfile = this.state.canAddProfile;
  readonly sections = SECTION_LINKS;

  readonly sectionState = computed(() => {
    const completion = this.completion();
    return SECTION_LINKS.map((section) => {
      const item = completion.sections.find((entry) => entry.key === section.key);
      return { ...section, complete: item?.complete ?? false, hint: item?.hint ?? '' };
    });
  });

  readonly firstName = computed(() => this.account()?.userName ?? 'there');
}
