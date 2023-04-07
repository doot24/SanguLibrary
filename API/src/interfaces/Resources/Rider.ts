import { ResourceMeta, DigitalResource, ILibraryResource, ResourceType  } from "../Resources";

export { Rider }

class Rider implements ILibraryResource {
    _id: string = "";
    digital: boolean = true;
    resourceType: ResourceType = ResourceType.Rider;
    resourceMeta?: ResourceMeta | undefined;
    digitalResouce?: DigitalResource | undefined;
    
    saveCipher : string = "";
    title : string = "";
    subTitle : string = "";
    author : string = "";
    remark : string = "";
}
