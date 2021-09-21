export interface furnizoriDTO{
    id: number;
    nume: string;
    tara: string;
    adresa: string;
    tel: string;
    email: string;
    active: boolean;
}

export interface furnizoriCreationDTO{
    nume: string;
    tara: string;
    adresa: string;
    tel: string;
    email: string;
    active: boolean;
}