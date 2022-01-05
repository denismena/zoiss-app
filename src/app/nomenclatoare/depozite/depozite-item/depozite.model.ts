export interface depoziteDTO{
    id: number;
    nume: string;
    adresa: string;
    persoanaContact: string;    
    persoanaContactTel: string;
    persoanaContactEmail: string;
    parentId:number;
    parentDepozit:string;
    active: boolean;
}

export interface depoziteCreationDTO{
    id: number;
    nume: string;
    adresa: string;
    persoanaContact: string;    
    persoanaContactTel: string;
    persoanaContactEmail: string;
    parentId:number;
    active: boolean;
}