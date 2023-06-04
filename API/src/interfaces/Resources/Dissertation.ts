import { ResourceMeta, DigitalResource, ILibraryResource, ResourceType  } from "../Resources";

export { Dissertation }

class Dissertation implements ILibraryResource {
    _id: string = "";
    digital: boolean = true;
    resourceType: ResourceType = ResourceType.Dissertation;
    resourceMeta?: ResourceMeta | undefined;
    digitalResource?: DigitalResource | undefined;
    
    saveCipher : string = "";
    title : string = "";
    subTitle : string = "";
    author : string = "";
    professor : string = "";
    publicationYear : number = 0;

    constructor(dissertation?: Dissertation) {
        if (dissertation) {
            this._id = dissertation._id;
            this.digital = dissertation.digital;
            this.resourceType = dissertation.resourceType;
            this.resourceMeta = dissertation.resourceMeta;
            this.digitalResource = dissertation.digitalResource;
            this.saveCipher = dissertation.saveCipher;
            this.title = dissertation.title;
            this.subTitle = dissertation.subTitle;
            this.author = dissertation.author;
            this.professor = dissertation.professor;
            this.publicationYear = dissertation.publicationYear;
        }
    }
}
