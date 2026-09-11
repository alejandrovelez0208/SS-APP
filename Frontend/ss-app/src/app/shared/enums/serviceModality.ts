export enum ServiceModality {
    OWN_LOCATION = 'own_location',
    HOTELS = 'hotels',
    CUSTOMER_ADDRESS = 'customer_address'
}

export interface ModalityOption {
    id: ServiceModality;
    displayName: string;
}

export const SERVICE_MODALITIES: ModalityOption[] = [
    { id: ServiceModality.OWN_LOCATION, displayName: 'I see clients at my own location.' },
    { id: ServiceModality.HOTELS, displayName: 'Hotels' },
    { id: ServiceModality.CUSTOMER_ADDRESS, displayName: "Customer's address" }
];