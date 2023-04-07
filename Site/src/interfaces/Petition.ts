import { User } from "./User";

export class PetitionTemplate {
    _id : string = ""
    title : string = ""
    text : string = ""
}

export class Petition {
    _id: string = "";
    status: string = "";
    template: string = "";
    timestamp: number = 0;
    owner: string = "";
    text: string = "";
    usedtemplate : PetitionTemplate[] = [];
    user : User[] = [];
    comment: string = "";
}