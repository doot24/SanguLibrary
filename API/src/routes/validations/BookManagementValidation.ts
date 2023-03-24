import { Request, Response, NextFunction } from 'express';
import { body, check, validationResult } from 'express-validator';

export const validateAddBook = [
  body('title').notEmpty().isString(),
  body('subTitle').notEmpty().isString(),
  body('authors').notEmpty().custom((value: any) => {
    let parsedValue : Array<String> = JSON.parse(value);
    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      throw new Error('Invalid array');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  },
  body('editors').notEmpty().custom((value: any) => {
    let parsedValue : Array<String> = JSON.parse(value);
    if (!Array.isArray(parsedValue)) {
      throw new Error('Invalid array');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  },
  body('description').notEmpty().isString(),
  body('isbn').notEmpty().isISBN(),
  body('category').notEmpty().isString(),
  body('remark').notEmpty().isString(),
  body('resume').notEmpty().isString(),
  body('saveCipher').notEmpty().isString(),
  body('publication').notEmpty().isString(),
  body('publicationLocation').notEmpty().isString(),
  body('publicationYear').notEmpty().custom((value, { req }) => {
    const validYear = /^(1\d{3}|[2-9]\d{3})$/;
    if (!validYear.test(value)) {
      throw new Error('Invalid publication year');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  },
];

export const validateUpdateBook = [
  body("bookid").notEmpty().isUUID(),
  body('title').notEmpty().isString(),
  body('subTitle').notEmpty().isString(),
  body('authors').notEmpty().custom((value: any) => {
    let parsedValue : Array<String> = JSON.parse(value);
    if (!Array.isArray(parsedValue) || parsedValue.length === 0) {
      throw new Error('Invalid array');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  },
  body('editors').notEmpty().custom((value: any) => {
    let parsedValue : Array<String> = JSON.parse(value);
    if (!Array.isArray(parsedValue)) {
      throw new Error('Invalid array');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  },
  body('description').notEmpty().isString(),
  body('isbn').notEmpty().isISBN(),
  body('category').notEmpty().isString(),
  body('remark').notEmpty().isString(),
  body('resume').notEmpty().isString(),
  body('saveCipher').notEmpty().isString(),
  body('publication').notEmpty().isString(),
  body('publicationLocation').notEmpty().isString(),
  body('publicationYear').notEmpty().custom((value, { req }) => {
    const validYear = /^(1\d{3}|[2-9]\d{3})$/;
    if (!validYear.test(value)) {
      throw new Error('Invalid publication year');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  },
];
