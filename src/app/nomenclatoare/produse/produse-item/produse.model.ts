export interface produseDTO{
    id: number;
    nume: string;
    cod: string;
    um: string;
    perCutie: number;
    pret: number;
    greutatePerUm: number;
    codVamal: string;
    poza: string;
    active: boolean;    
}

export interface produseCreationDTO{    
    nume: string;
    cod: string;
    um: string;
    perCutie: number;
    pret: number;
    greutatePerUm: number;
    codVamal: string;
    poza: string;
    active: boolean; 
}

export interface produseOfertaDTO{    
    poza: string;
    id: number;
    produsId: number;
    produsNume: string;
    furnizorId: string;
    furnizorNume: string;
    um: string;
    cantitate : number
    cutii: number;
    pretUm: number;
    valoare: number;
}