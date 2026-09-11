export enum CommunicationChannel {
    WHATSAPP = 'whatsapp',
    TELEGRAM = 'telegram'
}

export interface ChannelOption {
    id: CommunicationChannel;
    displayName: string;
}

export const COMMUNICATION_CHANNELS: ChannelOption[] = [
    { id: CommunicationChannel.WHATSAPP, displayName: 'WhatsApp' },
    { id: CommunicationChannel.TELEGRAM, displayName: 'Telegram' }
];