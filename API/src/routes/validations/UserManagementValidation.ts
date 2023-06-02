import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

export const validateUpdateUser = [
  body("id").notEmpty().isUUID(),
  body("roles").notEmpty().custom((value: any) => {
    let parsedValue : Array<String> = JSON.parse(value);
    
    if (!Array.isArray(parsedValue) || !parsedValue.every((item : String) => ["admin", "editor", "employee"].includes(String(item)))) {
      throw new Error('Invalid roles');
    }
    return true;
  }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    next();
  }
];

