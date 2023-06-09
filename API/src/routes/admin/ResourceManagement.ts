
import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated, HasRoles } from "../../utils/AuthGuards";

import { ResourceType } from "../../interfaces/Resources";

import { body, validationResult } from "express-validator";

import { validateAddResource, validateUpdateResource, validateDownloadResource, validateDuplicateResource } from "../Validations/ResourceValidation";

import { SaveBook, DeleteBook, UpdateBook, DuplicateBook } from "./ResourceHandlers/BookHandlers";
import { DeleteJournal, DuplicateJournal, SaveJournal, UpdateJournal } from "./ResourceHandlers/JournalHandlers";
import { SaveDissertation, DeleteDissertation,  UpdateDissertation, DuplicateDissertation } from "./ResourceHandlers/DissertationHandlers";
import { SaveRider, DeleteRider, UpdateRider,  DuplicateRider } from "./ResourceHandlers/RiderHandler";

router.post('/add', IsAuthenticated, HasRoles(["admin", "editor"]), validateAddResource, async (req: Request, res: Response) => {
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
    console.error(error)
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

router.post('/update', IsAuthenticated, HasRoles(["admin", "editor"]), validateUpdateResource, async (req: Request, res: Response) => {
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

import { query } from "express-validator";

import { BookSchema } from "../../schemas/ResourceSchemas/book";
import { JournalSchema } from "../../schemas/ResourceSchemas/Journal";
import { RiderSchema } from "../../schemas/ResourceSchemas/Rider";
import { DissertationSchema } from "../../schemas/ResourceSchemas/Dissertation";
import { Pagination } from "../../interfaces/Pagination";

router.get('/', IsAuthenticated, HasRoles(["admin", "editor"]), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), async (req: Request, res: Response) => {
  const errors = validationResult(req);
  const { page, pageSize } = req.query;

  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  let startIndex = (Number(page) - 1) * Number(pageSize);
  let endIndex = Number(page) * Number(pageSize);

  const agg : any = [
    {
      '$match': {}
    },
    {
      '$unset': '__v'
    },
    {
      '$sort': { _id: 1 } // Add sorting condition to ensure consistent order across pages
    }
  ];

  // Retrieve all documents from all collections
  const collections = [BookSchema, JournalSchema, RiderSchema, DissertationSchema];
  const allDocs: any[] = [];
  let finalCount = 0;

  for (const CollectionSchema of collections) {
    const collectionDocs = await CollectionSchema.aggregate(agg).exec();
    finalCount += collectionDocs.length;
    allDocs.push(...collectionDocs);
  }

  // Calculate pagination based on the combined results
  let paginatedDocs = allDocs.slice(startIndex, endIndex);
  let pagination : Pagination = new Pagination();
  pagination.currentPage = Number(page);
  pagination.totalPages = Math.ceil(finalCount / Number(pageSize));

  return res.status(200).json({
    status: "success",
    documents: paginatedDocs,
    pagination: pagination
  });
});
export default router;
