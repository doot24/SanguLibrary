import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { uploadFile, getPublicURL, deleteFile } from "../../../utils/UploadFiles";

import { DissertationAddUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta, DigitalResource } from "../../../interfaces/Resources";
import { Dissertation } from "../../../interfaces/Resources/Dissertation";

import { DissertationSchema } from "../../../schemas/ResourceSchemas/Dissertation";

export { SaveDissertation, DeleteDissertation, UpdateDissertation, DownloadDissertation, DuplicateDissertation }

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

            if (storedDissertation.resourceMeta) {
                storedDissertation.resourceMeta.dateUpdated = Date.now();
                storedDissertation.resourceMeta.updatedBy = req.session.user._id.toString();
            }

            if (storedDissertation.digitalResouce) {
                let dissertationUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

                const dissertationFile = dissertationUpload[0];
                const coverFile = coverUpload[0];

                const FileExtension: string | undefined = dissertationFile?.originalname ? dissertationFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;

                if (dissertationUpload) {
                    await deleteFile(String(storedDissertation.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
                    let fileURL: string = await uploadFile("dissertations", randomUUID().toString(), String(FileExtension), "gs://sangulibrary-d9533.appspot.com/", dissertationFile.buffer);
                    storedDissertation.digitalResouce.fileURL = fileURL;
                }

                if (coverUpload) {
                    await deleteFile(String(storedDissertation.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/");
                    let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);
                    storedDissertation.digitalResouce.coverURL = coverURL;
                }
            }

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

            await deleteFile(String(dissertationResult?.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
            await deleteFile(String(dissertationResult?.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/")

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

function DownloadDissertation(req: Request, res: Response): Promise<String> {
    return new Promise(async (resolve, reject) => {
        try {
            let dissertationResult: Dissertation | null = await DissertationSchema.findOne({ _id: req.body._id });

            if (!dissertationResult) {
                reject("dissertation not found!");
                return;
            }

            if (dissertationResult.digitalResouce) {
                let url: string = await getPublicURL(dissertationResult.digitalResouce?.fileURL, "gs://sangulibrary-d9533.appspot.com/");
                resolve(url);
            }
            else {
                reject();
            }

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

            // create digital resource
            let digitalResouce: DigitalResource = new DigitalResource();

            if (req.files) {

                let bookUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

                if (bookUpload) {
                    const bookFile = bookUpload[0];
                    const bookFileExtension: string | undefined = bookFile?.originalname ? bookFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                    let fileURL: string = await uploadFile("dissertations", randomUUID().toString(), String(bookFileExtension), "gs://sangulibrary-d9533.appspot.com/", bookFile.buffer);
                    digitalResouce.fileURL = fileURL;
                }

                if (coverUpload) {
                    const coverFile = coverUpload[0];
                    const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                    let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);
                    digitalResouce.coverURL = coverURL;
                }
            }
            dissertation.digitalResouce = digitalResouce;
            await new DissertationSchema(dissertation).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

