import { ResourceMeta, DigitalResource, ILibraryResource, ResourceType  } from "../Resources";

export { Book }

class Book implements ILibraryResource {
    _id: string = "";
    resourceType: ResourceType = ResourceType.Book;
    title: string = "";
    digital : boolean = false;
    subTitle: string = "";
    authors: string[] = [];
    editors: string[] = [];
    description: string = "";
    category: string = "";
    isbn: string = "";
    publication: string = "";
    publicationLocation: string = "";
    publicationYear: string = "";
    resume: string = "";
    remark: string = "";
    saveCipher: string = "";
    resourceMeta?: ResourceMeta;
    digitalResouce?: DigitalResource;
}
