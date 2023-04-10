
import { Router, Request, Response } from "express";
const router = Router();

import multer from "multer";
const upload = multer();

import { IsAuthenticated, HasRoles } from "../../utils/AuthGuards";

import { ResourceType } from "../../interfaces/Resources";

import { body, validationResult } from "express-validator";

import { validateAddResource, validateUpdateResource, validateDownloadResource, validateDuplicateResource } from "../Validations/ResourceValidation";

import { SaveBook, DeleteBook, DownloadBook, UpdateBook, DuplicateBook } from "./ResourceHandlers/BookHandlers";
import { DeleteJournal, DuplicateJournal, DownloadJournal, SaveJournal, UpdateJournal } from "./ResourceHandlers/JournalHandlers";
import { SaveDissertation, DeleteDissertation, DownloadDissertation, UpdateDissertation, DuplicateDissertation } from "./ResourceHandlers/DissertationHandlers";
import { SaveRider, DeleteRider, UpdateRider, DownloadRider, DuplicateRider } from "./ResourceHandlers/RiderHandler";

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
      case ResourceType.Dissertation:
        await SaveDissertation(req);
        break;
      case ResourceType.Rider:
        await SaveRider(req);
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
      case ResourceType.Dissertation:
        await UpdateDissertation(req);
        break;
      case ResourceType.Rider:
        await UpdateRider(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/download', IsAuthenticated, HasRoles(["admin", "editor"]), upload.fields([{ name: 'file', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), validateDownloadResource, async (req: Request, res: Response) => {
  let resource: ResourceType = req.body.type as ResourceType;
  let url : String = '';

  try {
    switch (Number(resource)) {
      case ResourceType.Book:
        url = await DownloadBook(req,res);
        break;
      case ResourceType.Journal:
        url = await DownloadJournal(req,res);
        break;
      case ResourceType.Dissertation:
        url = await DownloadDissertation(req,res);
        break;
      case ResourceType.Rider:
        url = await DownloadRider(req,res);
        break;
    }

    res.status(200).json({ status: "success", url });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});


router.post('/duplicate', IsAuthenticated, HasRoles(["admin", "editor"]), validateDuplicateResource, async (req: Request, res: Response) => {
  let resource: ResourceType = req.body.type as ResourceType;

  try {
    switch (Number(resource)) {
      case ResourceType.Book:
        await DuplicateBook(req);
        break;
      case ResourceType.Journal:
        await DuplicateJournal(req);
        break;
      case ResourceType.Dissertation:
        await DuplicateDissertation(req);
        break;
      case ResourceType.Rider:
        await DuplicateRider(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    console.error(error)
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
      case ResourceType.Dissertation:
        await DeleteDissertation(req);
        break;
      case ResourceType.Rider:
        await DeleteRider(req);
        break;
    }

    res.status(200).json({ status: "success" });

  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }

});

export default router;
