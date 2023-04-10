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
    coverURL: string = "";
    fileURL: string = "";
}

export { ILibraryResource, ResourceMeta, DigitalResource, ResourceType }