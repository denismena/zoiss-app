import { arhitectiDTO } from "src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model";
import { clientiDTO } from "src/app/nomenclatoare/clienti/clienti-item/clienti.model";

export interface comenziDTO{
    id: number;
    numar: number;
    data: Date;
    clientId: number;
    preselectClient: clientiDTO;
    arhitectId: number;
    preselectArhitect: arhitectiDTO;
    utilizatorId: number;
    utilizator: string;
    avans: number;
    conditiiPlata: string;
    termenLivrare: Date;
    comenziProduse: produseComandaDTO[];
}

export interface comenziCreationDTO{
    numar: number;
    data: Date;
    clientId: number;
    arhitectId: number;    
    utilizatorId: number;    
    avans: number;
    conditiiPlata: string;
    termenLivrare: Date;
    comenziProduse: produseComandaDTO[];
}
export interface produseComandaDTO{    
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
}
export interface comenziPutGetDTO{
    comanda: comenziDTO;
    comenziProduses: produseComandaDTO[];
}