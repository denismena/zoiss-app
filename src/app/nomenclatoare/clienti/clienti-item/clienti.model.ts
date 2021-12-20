export interface clientiDTO{
    id: number;
    nume: string;
    pfPj: string;
    cuicnp: string;
    registruComert: string;
    persoanaContact: string;
    persoanaContactTel: string;
    persoanaContactEmail: string;
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
    persoanaContactEmail: string;
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
    depozitId: number;
    depozit: string;
}
export interface clientiAdresaPutGetDTO{
    client: clientiDTO;
    adrese: clientiAdresaDTO[];
}