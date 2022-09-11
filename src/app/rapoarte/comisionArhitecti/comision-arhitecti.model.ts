import { comenziDTO } from "src/app/comenzi/comenzi-item/comenzi.model";

export interface arhitectiComisionDTO{
    arhitectId: number;
    arhitect: string;
    valoare: number;
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