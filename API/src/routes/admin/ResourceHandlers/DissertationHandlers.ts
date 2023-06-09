import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { DissertationAddUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta } from "../../../interfaces/Resources";
import { Dissertation } from "../../../interfaces/Resources/Dissertation";

import { DissertationSchema } from "../../../schemas/ResourceSchemas/Dissertation";

export { SaveDissertation, DeleteDissertation, UpdateDissertation, DuplicateDissertation }

function UpdateDissertation(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let storedDissertation: Dissertation | null = await DissertationSchema.findOne({ _id: req.body._id });

            if (!storedDissertation) {
                reject("dissertation not found!");
                return;
            }

            let resource: DissertationAddUpdateResource = JSON.parse(req.body.resource) as DissertationAddUpdateResource;

            storedDissertation.title = resource.title;
            storedDissertation.subTitle = resource.subTitle;
            storedDissertation.author = resource.author;
            storedDissertation.professor = resource.professor;
            storedDissertation.publicationYear = resource.publicationYear;
            storedDissertation.saveCipher = resource.saveCipher;
            storedDissertation.resourceMeta.dateUpdated = Date.now();
            storedDissertation.resourceMeta.updatedBy = req.session.user._id.toString();
            
            await DissertationSchema.findOneAndUpdate({ _id: req.body._id }, storedDissertation);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function DeleteDissertation(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let dissertationResult: Dissertation | null = await DissertationSchema.findOneAndDelete({ _id: req.body._id });

            if (!dissertationResult) {
                reject("dissertation not found!");
                return;
            }

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function DuplicateDissertation(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let dissertation: Dissertation | null = await DissertationSchema.findOne({ _id: req.body._id });

            if (!dissertation) {
                reject("dissertation not found!");
                return;
            }

            let newDissertation: Dissertation = new Dissertation(dissertation);
            newDissertation._id = randomUUID();
            await new DissertationSchema(newDissertation).save();

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function SaveDissertation(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let resource: DissertationAddUpdateResource = JSON.parse(req.body.resource) as DissertationAddUpdateResource;

            let dbResource: Dissertation | null = await DissertationSchema.findOne({ saveCipher: resource.saveCipher });

            if (dbResource) {
                reject();
                return;
            }

            let dissertation: Dissertation = new Dissertation();
            dissertation._id = randomUUID();
            dissertation.resourceType = (ResourceType.Dissertation);
            dissertation.title = resource.title;
            dissertation.subTitle = resource.subTitle;
            dissertation.author = resource.author;
            dissertation.professor = resource.professor;
            dissertation.digital = true;
            dissertation.publicationYear = resource.publicationYear;
            dissertation.saveCipher = resource.saveCipher;

            let resourcemeta: ResourceMeta = new ResourceMeta();
            resourcemeta.dateAdded = Date.now();
            resourcemeta.dateUpdated = Date.now();
            resourcemeta.addedBy = req.session.user._id.toString();
            resourcemeta.updatedBy = req.session.user._id.toString();

            dissertation.resourceMeta = resourcemeta;

            await new DissertationSchema(dissertation).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

