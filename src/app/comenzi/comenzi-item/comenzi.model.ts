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
    utilizatorId: string;
    utilizator: string;
    avans: number;
    conditiiPlata: string;
    termenLivrare: Date;
    clientAdresaId: number;
    platit: boolean;
    produseComenziAll: number;
    produseComenziProc: number;
    allComandate: boolean;//pentru a vedea cand sunt toate produsele selectate in oferta.
    comenziProduses: produseComandaDTO[];
}

export interface comenziCreationDTO{
    numar: number;
    data: Date;
    clientId: number;
    arhitectId: number;    
    utilizatorId: string;    
    avans: number;
    conditiiPlata: string;
    termenLivrare: Date;
    clientAdresaId: number;
    platit: boolean;
    comenziProduses: produseComandaDTO[];
}
export interface produseComandaDTO{    
    poza: string;
    id: number;
    oferteProdusId: number;
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
    discount: number;
    disponibilitate: Date;
    depozit: string;
    isInComandaFurnizor: boolean;    
    addToComandaFurnizor: boolean;
}
export interface comenziPutGetDTO{
    comanda: comenziDTO;
    comenziProduses: produseComandaDTO[];
}