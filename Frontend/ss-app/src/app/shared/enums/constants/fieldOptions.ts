export enum FieldOptions {
    CHANNELS_COMMUNICATION = 100,
    SERVICE_MODALITY = 2,
    SERVICES = 3,
    TYPES_OF_SERVICES = 300,
    I_ATTEND_TO = 200,
    DEPARTURES = 6,
    ORAL_SEX = 7
}

export const SERVICE_CATEGORY_RANGES = {
    TYPE_OF_SERVICES: { min: 310, max: 312, label: 'Type of Services' },
    I_ATTEND_TO: { min: 313, max: 320, label: 'I attend to' },
} as const;

export const OTHERS_CATEGORY_LABEL = 'Others';