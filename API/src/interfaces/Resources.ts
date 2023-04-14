enum ResourceType { Book, Journal, Dissertation, Rider }

interface ILibraryResource {
    _id: string,
    digital : boolean
    resourceType: ResourceType
    resourceMeta?: ResourceMeta
    digitalResouce?: DigitalResource
}

class ResourceMeta {
    dateAdded: number = 0;
    dateUpdated: number = 0;
    updatedBy: string = "";
    addedBy: string = "";
}

class DigitalResource {
    coverURL: string = "https://firebasestorage.googleapis.com/v0/b/sangulibrary-d9533.appspot.com/o/public%2Fdefaultcover.png?alt=media&token=6071f8fe-e273-467f-81b4-ff98932fec47";
    fileURL: string = "";
}

export { ILibraryResource, ResourceMeta, DigitalResource, ResourceType }