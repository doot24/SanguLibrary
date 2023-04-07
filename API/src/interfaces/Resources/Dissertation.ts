import { ResourceMeta, DigitalResource, ILibraryResource, ResourceType  } from "../Resources";

export { Dissertation }

class Dissertation implements ILibraryResource {
    _id: string = "";
    digital: boolean = false;
    resourceType: ResourceType = ResourceType.Dissertation;
    resourceMeta?: ResourceMeta | undefined;
    digitalResouce?: DigitalResource | undefined;
    
    saveCipher : string = "";
    title : string = "";
    subTitle : string = "";
    professor : string = "";
    publicationYear : number = 0;
}
