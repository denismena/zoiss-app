import { produseComandaDTO } from "src/app/comenzi/comenzi-item/comenzi.model";
import { furnizoriDTO } from "src/app/nomenclatoare/furnizori/furnizori-item/furnizori.model";

export interface comenziFurnizorDTO{
    id: number;
    numar: number;
    data: Date;
    furnizorId: number;
    furnizor: string;
    preselectFurnizor: furnizoriDTO;    
    utilizatorId: string;
    utilizator: string;
    termenLivrare: string;
    produseComenziFurnizorAll: number;
    produseComenziFurnizorProc: number;
    allComandate: boolean;//pentru a vedea cand sunt toate produsele selectate in oferta.
    comenziFurnizoriProduse: produseComandaFurnizorDTO[];
}

export interface comenziFurnizorCreationDTO{
    id: number;
    numar: number;
    data: Date;
    furnizorId: number;
    comenziFurnizoriProduse: produseComandaFurnizorDTO[];
}

export interface produseComandaFurnizorDTO{    
    id: number;
    comenziProdusId: number;
    produsId: number;
    produsNume: string;    
    umId: number;
    um: string;
    cantitate : number
    cutii: number;
    pretUm: number;
    valoare: number;
    codProdus: string;
    disponibilitate: Date;    
    detalii: string;
    clientNume:string;
    isInTransport: boolean;    
    addToTransport: boolean;
}

export interface comenziFurnizoriPutGetDTO{
    comandaFurnizor: comenziFurnizorDTO;
    comenziFurnizoriProduse: produseComandaFurnizorDTO[];
}

export interface comenziFurnizorBasicDTO{
    id: number;
    numar: number;
    data: Date;    
}

export interface toExistingComenziFurnizoriDTO{
    comandaFurnizorId: number;
    comenziProduse: produseComandaDTO[];
}