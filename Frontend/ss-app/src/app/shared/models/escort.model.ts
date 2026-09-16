export interface NationalityName {
    common: string;
    official?: string;
}

export interface Nationality {
    names: NationalityName;
    code?: string;
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