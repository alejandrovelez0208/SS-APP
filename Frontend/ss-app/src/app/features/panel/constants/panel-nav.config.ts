import { AccountType } from '../models/profile.model';

export interface PanelNavItem {
  label: string;
  route: string;
  icon: string;
}

const overview: PanelNavItem = { label: 'Overview', route: 'overview', icon: 'dashboard' };
const settings: PanelNavItem = { label: 'Settings', route: 'settings', icon: 'settings' };

export function navFor(type: AccountType | undefined): PanelNavItem[] {
  if (type === AccountType.AGENCY) {
    return [
      overview,
      { label: 'My Profiles', route: 'profiles', icon: 'group' },
      settings,
    ];
  }

  return [
    overview,
    { label: 'My Profile', route: 'profiles', icon: 'person' },
    settings,
  ];
}
