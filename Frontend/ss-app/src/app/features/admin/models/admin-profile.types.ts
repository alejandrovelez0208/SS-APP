export type {
  ApiGender,
  ApiOrientation,
  ProfileAccountType,
  ProfileState,
  ProfileVerification,
} from '@shared/models/profile-status.model';

export type AccountState = 'ACTIVE' | 'SUSPENDED';

export type PhotoVisibility = 'PUBLIC' | 'PRIVATE';

export type ModerationState = 'PENDING' | 'APPROVED' | 'REJECTED';
