export interface NationalityName {
    common: string;
    official?: string;
}
export interface Nationality {
    names: NationalityName;
    codes: {
        alpha_2: string;
    };
}
export interface InternationalCodePhone {
    calling_code: string;
    name?: string;
    code?: string;
}

export interface City {
    name: string;
    id?: number | string;
}
export interface ServiceItem {
    id: number;
    code: number;
    description: string;
}
