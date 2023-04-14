
import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated } from "../utils/AuthGuards";

import { SearchResults } from "../interfaces/SearchResults";
import { Pagination } from "../interfaces/Pagination";

import { BookSchema } from "../schemas/ResourceSchemas/book";
import { JournalSchema } from "../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../schemas/ResourceSchemas/Rider";

router.get('/resource/', IsAuthenticated, async (req: Request, res: Response) => {

  try {
    if (!req.query) {
      throw new Error("no params provided");
    }

    const { text } = req.query;

    const queryText = text?.toString() ?? '';

    let page = Number(req.query.page) || 1;
    let pageSize = Number(req.query.pageSize) || 10;
    let startIndex = (page - 1) * pageSize;

    const results: SearchResults = new SearchResults();

    const agg: any = [
      {
        $match: {
          $text: { $search: String(queryText) }
        }
      },
      {
        $lookup: {
          from: 'checkouts',
          localField: '_id',
          foreignField: 'resource_id',
          as: 'checkout'
        }
      },
      {
        $match: {
          $expr: {
            $eq: [{ $size: '$checkout' }, 0]
          }
        }
      },
      {
        $project: {
          checkout: 0
        }
      },
      {
        $skip: startIndex
      },
      {
        $limit: pageSize
      }
    ];


    const bookPromise = BookSchema.aggregate(agg);
    const journalPromise = JournalSchema.aggregate(agg);
    const riderPromise = RiderSchema.aggregate(agg);
    const dissertationPromise = DissertationSchema.aggregate(agg);

    const countPromise = Promise.all([
      BookSchema.countDocuments(agg),
      JournalSchema.countDocuments(agg),
      RiderSchema.countDocuments(agg),
      DissertationSchema.countDocuments(agg),
    ]);

    const [books, journals, riders, dissertations] = await Promise.all([bookPromise, journalPromise, riderPromise, dissertationPromise]);
    const [bookCount, journalCount, riderCount, dissertationCount] = await countPromise;

    results.books.data = books;
    results.books.amount = bookCount;

    results.journals.data = journals;
    results.journals.amount = journalCount;

    results.riders.data = riders;
    results.riders.amount = riderCount;

    results.dissertations.data = dissertations;
    results.dissertations.amount = dissertationCount;

    // paginate results.
    let totalAmount: number = (results.books.amount + results.journals.amount + results.riders.amount + results.dissertations.amount);

    let paginationData: Pagination = new Pagination();
    paginationData.currentPage = page;
    paginationData.totalPages = Math.ceil(totalAmount / pageSize);

    const final: any[] = [...results.books.data, ...results.journals.data, ...results.dissertations.data, ...results.riders.data];

    res.status(200).json({ status: "success", paginationData, results: final });
  }
  catch (err) {
    let paginationData: Pagination = new Pagination();
    paginationData.currentPage = 1;
    paginationData.totalPages = 1;

    res.status(200).json({ status: "success", paginationData, results: [] });
  }
});

export default router;