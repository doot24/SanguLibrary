import { Router, Request, Response } from "express";
const router = Router();

import { body, query, validationResult } from 'express-validator';
import { IsAuthenticated, HasRole } from "../../utils/AuthGuards";
import { randomUUID } from "crypto";

import { PetitionTemplate } from "../../interfaces/Petition";
import { PetitionSchema, PetitionTemplateSchema } from "../../schemas/PetitionSchema";

import { SendToUser } from "../../utils/Notification";
import { Error } from "mongoose";

router.post("/addtemplate", IsAuthenticated, HasRole("admin"), body("title").notEmpty().isString(), body("text").notEmpty().isString(), (req: Request, res: Response) => {
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

router.post("/updatestatus", IsAuthenticated, HasRole("admin"), body("petitionid").notEmpty().isUUID(), body("status").notEmpty().isString(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  PetitionSchema.findOneAndUpdate(
    { _id: req.body.petitionid },
    { status: req.body.status }
  ).then((petition) => {
    if(!petition)
    {
      throw new Error("petition not found");
    }
    let author : string = String(req.session.user.firstName + " " + req.session.user.lastName);
    let text: string = `თქვენს მიერ გაკეთებული განცხადების სტატუსი განახლდა.`;
    SendToUser(String(petition.owner), author, "განცხადების სტატუსი შეიცვალა", text);
    res.status(200).json({ status: "success" });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

router.post("/setcomment", IsAuthenticated, HasRole("admin"), body("petitionid").notEmpty().isUUID(), body("comment").notEmpty().isString(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  PetitionSchema.findOneAndUpdate(
    { _id: req.body.petitionid },
    { comment: req.body.comment }
  ).then((petition) => {
    if(!petition)
    {
      throw new Error("petition not found");
    }

    let author : string = String(req.session.user.firstName + " " + req.session.user.lastName);
    let text: string = `თქვენს მიერ გაკეთებული განცხადებას დაემატა ახალი კომენტარი.`;
    SendToUser(String(petition.owner), author, "განცხადებას დაემატა კომენტარი", text)

    res.status(200).json({ status: "success" });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

router.get("/", IsAuthenticated, HasRole("admin"), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
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
        foreignField : 'userid',
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

router.get("/search", IsAuthenticated, HasRole("admin") || HasRole("editor"), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
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
        foreignField : 'userid',
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
