import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { uploadFile, deleteFile } from "../../../utils/UploadFiles";

import { JournalAddResource, JournalUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta, DigitalResource } from "../../../interfaces/Resources";
import { Book } from "../../../interfaces/Resources/Book";

import { JournalSchema } from "../../../schemas/ResourceSchemas/Journal";
import { Journal } from "../../../interfaces/Resources/Journal";

export { SaveJournal, DeleteJournal, UpdateJournal }

function UpdateJournal(req : Request) : Promise<void>
{
    return new Promise(async (resolve, reject) => {
        try {
            let storedJournal : Journal | null = await JournalSchema.findOne({_id : req.body._id});
            
            if(!storedJournal)
            {
                reject("journal not found!");
                return;
            }

            let resource: JournalUpdateResource = JSON.parse(req.body.resource) as JournalUpdateResource;
            
            storedJournal.title = resource.title;
            storedJournal.subTitle = resource.subTitle;
            storedJournal.authors = resource.authors;
            storedJournal.editors = resource.editors;
            storedJournal.collegues = resource.collegues;
            storedJournal.description = resource.description;
            storedJournal.category = resource.category;
            storedJournal.number = resource.number;
            storedJournal.issn = resource.issn;
            storedJournal.publication = resource.publication;
            storedJournal.publicationLocation = resource.publicationLocation;
            storedJournal.publicationYear = resource.publicationYear;
            storedJournal.remark = resource.remark;
            storedJournal.saveCipher = resource.saveCipher;

            if(storedJournal.resourceMeta)
            {
                storedJournal.resourceMeta.dateUpdated = Date.now();
                storedJournal.resourceMeta.updatedBy = req.session.user._id.toString();
                storedJournal.resourceMeta.amount = resource.amount;

                if(storedJournal.resourceMeta.amountLeft > resource.amount)
                {
                    storedJournal.resourceMeta.amountLeft = resource.amount;
                }
            }

            if (storedJournal.digital && storedJournal.digitalResouce) {
                let journalUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];
                
                if(journalUpload)
                {
                    const journalfile = journalUpload[0];
                    const journalFileExtension: string | undefined = journalfile?.originalname ? journalfile.originalname.split('.').pop()?.toLowerCase() : undefined;
                    await deleteFile(String(storedJournal.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
                    let fileURL: string = await uploadFile("journals", randomUUID().toString(), String(journalFileExtension), "gs://sangulibrary-d9533.appspot.com/", journalfile.buffer);
                    storedJournal.digitalResouce.fileURL = fileURL;
                }
                
                if(coverUpload)
                {
                    const coverFile = coverUpload[0];
                    const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                    await deleteFile(String(storedJournal.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/");
                    let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);
                    storedJournal.digitalResouce.coverURL = coverURL;
                }
            }

            await JournalSchema.findOneAndUpdate({_id : req.body._id}, storedJournal);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function DeleteJournal(req : Request) : Promise<void>
{
    return new Promise(async (resolve, reject) => {
        try {
            let journalResult : Journal | null = await JournalSchema.findOneAndDelete({_id : req.body._id});
            
            if(!journalResult)
            {
                reject("journal not found!");  
                return;
            }

            if(journalResult.digital)
            {
                await deleteFile(String(journalResult?.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
                await deleteFile(String(journalResult?.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/")
            }

            resolve();
        }
        catch(err)
        {
            reject(err);
        }
    })
}

function SaveJournal(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let resource: JournalAddResource = JSON.parse(req.body.resource) as JournalAddResource;

            let journal: Journal = new Journal();
            journal._id = randomUUID();
            journal.resourceType = (ResourceType.Journal);
            journal.title = resource.title;
            journal.digital = resource.digital;
            journal.subTitle = resource.subTitle;
            journal.authors = resource.authors;
            journal.editors = resource.editors;
            journal.collegues = resource.collegues;
            journal.description = resource.description;
            journal.category = resource.category;
            journal.number = resource.number;
            journal.issn = resource.issn;
            journal.publication = resource.publication;
            journal.publicationLocation = resource.publicationLocation;
            journal.publicationYear = resource.publicationYear;
            journal.remark = resource.remark;
            journal.saveCipher = resource.saveCipher;

            let resourcemeta: ResourceMeta = new ResourceMeta();
            resourcemeta.dateAdded = Date.now();
            resourcemeta.dateUpdated = Date.now();
            resourcemeta.addedBy = req.session.user._id.toString();
            resourcemeta.updatedBy = req.session.user._id.toString();
            resourcemeta.amount = resource.amount;
            resourcemeta.amountLeft = resourcemeta.amount;

            journal.resourceMeta = resourcemeta;

            if (journal.digital) {
                let digitalResouce: DigitalResource = new DigitalResource();

                let journalUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

                if (!journalUpload || !coverUpload) {
                    return reject({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
                }

                const journalFile = journalUpload[0];
                const coverFile = coverUpload[0];

                const journalFileExtension: string | undefined = journalFile?.originalname ? journalFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;


                let fileURL: string = await uploadFile("journals", randomUUID().toString(), String(journalFileExtension), "gs://sangulibrary-d9533.appspot.com/", journalFile.buffer);
                let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);

                digitalResouce.fileURL = fileURL;
                digitalResouce.coverURL = coverURL;

                journal.resourceMeta.amount = 1;
                journal.resourceMeta.amountLeft = 1;

                journal.digitalResouce = digitalResouce;
            }


            await new JournalSchema(journal).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

