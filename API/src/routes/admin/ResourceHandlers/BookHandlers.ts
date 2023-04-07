import { Request, Response } from "express";

import { randomUUID } from "crypto";

import { uploadFile, deleteFile } from "../../../utils/UploadFiles";

import { BookAddResource, BookUpdateResource } from "../../../interfaces/ResourceRequest";
import { ResourceType, ResourceMeta, DigitalResource } from "../../../interfaces/Resources";
import { Book } from "../../../interfaces/Resources/Book";

import { BookSchema } from "../../../schemas/ResourceSchemas/book";

export { SaveBook, DeleteBook, UpdateBook }

function UpdateBook(req : Request) : Promise<void>
{
    return new Promise(async (resolve, reject) => {
        try {
            let storedBook : Book | null = await BookSchema.findOne({_id : req.body._id});
            
            if(!storedBook)
            {
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

            if(storedBook.resourceMeta)
            {
                storedBook.resourceMeta.dateUpdated = Date.now();
                storedBook.resourceMeta.updatedBy = req.session.user._id.toString();
                storedBook.resourceMeta.amount = resource.amount;

                if(storedBook.resourceMeta.amountLeft > resource.amount)
                {
                    storedBook.resourceMeta.amountLeft = resource.amount;
                }
            }

            if (storedBook.digital && storedBook.digitalResouce) {
                let bookUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];
                
                if(bookUpload)
                {
                    const bookFile = bookUpload[0];
                    const bookFileExtension: string | undefined = bookFile?.originalname ? bookFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                    await deleteFile(String(storedBook.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
                    let fileURL: string = await uploadFile("books", randomUUID().toString(), String(bookFileExtension), "gs://sangulibrary-d9533.appspot.com/", bookFile.buffer);
                    storedBook.digitalResouce.fileURL = fileURL;
                }
                
                if(coverUpload)
                {
                    const coverFile = coverUpload[0];
                    const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                    await deleteFile(String(storedBook.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/");
                    let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);
                    storedBook.digitalResouce.coverURL = coverURL;
                }
            }

            await BookSchema.findOneAndUpdate({_id : req.body._id}, storedBook);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

function DeleteBook(req : Request) : Promise<void>
{
    return new Promise(async (resolve, reject) => {
        try {
            let bookResult : Book | null = await BookSchema.findOneAndDelete({_id : req.body._id});

            if(!bookResult)
            {
                reject("book not found!");
                return;
            }

            if(bookResult.digital)
            {
                await deleteFile(String(bookResult?.digitalResouce?.fileURL), "gs://sangulibrary-d9533.appspot.com/");
                await deleteFile(String(bookResult?.digitalResouce?.coverURL), "gs://sangulibrary-d9533.appspot.com/")
            }

            resolve();
        }
        catch(err)
        {
            reject(err);
        }
    })
}

function SaveBook(req: Request): Promise<void> {
    return new Promise(async (resolve, reject) => {
        try {
            let resource: BookAddResource = JSON.parse(req.body.resource) as BookAddResource;

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
            resourcemeta.amount = resource.amount;
            resourcemeta.amountLeft = resourcemeta.amount;

            book.resourceMeta = resourcemeta;

            if (book.digital) {
                let digitalResouce: DigitalResource = new DigitalResource();

                let bookUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['file'];
                let coverUpload = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

                if (!bookUpload || !coverUpload) {
                    return reject({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
                }

                const bookFile = bookUpload[0];
                const coverFile = coverUpload[0];

                const bookFileExtension: string | undefined = bookFile?.originalname ? bookFile.originalname.split('.').pop()?.toLowerCase() : undefined;
                const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;


                let fileURL: string = await uploadFile("books", randomUUID().toString(), String(bookFileExtension), "gs://sangulibrary-d9533.appspot.com/", bookFile.buffer);
                let coverURL: string = await uploadFile("covers", randomUUID().toString(), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);

                digitalResouce.fileURL = fileURL;
                digitalResouce.coverURL = coverURL;

                book.resourceMeta.amount = 1;
                book.resourceMeta.amountLeft = 1;

                book.digitalResouce = digitalResouce;
            }


            await new BookSchema(book).save();

            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

