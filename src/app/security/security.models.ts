export interface userCredentials{
    email: string;
    name: string;
    tel: string;
    password: string;
}

export interface authentificationResponse{
    token: string;
    expiration: Date;
}
export interface UtilizatoriDTO{
    id: string;
    email: string;
    name: string;
    phoneNumber: string;
    sucursalaId: number | null;
    sucursala: string;
}

export interface forgetPass{
    email: string;
}
export interface resetPass{
    token: string;
    email: string;
    newpassword: string;
    confirmpassword: string;
}

export interface confirmEmail{
    email: string;
    token: string;
}