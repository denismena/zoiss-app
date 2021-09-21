export interface clientiDTO{
    id: number;
    nume: string;
    pfpj: number;
    cuicnp: string;
    registruComert: string;
    active: boolean;
}

export interface clientiCreationDTO{
    nume: string;
    pfpj: number;
    cuicnp: string;
    registruComert: string;
    active: boolean;
}
export interface clientiListDTO{
    id: number;
    nume: string;
    pfpj: string;
    cuicnp: string;
    registruComert: string;
    active: boolean;
}