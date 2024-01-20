export interface nirDTO{
    id: number;
    numar: number;
    data: Date;
    detalii: string;
    utilizator: string;
}

export interface nirCreationDTO{
    numar: number;
    data: Date;
    detalii: string;
    utilizator: string;
}

export interface nirPutGetDTO{
    nir: nirDTO;
    produse: produseNirDTO[];
}

export interface produseNirDTO{
    id: number;
    produsId: number;
    produsNume: string;
    codProdus: string;
    furnizorId: number;
    furnizorNume: string;
    umId: number;
    um: string;
    cantitate : number
}

export interface produseCreationNirDTO{
    id: number;
    produsId: number;
    produsNume: string;
    furnizorId: number;
    furnizorNume: string;
    umId: number;
    um: string;
    cantitate : number
}