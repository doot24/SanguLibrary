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

    constructor(book?: Book) {
        if (book) {
            this._id = book._id;
            this.resourceType = book.resourceType;
            this.title = book.title;
            this.digital = book.digital;
            this.subTitle = book.subTitle;
            this.authors = book.authors;
            this.editors = book.editors;
            this.description = book.description;
            this.category = book.category;
            this.isbn = book.isbn;
            this.publication = book.publication;
            this.publicationLocation = book.publicationLocation;
            this.publicationYear = book.publicationYear;
            this.resume = book.resume;
            this.remark = book.remark;
            this.saveCipher = book.saveCipher;
            this.resourceMeta = book.resourceMeta;
            this.digitalResouce = book.digitalResouce;
        }
    }
}
