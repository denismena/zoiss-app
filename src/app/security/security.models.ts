export interface userCredentials{
    email: string;
    password: string;
}

export interface authentificationResponse{
    token: string;
    expiration: Date;
}