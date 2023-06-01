import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated } from "../utils/AuthGuards";

import { SearchResults } from "../interfaces/SearchResults";
import { Pagination } from "../interfaces/Pagination";

import { BookSchema } from "../schemas/ResourceSchemas/book";
import { JournalSchema } from "../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../schemas/ResourceSchemas/Rider";

router.get('/resource/', IsAuthenticated, async (req, res) => {
  const { text, page, pageSize }: any = req.query; // Get search term, page, and pageSize from query parameters

  try {
    const collections: any[] = [BookSchema, JournalSchema, DissertationSchema, RiderSchema];
    const searchResults: SearchResults[] = [];

    for (const schema of collections) {
      const results = await schema.find({ $text: { $search: text } }).lean();
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
