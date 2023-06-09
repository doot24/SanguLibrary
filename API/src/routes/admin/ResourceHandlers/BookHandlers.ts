import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { BookAddResource, BookUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta } from "../../../interfaces/Resources";
import { Book } from "../../../interfaces/Resources/Book";

import { BookSchema } from "../../../schemas/ResourceSchemas/book";

export { SaveBook, DeleteBook, UpdateBook, DuplicateBook }

function UpdateBook(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let storedBook: Book | null = await BookSchema.findOne({ _id: req.body._id });

            if (!storedBook) {
                reject("book not found!");
                return;
            }

            let resource: BookUpdateResource = JSON.parse(req.body.resource) as BookUpdateResource;

            storedBook.resourceType = (ResourceType.Book);
            storedBook.title = resource.title;
            storedBook.subTitle = resource.subTitle;
            storedBook.authors = resource.authors;
            storedBook.editors = resource.editors;
            storedBook.description = resource.description;
            storedBook.category = resource.category;
            storedBook.isbn = resource.isbn;
            storedBook.publication = resource.publication;
            storedBook.publicationLocation = resource.publicationLocation;
            storedBook.publicationYear = resource.publicationYear;
            storedBook.resume = resource.resume;
            storedBook.remark = resource.remark;
            storedBook.saveCipher = resource.saveCipher;

            storedBook.resourceMeta.dateUpdated = Date.now();
            storedBook.resourceMeta.updatedBy = String(req.session.user._id);

            await BookSchema.findOneAndUpdate({ _id: req.body._id }, storedBook);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function DeleteBook(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let bookResult: Book | null = await BookSchema.findOneAndDelete({ _id: req.body._id });

            if (!bookResult) {
                reject("book not found!");
                return;
            }

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function DuplicateBook(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let bookResult: Book | null = await BookSchema.findOne({ _id: req.body._id });

            if (!bookResult) {
                reject("book not found!");
                return;
            }

            let newBook: Book = new Book(bookResult);
            newBook._id = randomUUID();
            await new BookSchema(newBook).save();

            resolve();
        }
        catch (err) {
            reject(err);
        }
    })
}

function SaveBook(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let resource: BookAddResource = JSON.parse(req.body.resource) as BookAddResource;

            let dbResource: Book | null = await BookSchema.findOne({ saveCipher: resource.saveCipher });

            if (dbResource) {
                reject();
                return;
            }

            let book: Book = new Book();
            book._id = randomUUID();
            book.resourceType = (ResourceType.Book);
            book.title = resource.title;
            book.digital = resource.digital;
            book.subTitle = resource.subTitle;
            book.authors = resource.authors;
            book.editors = resource.editors;
            book.description = resource.description;
            book.category = resource.category;
            book.isbn = resource.isbn;
            book.publication = resource.publication;
            book.publicationLocation = resource.publicationLocation;
            book.publicationYear = resource.publicationYear;
            book.resume = resource.resume;
            book.remark = resource.remark;
            book.saveCipher = resource.saveCipher;

            let resourcemeta: ResourceMeta = new ResourceMeta();
            resourcemeta.dateAdded = Date.now();
            resourcemeta.dateUpdated = Date.now();
            resourcemeta.addedBy = req.session.user._id.toString();
            resourcemeta.updatedBy = req.session.user._id.toString();

            book.resourceMeta = resourcemeta;

            await new BookSchema(book).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

