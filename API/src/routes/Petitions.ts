import { Router, Request, Response } from "express";
const router = Router();

import { body, query, validationResult } from 'express-validator';
import { IsAuthenticated } from "../utils/AuthGuards";

import { Petition } from "../interfaces/Petition";
import { PetitionSchema, PetitionTemplateSchema } from "../schemas/PetitionSchema";
import { randomUUID } from "crypto";

router.post("/send", IsAuthenticated, body("template").notEmpty().isUUID(), body("text").notEmpty().isString(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  let petition: Petition = new Petition();
  petition._id = randomUUID();
  petition.status = "pending";
  petition.owner = req.session.user.userid;
  petition.timestamp = Date.now();
  petition.template = req.body.template;
  petition.text = req.body.text;

  new PetitionSchema(petition).save().then(() => {
    res.status(200).json({ status: "success" });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

router.get('/templates', IsAuthenticated, (req: Request, res: Response) => {
  PetitionTemplateSchema.find().then((results) => {
    res.status(200).json({ status: "success", templates: results });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
})

router.get("/", IsAuthenticated, query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
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
      $match: {
        owner: req.session.user.userid
      }
    },
    {
      $lookup: {
        from: 'petitiontemplates',
        localField: 'template',
        foreignField: '_id',
        as: 'usedtemplate'
      }
    },
    {
      $skip: startIndex
    },
    {
      $limit: pageSize
    }
  ]).then((results) => {
    PetitionSchema.countDocuments({ owner: req.session.user.userid }).exec().then((totalPetitions) => {
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
  }).catch(() => {
    res.status(400).json({
      status: "fail",
      message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
    });
  });

});

export default router;
