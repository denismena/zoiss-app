export interface produseDTO{
    id: number;
    nume: string;
    cod: string;
    umId: number;
    um: string;
    perCutie: number;
    pret: number;
    greutatePerUm: number;
    codVamal: string;
    poza: any;
    active: boolean;    
}

export interface produseCreationDTO{    
    nume: string;
    cod: string;
    umId: number;
    um: string;
    perCutie: number;
    pret: number;
    greutatePerUm: number;
    codVamal: string;
    poza: any;
    active: boolean; 
}

export interface produseOfertaDTO{    
    poza: string;
    id: number;
    produsId: number;
    produsNume: string;
    furnizorId: number;
    furnizorNume: string;
    umId: number;
    um: string;
    cantitate : number
    cutii: number;
    pretUm: number;
    valoare: number;
    codProdus: string;
    isInComanda: boolean;
    addToComanda: boolean;
}