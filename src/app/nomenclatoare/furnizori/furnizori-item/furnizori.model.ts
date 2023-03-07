export interface furnizoriDTO{
    id: number;
    nume: string;
    tara: string;
    oras: string;
    judet: string;
    adresa: string;
    tel: string;
    email: string;
    conditii: string;
    active: boolean;
    files: File[];
    fileNames: Record<number, string>[];
}

export interface furnizoriCreationDTO{
    nume: string;
    tara: string;
    oras: string;
    judet: string;
    adresa: string;
    tel: string;
    email: string;
    conditii: string;
    active: boolean;
    files: File[];
    fileNames: Record<number, string>[];    
}