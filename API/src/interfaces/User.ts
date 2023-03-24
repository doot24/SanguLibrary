export interface IUser {
    userid : String,
    firstName : String,
    lastName : String,
    roles : String[],
    email : String,
    photo : String,
    publicNumber : String,
    phoneNumber : String
}

export class User implements IUser {
    userid : String = "";
    firstName : String = "";
    lastName : String = "";
    roles : String[] = [];
    email : String = "";
    photo : String = "";
    publicNumber : String = "";
    phoneNumber : String = "";
}