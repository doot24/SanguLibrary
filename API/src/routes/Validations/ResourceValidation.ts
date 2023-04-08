import { Request, Response, NextFunction } from 'express';
import { body, check, validationResult } from 'express-validator';

export const validateAddResource = [
  body('resource').notEmpty().isJSON(),
  body('type').notEmpty().isNumeric(),
  (req : Request, res : Response, next : any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  }
];

export const validateUpdateResource = [
  body('_id').notEmpty().isUUID(),
  body('type').notEmpty().isNumeric(),
  body('resource').notEmpty().isJSON(),
  (req : Request, res : Response, next : any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  }
];

export const validateDuplicateResource = [
  body('_id').notEmpty().isUUID(),
  body('type').notEmpty().isNumeric()
];
