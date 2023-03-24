
import { Router, Request, Response } from "express";
const router = Router();

import multer from "multer";
const upload = multer();

import { body, query, validationResult } from 'express-validator';
import { IsAuthenticated, HasRole } from "../../utils/AuthGuards";
import { DigitalBookSchema } from "../../schemas/BookSchema";
import { randomUUID } from "crypto";

import { uploadFile, uploadPublicFile, deleteFile, extractFilePath, getPublicURL, getTempPublicURL } from "../../utils/UploadFiles";
import { DigitalBook } from "../../interfaces/Book";

import { validateAddBook, validateUpdateBook } from "../validations/BookManagementValidation";

router.post("/addbook", IsAuthenticated, HasRole("admin"), upload.fields([{ name: 'book', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateAddBook, (req: Request, res: Response) => {

  let book = (req.files as { [fieldname: string]: Express.Multer.File[] })['book'];
  let cover = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

  if (!book || !cover) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  const bookFile = book[0];
  const coverFile = cover[0];

  // Check file extensions
  const bookFileExtension: string | undefined = bookFile?.originalname ? bookFile.originalname.split('.').pop()?.toLowerCase() : undefined;
  const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;

  if (!/^(pdf)$/.test(String(bookFileExtension)) || !/^(png|jpe?g|jpeg)$/.test(String(coverFileExtension))) {
    return res.status(400).json({ status: "error", message: "ფაილის ტიპი არასწორია" });
  }

  let digitalBook = new DigitalBook();

  digitalBook.bookid = randomUUID();
  digitalBook.title = req.body.title;
  digitalBook.subTitle = req.body.subTitle;
  digitalBook.authors = JSON.parse(req.body.authors);
  digitalBook.editors = JSON.parse(req.body.editors);
  digitalBook.description = req.body.description;
  digitalBook.isbn = req.body.isbn;
  digitalBook.category = req.body.category;
  digitalBook.remark = req.body.remark;
  digitalBook.resume = req.body.resume;
  digitalBook.saveCipher = req.body.saveCipher;
  digitalBook.publication = req.body.publication;
  digitalBook.publicationYear = req.body.publicationYear;
  digitalBook.publicationLocation = req.body.publicationLocation;

  DigitalBookSchema.findOne(({ isbn: digitalBook.isbn })).then((findBookResult) => {
    if (findBookResult) {
      return res.status(400).json({ status: "error", message: "მოცემული წიგნი სისტემაში უკვე დამატებულია!" });
    }

    uploadFile("books", String(digitalBook.bookid), "pdf", "gs://sangulibrary-d9533.appspot.com/", bookFile.buffer).then((bookUploadResult) => {
      digitalBook.url = bookUploadResult;
      uploadFile("covers", String(digitalBook.bookid), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer).then((coverUploadResult) => {
        getPublicURL(coverUploadResult, "gs://sangulibrary-d9533.appspot.com/").then((coverpublicURL) => {
          digitalBook.cover = coverpublicURL;
          let schema = new DigitalBookSchema(digitalBook);

          return schema.save().then(() => {
            res.status(200).json({ status: "success", message: "წიგნი წარმატებით დაემატა!", book: digitalBook });
          });
        });
      });
    }).catch(() => {
      res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    });

  }).catch((error) => {
    res.status(400).json({ status: "fail", message: error.message });
  })
});

router.post('/updatebook', IsAuthenticated, HasRole("admin"), upload.fields([{ name: 'book', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateUpdateBook, async (req: Request, res: Response) => {
  let book = (req.files as { [fieldname: string]: Express.Multer.File[] })['book'];
  let cover = (req.files as { [fieldname: string]: Express.Multer.File[] })['cover'];

  try {
    const bookResult = await DigitalBookSchema.findOne({ bookid: req.body.bookid });
    if (!bookResult) {
      return res.json({ status: "fail", message: "მოცემული წიგნი სისტემაში არ არსებობს!" });
    }

    let digitalBook: DigitalBook = new DigitalBook();
    digitalBook.bookid = req.body.bookid;
    digitalBook.title = req.body.title;
    digitalBook.subTitle = req.body.subTitle;
    digitalBook.authors = JSON.parse(req.body.authors);
    digitalBook.editors = JSON.parse(req.body.editors);
    digitalBook.description = req.body.description;
    digitalBook.isbn = req.body.isbn;
    digitalBook.category = req.body.category;
    digitalBook.remark = req.body.remark;
    digitalBook.resume = req.body.resume;
    digitalBook.saveCipher = req.body.saveCipher;
    digitalBook.publication = req.body.publication;
    digitalBook.publicationYear = req.body.publicationYear;
    digitalBook.publicationLocation = req.body.publicationLocation;
    digitalBook.cover = bookResult.cover;
    digitalBook.url = bookResult.url;

    if (cover) {
      const coverFile = cover[0];
      const coverFileExtension: string | undefined = coverFile?.originalname ? coverFile.originalname.split('.').pop()?.toLowerCase() : undefined;
      if (!/^(png|jpe?g|jpeg)$/.test(String(coverFileExtension))) {
        return res.json({ status: "fail", message: "ყდის ტიპი არასწორია" });
      }

      const filePath = extractFilePath(String(digitalBook.cover));
      await deleteFile("covers/" + filePath, "gs://sangulibrary-d9533.appspot.com/");
      const newCoverFilePath = await uploadPublicFile("covers", String(randomUUID()), String(coverFileExtension), "gs://sangulibrary-d9533.appspot.com/", coverFile.buffer);
      digitalBook.cover = newCoverFilePath;
    }

    if (book) {
      const bookFile = book[0];
      const bookFileExtension: string | undefined = bookFile?.originalname ? bookFile.originalname.split('.').pop()?.toLowerCase() : undefined;
      if (!/^(pdf)$/.test(String(bookFileExtension))) {
        return res.status(400).json({ status: "error", message: "წიგნის ტიპი არასწორია" });
      }

      const newBookFilePath = await uploadFile("books", String(digitalBook.bookid), String(bookFileExtension), "gs://sangulibrary-d9533.appspot.com/", bookFile.buffer);
      digitalBook.url = newBookFilePath;
    }

    await DigitalBookSchema.findOneAndUpdate({ bookid: digitalBook.bookid }, digitalBook);
    return res.json({ status: "success", message: 'წიგნი წარმატებით განახლდა!' });
  } catch (err) {
    return res.json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post("/deletebook", IsAuthenticated, HasRole("editor"), body("bookid").notEmpty().isUUID(), (req: Request, res: Response) => {
  DigitalBookSchema.findOneAndDelete({ bookid: req.body.bookid }).then((results) => {
    if (results) {
      deleteFile(String(results.url), "gs://sangulibrary-d9533.appspot.com/");
      deleteFile("covers/" + extractFilePath(String(results.cover)), "gs://sangulibrary-d9533.appspot.com/");

      return res.status(200).json({ status: "success", message: 'წიგნი წარმატებით წაიშალა!' });
    }
    res.status(400).json({ status: "fail", message: "მოცემული წიგნი სისტემაში არ არსებობს!" });

  }).catch((error) => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

router.get("/downloadbook", IsAuthenticated, HasRole("admin") || HasRole("editor"), query("bookid").notEmpty().isUUID(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  DigitalBookSchema.findOne({ bookid: req.query.bookid }).then((results) => {
      if (results) {
          getTempPublicURL(String(results.url), "gs://sangulibrary-d9533.appspot.com/", 1).then((fileURL) => {
              res.status(200).json({ status: "success", url: fileURL });
          });
          return;
      }
      res.status(400).json({ status: "success", message: "მოცემული წიგნი სისტემაში არ არსებობს!" });
  }).catch(() => {
      res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

export default router;
