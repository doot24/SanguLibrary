import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated } from "../utils/AuthGuards";

import { SearchResults } from "../interfaces/SearchResults";
import { Pagination } from "../interfaces/Pagination";

import { BookSchema } from "../schemas/ResourceSchemas/book";
import { JournalSchema } from "../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../schemas/ResourceSchemas/Rider";

import { body, validationResult } from "express-validator";

router.get('/resource/', IsAuthenticated, body("text").notEmpty().isString(), body("page").notEmpty().isNumeric(),body("pageSize").notEmpty().isNumeric(), async (req, res) => {
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
        {
          $match: {
            $text: { $search: text }
          }
        },
        {
          $lookup: {
            from: "checkouts",
            localField: "_id",
            foreignField: "_id",
            as: "checkout_info"
          }
        },
        {
          $match: {
            "checkout_info": { $size: 0 } 
          }
        }
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
    console.error(error);
    res.status(500).json({ message: 'An error occurred while searching.' });
  }
});

export default router;
