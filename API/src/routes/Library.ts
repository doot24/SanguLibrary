import { Router, Request, Response } from "express";
import { IsAuthenticated } from "../utils/AuthGuards";
import {  body, param, query, validationResult } from 'express-validator';
import {getTempPublicURL } from "../utils/UploadFiles";

import { DigitalBookSchema } from "../schemas/BookSchema";

const router = Router();

import { CategorySchema } from "../schemas/CategorySchema";

router.get('/categories', IsAuthenticated, (req: Request, res: Response) => {
  CategorySchema.find({}).then((results) => {
    return res.status(200).json({status : "success", categories : results});
  }).catch(()=> {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  })
});

router.get("/books", IsAuthenticated , query('page').notEmpty().isNumeric(), query('pageSize').notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    let page = Number(req.query.page);
    let pageSize = Number(req.query.pageSize);
    
    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    DigitalBookSchema.find().skip(startIndex)
    .limit(pageSize)
    .exec().then((results) => {
        if(!results)
        {
            return res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
        }
        DigitalBookSchema.countDocuments().exec().then((totalBooks) => {
            res.status(200).json({ status: "success", books:results,totalPages: Math.ceil(totalBooks / pageSize),
            currentPage: page,
            hasPreviousPage: page > 1,
            hasNextPage: endIndex < totalBooks });
        });
    }).catch(() => {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    });
});


export default router;
