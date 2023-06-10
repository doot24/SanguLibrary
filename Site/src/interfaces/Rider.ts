import { ResourceMeta, ILibraryResource, ResourceType  } from "./Resources";

export { Rider }

class Rider implements ILibraryResource {
    _id: string = "";
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
