import { ResourceMeta, ILibraryResource, ResourceType  } from "../Resources";

export { Rider }

class Rider implements ILibraryResource {
    _id: string = "";
    digital: boolean = true;
    resourceType: ResourceType = ResourceType.Rider;
    resourceMeta: ResourceMeta = new ResourceMeta();
    
    saveCipher : string = "";
    title : string = "";
    subTitle : string = "";
    author : string = "";
    remark : string = "";

    constructor(rider?: Rider) {
        if (rider) {
            this._id = rider._id;
            this.digital = rider.digital;
            this.resourceType = rider.resourceType;
            this.resourceMeta = rider.resourceMeta;
            this.saveCipher = rider.saveCipher;
            this.title = rider.title;
            this.subTitle = rider.subTitle;
            this.author = rider.author;
            this.remark = rider.remark;
        }
    }
}
