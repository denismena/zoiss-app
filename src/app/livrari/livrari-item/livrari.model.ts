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
    livrariProduse: livrariProduseDTO[];
}

export interface livrariCreationDTO{    
    referinta: string;
    transportProduse: livrariProduseDTO[];
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
    transportProduseId: number;
    furnizor: string;
    livrat: boolean;    
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