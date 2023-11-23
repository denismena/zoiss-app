export interface arhitectiComisionDTO{
    arhitectId: number;
    arhitect: string;
    valoare: number;
    cantitate: number;
    cantitatePlatita: number;
    existaNeplatite: boolean;
    selectAllSprePlata: boolean;
    comenzi: comandaArhitectiDTO[];
}

export interface comandaArhitectiDTO{
    id: number;
    numar: number;
    data: Date;
    client: string;
    produseComenziValoare: number;
    comision: number;
    arhitectPlatit: boolean;
    isInPlatit: boolean;    
    addToPlatit: boolean;
}