import { ResourceMeta, DigitalResource, ILibraryResource, ResourceType  } from "../Resources";

export { Dissertation }

class Dissertation implements ILibraryResource {
    _id: string = "";
    digital: boolean = true;
    resourceType: ResourceType = ResourceType.Dissertation;
    resourceMeta?: ResourceMeta | undefined;
    digitalResouce?: DigitalResource | undefined;
    
    saveCipher : string = "";
    title : string = "";
    subTitle : string = "";
    professor : string = "";
    publicationYear : number = 0;

    constructor(dissertation?: Dissertation) {
        if (dissertation) {
            this._id = dissertation._id;
            this.digital = dissertation.digital;
            this.resourceType = dissertation.resourceType;
            this.resourceMeta = dissertation.resourceMeta;
            this.digitalResouce = dissertation.digitalResouce;
            this.saveCipher = dissertation.saveCipher;
            this.title = dissertation.title;
            this.subTitle = dissertation.subTitle;
            this.professor = dissertation.professor;
            this.publicationYear = dissertation.publicationYear;
        }
    }
}
