import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated } from "../utils/AuthGuards";

import { SearchResults } from "../interfaces/SearchResults";
import { Pagination } from "../interfaces/Pagination";

import { BookSchema } from "../schemas/ResourceSchemas/book";
import { JournalSchema } from "../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../schemas/ResourceSchemas/Rider";

import {query, validationResult } from "express-validator";

router.get('/resource/', IsAuthenticated, query("text").notEmpty().isString(), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), async (req, res) => {
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  const { text, page, pageSize }: any = req.query; 

  try {
    const collections: any[] = [BookSchema, JournalSchema, DissertationSchema, RiderSchema];
    const searchResults: SearchResults[] = [];

    for (const schema of collections) {
      const results = await schema.aggregate([
        [
          {
            $match: {
              $text: { $search: text }
            }
          },
          {
            $lookup: {
              from: "checkouts",
              localField: "_id",
              foreignField: "resource_id",
              as: "checkout_info"
            }
          },
          {
            $lookup: {
              from: "holds",
              localField: "_id",
              foreignField: "resource_id",
              as: "hold_info"
            }
          },
          {
            $addFields: {
              hold: { $gt: [{ $size: "$hold_info" }, 0] },
              checkout: { $gt: [{ $size: "$checkout_info" }, 0] }
            }
          },
          {
            $project : {
              "hold_info":0,
              "checkout_info":0
            }
          }
        ]
      ]).allowDiskUse(true).exec();

      searchResults.push(...results);
    }

    const totalResults = searchResults.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedResults = searchResults.slice(startIndex, endIndex);

    const pagination: Pagination = {
      totalPages: Math.ceil(totalResults / pageSize),
      currentPage: page,
    };

    res.status(200).json({ searchResults: paginatedResults, pagination });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
    });  }
});

export default router;
