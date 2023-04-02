export class PetitionTemplate {
    _id : String = ""
    title : String = ""
    text : String = ""
}

export class Petition {
    _id: String = "";
    status: String = "";
    template: String = "";
    timestamp: number = 0;
    owner: String = "";
    text: String = "";
    usedtemplate : PetitionTemplate[] = [];
    comment: String = "";
}