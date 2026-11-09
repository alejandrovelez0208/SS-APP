import { Profile } from '../models/profile.model';

export interface CompletionSection {
  key: string;
  label: string;
  weight: number;
  complete: boolean;
  hint: string;
}

export interface CompletionResult {
  percent: number;
  sections: CompletionSection[];
  nextStep: CompletionSection | null;
}

/**
 * Pesos de la barra de completitud (suman 100).
 * "Recomendado" nunca bloquea guardar; solo alimenta la barra y el checklist.
 */
export function computeCompletion(profile: Profile | null): CompletionResult {
  if (!profile) {
    return { percent: 0, sections: [], nextStep: null };
  }

  const sections: CompletionSection[] = [
    {
      key: 'identity',
      label: 'Identity',
      weight: 20,
      complete:
        !!profile.profileName &&
        !!profile.gender &&
        profile.age >= 18 &&
        !!profile.city &&
        !!profile.country,
      hint: 'Add your name, gender, age and base city.',
    },
    {
      key: 'photos',
      label: 'Photos',
      weight: 20,
      complete: profile.photos.length >= 3,
      hint: `Upload at least 3 photos (${profile.photos.length}/3).`,
    },
    {
      key: 'about',
      label: 'About',
      weight: 15,
      complete: !!profile.aboutShort && !!profile.aboutLong,
      hint: 'Write a short headline and a longer description.',
    },
    {
      key: 'rates',
      label: 'Rates',
      weight: 15,
      complete: profile.basicRate > 0,
      hint: 'Set your basic rate.',
    },
    {
      key: 'services',
      label: 'Services',
      weight: 10,
      complete: profile.serviceIds.length >= 1,
      hint: 'Choose at least one service you offer.',
    },
    {
      key: 'schedule',
      label: 'Schedule',
      weight: 10,
      complete:
        profile.availableAllDay || (!!profile.scheduleFrom && !!profile.scheduleTo),
      hint: 'Define your availability.',
    },
    {
      key: 'contact',
      label: 'Contact',
      weight: 10,
      complete: !!profile.phoneNumber && profile.channelIds.length >= 1,
      hint: 'Add a phone number and at least one contact channel.',
    },
  ];

  const percent = sections.reduce(
    (total, section) => (section.complete ? total + section.weight : total),
    0,
  );

  return {
    percent,
    sections,
    nextStep: sections.find((section) => !section.complete) ?? null,
  };
}
