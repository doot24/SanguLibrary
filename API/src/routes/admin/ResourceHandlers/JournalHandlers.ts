import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { JournalAddResource, JournalUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta } from "../../../interfaces/Resources";

import { JournalSchema } from "../../../schemas/ResourceSchemas/Journal";
import { Journal } from "../../../interfaces/Resources/Journal";

export { SaveJournal, DeleteJournal, UpdateJournal,  DuplicateJournal }

function UpdateJournal(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let storedJournal: Journal | null = await JournalSchema.findOne({ _id: req.body._id });

            if (!storedJournal) {
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
            storedJournal.resourceMeta.dateUpdated = Date.now();
            storedJournal.resourceMeta.updatedBy = req.session.user._id.toString();

            await JournalSchema.findOneAndUpdate({ _id: req.body._id }, storedJournal);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function DeleteJournal(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let journalResult: Journal | null = await JournalSchema.findOneAndDelete({ _id: req.body._id });

            if (!journalResult) {
                reject("journal not found!");
                return;
            }

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function DuplicateJournal(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let journal: Journal | null = await JournalSchema.findOne({ _id: req.body._id });
            if (!journal) {
                reject("journal not found!");
                return;
            }

            let newJournal: Journal = new Journal(journal);
            newJournal._id = randomUUID();
            await new JournalSchema(newJournal).save();
            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function SaveJournal(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let resource: JournalAddResource = JSON.parse(req.body.resource) as JournalAddResource;

            let dbResource: Journal | null = await JournalSchema.findOne({ saveCipher: resource.saveCipher });

            if (dbResource) {
                reject();
                return;
            }

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

            journal.resourceMeta = resourcemeta;

            await new JournalSchema(journal).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

