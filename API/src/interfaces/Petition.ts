
export interface IPetition {
    _id : String,
    status : String,
    template : String,
    timestamp : Number,
    owner : String,
    text : String,
    comment : String
}
export interface IPetitionTemplate {
    _id : String,
    title : String,
    text : String
}

export class PetitionTemplate implements IPetitionTemplate {
    _id : String = ""
    title : String = ""
    text : String = ""
}

export class Petition implements IPetition {
    _id: String = "";
    status: String = "";
    template: String = "";
    timestamp: Number = 0;
    owner: String = "";
    text: String = "";
    comment: String = "";
}