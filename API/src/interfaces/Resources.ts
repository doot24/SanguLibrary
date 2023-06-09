enum ResourceType { Book, Journal, Dissertation, Rider }

interface ILibraryResource {
    _id: string,
    digital : boolean
    resourceType: ResourceType
    resourceMeta: ResourceMeta 
}

class ResourceMeta {
    dateAdded: number = 0;
    dateUpdated: number = 0;
    updatedBy: string = "";
    addedBy: string = "";
}

export { ILibraryResource, ResourceMeta, ResourceType }