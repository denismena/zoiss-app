export interface transportatorDTO{
    id: number;
    nume: string;
    nrInmatriculare: string;
    adresa: string;
    tel: string;
    email: string;
    active: boolean;
}
export interface transportatorCreationDTO{    
    nume: string;
    nrInmatriculare: string;
    adresa: string;
    tel: string;
    email: string;
    active: boolean;
}