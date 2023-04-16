export interface LivrariDTO{
    id: number;
    clientId: number;
    client: string;
    numar: string;
    data: Date;
    curier: string;
    receptionatDe: string;
    detalii: string;
    allLivrare: boolean;
    produseAll:number;
    produseLivrate:number;    
    livrariProduse: livrariProduseDTO[];
}

export interface livrariCreationDTO{        
    numar: string;
    data: Date;
    clientId: number;
    curier: string;
    receptionatDe: string;
    detalii: string;
    livrariProduse: livrariProduseDTO[];
}
export interface livrariEditDTO{
    clientId: number;    
    numar: string;
    data: Date;
    curier: string;
    receptionatDe: string;
    detalii: string; 
    livrariProduse: livrariProduseDTO[];   
}
export interface livrariProduseDTO{
    id: number;
    livrariId: number;
    transportProduseId: number|null;
    comenziProdusId: number;
    furnizor: string;
    livrat: boolean; 
    produsNume: string;
    um: string;
    cantitate: number;
    cutii: number;
    clientId: number;
}

export interface livrariPutGetDTO{
    livrare: LivrariDTO;
    livrareProduse: livrariProduseDTO[];
    //depoziteLista: depoziteDTO[];
}
export interface transportProduseDepozitDTO{
    id:number;
    transportProdusId:number;
    depozitId:number;
    data: Date;
    detalii:string;
    depozit:string;
}
// export interface transportProduseDepozitAllDTO{
//     transportId:number;
//     data: Date;
//     detalii:string;
//     depozit:string;
//     overwriteAll: boolean;
// }