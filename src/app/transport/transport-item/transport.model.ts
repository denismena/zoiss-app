import { depoziteDTO } from "src/app/nomenclatoare/depozite/depozite-item/depozite.model";

export interface transportDTO{
    id: number;
    transportatorId: number;
    transportator: string;
    referinta: string;
    data: Date;
    adresa: string;
    detalii: string;
    transportProduse: transportProduseDTO;
}

export interface transportCreationDTO{
    transportatorId: number;    
    referinta: string;
    data: Date;
    adresa: string;
    detalii: string;
    transportProduse: transportProduseDTO;
}
export interface transportEditDTO{
    transportatorId: number;    
    referinta: string;
    data: Date;
    adresa: string;
    detalii: string;    
}
export interface transportProduseDTO{
    id: number;
    comenziFurnizoriProdusId: number;
    transportId: number;
    transport: string;
    livrat: boolean;
    transportProduseDepozit: transportProduseDepozitDTO[];
}

export interface transportPutGetDTO{
    transport: transportDTO;
    transportProduse: transportProduseDTO[];
    depoziteLista: depoziteDTO[];
}
export interface transportProduseDepozitDTO{
    id:number;
    transportProdusId:number;
    depozitId:number;
    data: Date;
    detalii:string;
    depozit:string;
}