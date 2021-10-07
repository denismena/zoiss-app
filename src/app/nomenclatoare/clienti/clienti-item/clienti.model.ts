export interface clientiDTO{
    id: number;
    nume: string;
    pfPj: string;
    cuicnp: string;
    registruComert: string;
    persoanaContact: string;
    persoanaContactTel: string;
    active: boolean;
    adrese: clientiAdresaDTO[];
}

export interface clientiCreationDTO{
    nume: string;
    pfPj: string;
    cuicnp: string;
    registruComert: string;
    persoanaContact: string;
    persoanaContactTel: string;
    active: boolean;
    adrese: clientiAdresaDTO[];
}
export interface clientiAdresaDTO{
    id: number;
    adresa: string;
    oras: string;
    tara: string;
    tel: string;
    email: string;
    sediu: boolean;
    livrare: boolean;
}
export interface clientiAdresaPutGetDTO{
    client: clientiDTO;
    adrese: clientiAdresaDTO[];
}