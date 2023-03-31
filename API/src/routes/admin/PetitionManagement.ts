import { Router, Request, Response } from "express";
const router = Router();

import { body, query, validationResult } from 'express-validator';
import { IsAuthenticated, HasRole, HasRoles } from "../../utils/AuthGuards";
import { randomUUID } from "crypto";

import { PetitionTemplate } from "../../interfaces/Petition";
import { PetitionSchema, PetitionTemplateSchema } from "../../schemas/PetitionSchema";

import { SendToUser } from "../../utils/Notification";
import { Error } from "mongoose";

router.post("/addtemplate", IsAuthenticated, HasRoles(["admin", "editor"]), body("title").notEmpty().isString(), body("text").notEmpty().isString(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  let petitionTemplate: PetitionTemplate = new PetitionTemplate();
  petitionTemplate._id = randomUUID();
  petitionTemplate.title = req.body.title;
  petitionTemplate.text = req.body.text;

  new PetitionTemplateSchema(petitionTemplate).save().then(() => {
    res.status(200).json({ status: "success" });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

router.post("/update", IsAuthenticated, HasRoles(["admin", "editor", "employee"]), body("petitionid").notEmpty().isUUID(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  let commentInput : string = String(req.body.comment) || "";
  let statusInput : string = String(req.body.status) || "pending";

  PetitionSchema.findOneAndUpdate(
    { _id: req.body.petitionid },
    { comment: commentInput, status : statusInput }
  ).then((petition) => {
    if(!petition)
    {
      throw new Error("petition not found");
    }

    let text: string = `თქვენს მიერ გაკეთებულ განცხადებას შეეცვალა სტატუსი ან დაემატა კომენტარი.`;
    SendToUser(String(petition.owner), "სისტემა", "განთავსებული განცხადება განახლდა", text)

    res.status(200).json({ status: "success" });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

router.get("/", IsAuthenticated, HasRoles(["admin", "editor", "employee"]), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  const page = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  PetitionSchema.aggregate([
    {
      $lookup: {
        from: 'petitiontemplates',
        localField: 'template',
        foreignField: '_id',
        as: 'usedtemplate'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField : 'owner',
        foreignField : '_id',
        as: 'user'
      }
    },
    {
      $skip: startIndex
    },
    {
      $limit: pageSize
    }
  ]).then((results) => {
    PetitionSchema.countDocuments().exec().then((totalPetitions) => {
      return res.status(200).json({
        status: "success",
        petitions: results,
        totalPetitions: totalPetitions,
        totalPages: Math.ceil(totalPetitions / pageSize),
        currentPage: page,
        hasPreviousPage: page > 1,
        hasNextPage: endIndex < totalPetitions
      });
    });
  }).catch((err) => {
    res.status(400).json({
      status: "fail",
      message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
    });
  });
});

router.get("/search", IsAuthenticated, HasRoles(["admin", "editor", "employee"]) , query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  let publicNumberQuery : String = String(req.query.publicNumber);
  let phoneNumberQuery : String = String(req.query.phoneNumber);

  if(!publicNumberQuery && !phoneNumberQuery)
  {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }
  
  const page = Number(req.query.page);
  const pageSize = Number(req.query.pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  PetitionSchema.aggregate([
    {
      $lookup: {
        from: 'petitiontemplates',
        localField: 'template',
        foreignField: '_id',
        as: 'usedtemplate'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField : 'owner',
        foreignField : '_id',
        as: 'user'
      }
    },
    {
      $match : {
        $or : [{'user.phoneNumber' : phoneNumberQuery}, {'user.publicNumber' : publicNumberQuery}]
      },
    },
    {
      $skip: startIndex
    },
    {
      $limit: pageSize
    },
  ]).then((results : any) => {
    if(results.length === 0)
    {
      return res.status(200).json({
        status: "success",
        petitions: results,
        totalPetitions: 0,
        totalPages: 0,
        currentPage: page
      })
    }

    PetitionSchema.countDocuments({owner : results[0].owner}).exec().then((totalPetitions) => {
      return res.status(200).json({
        status: "success",
        petitions: results,
        totalPetitions: totalPetitions,
        totalPages: Math.ceil(totalPetitions / pageSize),
        currentPage: page,
        hasPreviousPage: page > 1,
        hasNextPage: endIndex < totalPetitions
      })
    });
  }).catch((err) => {
    res.status(400).json({
      status: "fail",
      message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
    });
  });
});
export default router;
