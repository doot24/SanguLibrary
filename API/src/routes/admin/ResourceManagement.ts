
import { Router, Request, Response } from "express";
const router = Router();

import multer from "multer";
const upload = multer();

import { IsAuthenticated, HasRoles } from "../../utils/AuthGuards";

import { ResourceType } from "../../interfaces/Resources";
import { IResourseInfo } from "../../interfaces/ResourceRequest";

import { SaveBook, DeleteBook, UpdateBook } from "./ResourceHandlers/BookHandlers";
import { body, validationResult } from "express-validator";

import { validateAddResource, validateUpdateResource } from "../Validations/ResourceValidation";

router.post('/add', IsAuthenticated, HasRoles(["admin", "editor"]), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateAddResource, async (req: Request, res: Response) => {
  let resource: IResourseInfo = JSON.parse(req.body.resource) as IResourseInfo;

  try {
    switch (resource.kind) {
      case ResourceType.Book:
        await SaveBook(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/update', IsAuthenticated, HasRoles(["admin", "editor"]), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateUpdateResource, async (req: Request, res: Response) => {
  let resource: IResourseInfo = JSON.parse(req.body.resource) as IResourseInfo;
  try {
    switch (resource.kind) {
      case ResourceType.Book:
        await UpdateBook(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/delete', IsAuthenticated, HasRoles(["admin", "editor"]), body("_id").notEmpty().isUUID(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }
  let promises: Promise<object>[] = [];

  promises.push(DeleteBook(req).then());
  Promise.all(promises)
    .then(() => res.status(200).json({ status: "success" }))
    .catch(() => res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" }));
});

export default router;
