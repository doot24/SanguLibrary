import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { RiderAddUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta } from "../../../interfaces/Resources";
import { Rider } from "../../../interfaces/Resources/Rider";

import { RiderSchema } from "../../../schemas/ResourceSchemas/Rider";

export { SaveRider, DeleteRider, UpdateRider, DuplicateRider }

function UpdateRider(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let storedRider: Rider | null = await RiderSchema.findOne({ _id: req.body._id });

            if (!storedRider) {
                reject("rider not found!");
                return;
            }

            let resource: RiderAddUpdateResource = JSON.parse(req.body.resource) as RiderAddUpdateResource;

            storedRider.title = resource.title;
            storedRider.subTitle = resource.subTitle;
            storedRider.author = resource.author;
            storedRider.saveCipher = resource.saveCipher;
            storedRider.remark = resource.remark;
            storedRider.resourceMeta.dateUpdated = Date.now();
            storedRider.resourceMeta.updatedBy = req.session.user._id.toString();

            await RiderSchema.findOneAndUpdate({ _id: req.body._id }, storedRider);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function DeleteRider(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let riderResult: Rider | null = await RiderSchema.findOneAndDelete({ _id: req.body._id });

            if (!riderResult) {
                reject("rider not found!");
                return;
            }

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function DuplicateRider(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let rider: Rider | null = await RiderSchema.findOne({ _id: req.body._id });

            if (!rider) {
                reject("rider not found!");
                return;
            }

            let newRider: Rider = new Rider(rider);
            newRider._id = randomUUID();
            await new RiderSchema(newRider).save();

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function SaveRider(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let resource: RiderAddUpdateResource = JSON.parse(req.body.resource) as RiderAddUpdateResource;

            let dbResource : Rider | null = await RiderSchema.findOne({saveCipher : resource.saveCipher});

            if(dbResource)
            {
                reject();
                return;
            }


            let rider: Rider = new Rider();
            rider._id = randomUUID();
            rider.resourceType = (ResourceType.Dissertation);
            rider.title = resource.title;
            rider.subTitle = resource.subTitle;
            rider.author = resource.author;
            rider.saveCipher = resource.saveCipher;
            rider.remark = resource.remark;

            let resourcemeta: ResourceMeta = new ResourceMeta();
            resourcemeta.dateAdded = Date.now();
            resourcemeta.dateUpdated = Date.now();
            resourcemeta.addedBy = req.session.user._id.toString();
            resourcemeta.updatedBy = req.session.user._id.toString();

            rider.resourceMeta = resourcemeta;

            await new RiderSchema(rider).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

