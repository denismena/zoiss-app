import { arhitectiDTO } from "src/app/nomenclatoare/arhitecti/arhitecti-item/arhitecti.model";
import { clientiDTO } from "src/app/nomenclatoare/clienti/clienti-item/clienti.model";
import { produseOfertaDTO } from "src/app/nomenclatoare/produse/produse-item/produse.model";

export interface oferteDTO{
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
    termenLivrare: string;
    comision: number;
    produseAll: number;
    produseProc: number;
    produseValoare:number;
    allComandate: boolean;//pentru a vedea cand sunt toate produsele selectate in oferta.
    produse: produseOfertaDTO[];
}

export interface oferteCreationDTO{
    numar: number;
    data: Date;
    clientId: number;
    arhitectId: number;    
    utilizatorId: string;    
    avans: number;
    conditiiPlata: string;
    termenLivrare: string;
    comision: number;
    produse: produseOfertaDTO[];
}

export interface ofertaPutGetDTO{
    oferta: oferteDTO;
    produse: produseOfertaDTO[];
}