
import { Router, Request, Response } from "express";
const router = Router();

import multer from "multer";
const upload = multer();

import { IsAuthenticated, HasRoles } from "../../utils/AuthGuards";

import { ResourceType } from "../../interfaces/Resources";

import { SaveBook, DeleteBook, UpdateBook } from "./ResourceHandlers/BookHandlers";
import { body, validationResult } from "express-validator";

import { validateAddResource, validateUpdateResource } from "../Validations/ResourceValidation";
import { DeleteJournal, SaveJournal, UpdateJournal } from "./ResourceHandlers/JournalHandlers";

router.post('/add', IsAuthenticated, HasRoles(["admin", "editor"]), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateAddResource, async (req: Request, res: Response) => {
  let resource: ResourceType = req.body.type as ResourceType;

  try {
    switch (Number(resource)) {
      case ResourceType.Book:
        await SaveBook(req);
        break;
      case ResourceType.Journal:
        await SaveJournal(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/update', IsAuthenticated, HasRoles(["admin", "editor"]), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateUpdateResource, async (req: Request, res: Response) => {
  let resource: ResourceType = req.body.type as ResourceType;

  try {
    switch (Number(resource)) {
      case ResourceType.Book:
        await UpdateBook(req);
        break;
      case ResourceType.Journal:
        await UpdateJournal(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/delete', IsAuthenticated, HasRoles(["admin", "editor"]), body("_id").notEmpty().isUUID(), body("type").notEmpty().isNumeric(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }
  let resouceType: ResourceType = req.body.type as ResourceType;
  try {
    switch (Number(resouceType)) {
      case ResourceType.Book:
        await DeleteBook(req);
        break;
      case ResourceType.Journal:
        await DeleteJournal(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }

});

export default router;
