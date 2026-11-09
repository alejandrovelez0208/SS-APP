import {
  Account,
  AccountType,
  ChannelOption,
  DepartureOption,
  MockScenario,
  Profile,
  ProfileStatus,
  ServiceOption,
  VerificationStatus,
} from '../models/profile.model';

/**
 * Catálogos mock. Cuando exista el backend se reemplazan por los servicios reales.
 */
export const MOCK_SERVICES: ServiceOption[] = [
  { id: 1, group: 'Companionship', label: 'Dinner dates' },
  { id: 2, group: 'Companionship', label: 'Travel companion' },
  { id: 3, group: 'Companionship', label: 'Events & parties' },
  { id: 4, group: 'Wellness', label: 'Massage' },
  { id: 5, group: 'Wellness', label: 'Relaxing session' },
  { id: 6, group: 'Experience', label: 'Couples' },
  { id: 7, group: 'Experience', label: 'Role play' },
];

export const MOCK_DEPARTURES: DepartureOption[] = [
  { id: 1, city: 'Bogotá' },
  { id: 2, city: 'Cali' },
  { id: 3, city: 'Cartagena' },
  { id: 4, city: 'Medellín' },
  { id: 5, city: 'Santa Marta' },
  { id: 6, city: 'Pereira' },
];

export const MOCK_CHANNELS: ChannelOption[] = [
  { id: 1, label: 'WhatsApp' },
  { id: 2, label: 'Telegram' },
  { id: 3, label: 'Phone call' },
  { id: 4, label: 'Email' },
];

export const MOCK_HAIR_COLORS = ['Black', 'Brown', 'Blonde', 'Red', 'Auburn', 'Other'];

export const MOCK_GENDERS: { value: Profile['gender']; label: string }[] = [
  { value: 'FEMALE', label: 'Female' },
  { value: 'MALE', label: 'Male' },
  { value: 'NON_BINARY', label: 'Non-binary' },
  { value: 'OTHER', label: 'Other' },
];

export const MOCK_ORIENTATIONS: { value: Profile['orientation']; label: string }[] = [
  { value: 'HETEROSEXUAL', label: 'Heterosexual' },
  { value: 'HOMOSEXUAL', label: 'Homosexual' },
  { value: 'BISEXUAL', label: 'Bisexual' },
  { value: 'ASEXUAL', label: 'Asexual' },
  { value: 'PANSEXUAL', label: 'Pansexual' },
  { value: 'QUEER', label: 'Queer' },
  { value: 'QUESTIONING', label: 'Questioning' },
  { value: 'OTHER', label: 'Other' },
];

const ACCOUNT_ID = 'acc-1';

function baseProfile(overrides: Partial<Profile> & Pick<Profile, 'id' | 'profileName'>): Profile {
  return {
    accountId: ACCOUNT_ID,
    isPrimary: false,
    gender: 'FEMALE',
    age: 25,
    country: 'Colombia',
    city: 'Medellín',
    hairColor: 'Brown',
    heightCm: 168,
    weightKg: 58,
    orientation: 'HETEROSEXUAL',
    headline: '',
    aboutShort: '',
    aboutLong: '',
    bustCm: null,
    waistCm: null,
    hipsCm: null,
    phoneCountryCode: '+57',
    phoneNumber: '',
    channelIds: [],
    website: '',
    serviceIds: [],
    departureCities: [],
    basicRate: 0,
    currency: 'COP',
    availableAllDay: true,
    scheduleFrom: '09:00',
    scheduleTo: '21:00',
    photos: [],
    status: ProfileStatus.DRAFT,
    verificationStatus: VerificationStatus.PENDING,
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

function cover(id: string, isCover: boolean, sortOrder: number): Profile['photos'][number] {
  return { id, url: '', isCover, sortOrder };
}

/** Perfil de ejemplo para el escenario INDEPENDENT. */
function independentProfile(): Profile {
  return baseProfile({
    id: 'profile-1',
    profileName: 'Sofía',
    isPrimary: true,
    status: ProfileStatus.ACTIVE,
    phoneCountryCode: '+57',
    phoneNumber: '3001234567',
    channelIds: [1, 2],
    serviceIds: [1, 4],
    departureCities: ['Bogotá', 'Cartagena'],
    basicRate: 350000,
    availableAllDay: false,
    scheduleFrom: '10:00',
    scheduleTo: '22:00',
    photos: [
      cover('photo-1', true, 0),
      cover('photo-2', false, 1),
      cover('photo-3', false, 2),
    ],
  });
}

/** Perfiles de ejemplo para el escenario AGENCY. */
function agencyProfiles(): Profile[] {
  return [
    baseProfile({
      id: 'profile-1',
      profileName: 'Sofía',
      isPrimary: true,
      status: ProfileStatus.ACTIVE,
      phoneNumber: '3001234567',
      channelIds: [1],
      serviceIds: [1, 2, 4],
      departureCities: ['Bogotá'],
      basicRate: 350000,
      aboutShort: 'Warm and discreet companion for memorable evenings.',
      photos: [
        cover('photo-1', true, 0),
        cover('photo-2', false, 1),
        cover('photo-3', false, 2),
        cover('photo-4', false, 3),
      ],
    }),
    baseProfile({
      id: 'profile-2',
      profileName: 'Valeria',
      status: ProfileStatus.DRAFT,
      phoneNumber: '3019876543',
      serviceIds: [1],
      basicRate: 250000,
      photos: [cover('photo-5', true, 0)],
    }),
    baseProfile({
      id: 'profile-3',
      profileName: 'Camila',
      status: ProfileStatus.PAUSED,
      phoneNumber: '3025551234',
      channelIds: [2, 3],
      serviceIds: [2, 5],
      basicRate: 400000,
      photos: [
        cover('photo-6', true, 0),
        cover('photo-7', false, 1),
        cover('photo-8', false, 2),
      ],
    }),
  ];
}

export function buildMockAccount(scenario: MockScenario): Account {
  if (scenario === 'AGENCY') {
    return {
      id: ACCOUNT_ID,
      type: AccountType.AGENCY,
      userName: 'Studio Aurora',
      email: 'studio@aurora.com',
      maxProfiles: 10,
      verificationStatus: VerificationStatus.VERIFIED,
      profiles: agencyProfiles(),
    };
  }

  return {
    id: ACCOUNT_ID,
    type: AccountType.INDEPENDENT,
    userName: 'Sofía',
    email: 'sofia@example.com',
    maxProfiles: 1,
    verificationStatus: VerificationStatus.PENDING,
    profiles: [independentProfile()],
  };
}
