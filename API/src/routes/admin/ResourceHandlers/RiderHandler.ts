import { Request } from "express";

import { randomUUID } from "crypto";

import { uploadFile, deleteFile } from "../../../utils/UploadFiles";

import { RiderAddUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta, DigitalResource } from "../../../interfaces/Resources";
import { Rider } from "../../../interfaces/Resources/Rider";

import { RiderSchema } from "../../../schemas/ResourceSchemas/Rider";

export { SaveRider, DeleteRider, UpdateRider }

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

            if (storedRider.resourceMeta) {
                storedRider.resourceMeta.dateUpdated = Date.now();
                storedRider.resourceMeta.updatedBy = req.session.user._id.toString();
            }

            if (storedRider.digitalResouce) {
                let riderUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

                const riderFile = riderUpload[0];
                const coverFile = coverUpload[0];

                const FileExtension: string | undefined = riderFile?.originalname ? riderFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;

                if (riderUpload) {
                    await deleteFile(String(storedRider.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
                    let fileURL: string = await uploadFile("riders", randomUUID().toString(), String(FileExtension), "gs://sangulibrary-d9533.appspot.com/", riderFile.buffer);
                    storedRider.digitalResouce.fileURL = fileURL;
                }

                if (coverUpload) {
                    await deleteFile(String(storedRider.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/");
                    let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);
                    storedRider.digitalResouce.coverURL = coverURL;
                }
            }

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
            let dissertationResult: Rider | null = await RiderSchema.findOneAndDelete({ _id: req.body._id });

            if (!dissertationResult) {
                reject("rider not found!");
                return;
            }

            await deleteFile(String(dissertationResult?.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
            await deleteFile(String(dissertationResult?.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/")

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

            // create digital resource
            let digitalResouce: DigitalResource = new DigitalResource();

            let riderUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
            let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

            if (!riderUpload && !coverUpload) {
                return reject("მოთხოვნის ფორმატი არასწორია!");
            }

            const riderFile = riderUpload[0];
            const coverFile = coverUpload[0];

            const FileExtension: string | undefined = riderFile?.originalname ? riderFile.originalname.split('.').pop()?.toLowerCase() : undefined;
            const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;

            let fileURL: string = await uploadFile("riders", randomUUID().toString(), String(FileExtension), "gs://sangulibrary-d9533.appspot.com/", riderFile.buffer);
            let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);

            digitalResouce.fileURL = fileURL;
            digitalResouce.coverURL = coverURL;

            rider.digitalResouce = digitalResouce;

            await new RiderSchema(rider).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

