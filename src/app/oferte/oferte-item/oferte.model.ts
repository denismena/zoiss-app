import { produseOfertaDTO } from "src/app/nomenclatoare/produse/produse-item/produse.model";

export interface oferteDTO{
    id: number;
    numar: number;
    data: Date;
    clientId: number;
    client: string;
    arhitectId: number;
    arhitect: string;
    utilizatorId: number;
    utilizator: string;
    avans: number;
    conditii_plata: string;
    termen_livrare: string;
    produse: produseOfertaDTO[];
}

export interface oferteCreationDTO{
    numar: number;
    data: Date;
    clientId: number;
    arhitectId: number;    
    utilizatorId: number;    
    avans: number;
    conditii_plata: string;
    termen_livrare: string;
    produse: produseOfertaDTO[];
}

export interface ofertaPutGetDTO{
    oferta: oferteDTO;
    produse: produseOfertaDTO[];
}