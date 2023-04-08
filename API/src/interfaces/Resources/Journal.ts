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
    remark: string = "";
    saveCipher: string = "";
    resourceMeta?: ResourceMeta;
    digitalResouce?: DigitalResource;

    constructor(journal?: Journal) {
        if (journal) {
            this._id = journal._id;
            this.resourceType = journal.resourceType;
            this.title = journal.title;
            this.digital = journal.digital;
            this.subTitle = journal.subTitle;
            this.authors = journal.authors;
            this.editors = journal.editors;
            this.collegues = journal.collegues;
            this.description = journal.description;
            this.number = journal.number;
            this.category = journal.category;
            this.issn = journal.issn;
            this.publication = journal.publication;
            this.publicationLocation = journal.publicationLocation;
            this.publicationYear = journal.publicationYear;
            this.remark = journal.remark;
            this.saveCipher = journal.saveCipher;
            this.resourceMeta = journal.resourceMeta;
            this.digitalResouce = journal.digitalResouce;
        }
    }

}
