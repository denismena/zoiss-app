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
    facturaAvans: string;
    conditiiPlata: string;
    termenLivrare: string;
    conditiiLivrare:string;
    observatii: string;
    clientAdresaId: number;
    platit: boolean;
    arhitectPlatit: boolean;
    comision:number;
    produseComenziAll: number;
    produseComenziStoc: number;
    produseComenziProc: number;
    produseComenziValoare:number;
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
    facturaAvans: string;
    conditiiPlata: string;
    termenLivrare: string;
    conditiiLivrare:string;
    observatii: string;
    clientAdresaId: number;
    platit: boolean;
    arhitectPlatit: boolean;
    comision:number;
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
    isCategory: boolean;
    isStoc: boolean;
}
export interface comenziPutGetDTO{
    comanda: comenziDTO;
    comenziProduses: produseComandaDTO[];
}