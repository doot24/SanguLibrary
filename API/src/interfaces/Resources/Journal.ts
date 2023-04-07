import { ResourceMeta, DigitalResource, ILibraryResource, ResourceType  } from "../Resources";

export { Journal }

class Journal implements ILibraryResource {
    _id: string = "";
    resourceType: ResourceType = ResourceType.Journal;
    title: string = "";
    digital : boolean = false;
    subTitle: string = "";
    authors: string[] = [];
    editors: string[] = [];
    collegues: string[] = [];
    description: string = "";
    number : number = 0;
    category: string = "";
    issn: string = "";
    publication: string = "";
    publicationLocation: string = "";
    publicationYear: string = "";
    resume: string = "";
    remark: string = "";
    saveCipher: string = "";
    resourceMeta?: ResourceMeta;
    digitalResouce?: DigitalResource;
}
