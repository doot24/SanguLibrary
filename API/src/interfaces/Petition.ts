interface ISystemPetition
{
    system : boolean
}

export class PetitionTemplate {
    _id : String = ""
    title : String = ""
    text : String = ""
}

export class SystemPetitionTemplate implements ISystemPetition {
    system: boolean = true;
    _id : String = ""
    title : String = ""
    text : String = ""
}

export class Petition {
    _id: String = "";
    status: String = "";
    template: String = "";
    timestamp: Number = 0;
    owner: String = "";
    text: String = "";
    comment: String = "";
}
export class CheckoutPetition extends Petition implements ISystemPetition
{
    system : boolean = true;
    resource_type : number = 0;
    resource_id : string = "";
}