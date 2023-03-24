export function GetServerPort() : number {
    return Number(process.env.PORT);
}

export function IsProduction() : boolean {
    return process.env.ENV === "prod";
}

export function IsSecureSession() : boolean {
    return Number(process.env.SESSION_SECURE) ? true : false;
}

export function GetConnectionString() : string {
    return IsProduction()
    ? String(process.env.CONNECTION_PROD)
    : String(process.env.CONNECTION_DEV);
}