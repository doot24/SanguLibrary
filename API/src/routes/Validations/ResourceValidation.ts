import { Request, Response, NextFunction } from 'express';
import { body, check, validationResult } from 'express-validator';

export const validateUpdateResource = [
  body('_id').notEmpty().isUUID(),
  body('resource').notEmpty().isJSON(),
  (req : Request, res : Response, next : any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  }
];

export const validateAddResource = [
  body('resource').notEmpty().isJSON(),
  (req : Request, res : Response, next : any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  }
];