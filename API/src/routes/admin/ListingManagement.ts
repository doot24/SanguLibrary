
import { Router, Request, Response } from "express";
const router = Router();

import { IsAuthenticated, HasRoles } from "../../utils/AuthGuards";
import { body, validationResult } from "express-validator";
import { CategorySchema } from "../../schemas/CategorySchema";

import { BookSchema } from "../../schemas/ResourceSchemas/book";
import { JournalSchema } from "../../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../../schemas/ResourceSchemas/Rider";

const excel = require('excel4node');
const { Readable } = require('stream');

interface Data {
  [key: string]: any;
}

router.get('/excel', IsAuthenticated, HasRoles(["admin", "editor"]), async (req, res) => {
  try {

    const aggregation : any = [
      {
        '$match': {}
      }, {
        '$project': {
          '_id': 0, 
          '__v': 0, 
          'resourceType': 0, 
          'resourceMeta': 0
        }
      }
    ]

    const booksResults = await BookSchema.aggregate(aggregation);
    const journalsResults = await JournalSchema.aggregate(aggregation);
    const dissertationsResults = await DissertationSchema.aggregate(aggregation);
    const ridersResults = await RiderSchema.aggregate(aggregation);
    
    const data: Data = {  };

    if (booksResults.length > 0) {
      data["Books"] = booksResults;
    }

    if (journalsResults.length > 0) {
      data["Journals"] = journalsResults;
    }

    if (dissertationsResults.length > 0) {
      data["Dissertations"] = dissertationsResults;
    }

    if (ridersResults.length > 0) {
      data["Riders"] = ridersResults;
    }

    const workbook = new excel.Workbook();

    for (const section in data) {
      if (data.hasOwnProperty(section)) {
        const sectionData = data[section];

        const worksheet = workbook.addWorksheet(section);

        const headers = Object.keys(sectionData[0]);

        headers.forEach((header, index) => {
          worksheet.cell(1, index + 1).string(header);
        });

        sectionData.forEach((row : any, rowIndex : any) => {
          headers.forEach((header, colIndex) => {
            worksheet.cell(rowIndex + 2, colIndex + 1).string(row[header].toString());
          });
        });
      }
    }

    const stream = await workbook.writeToBuffer();

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', 'attachment; filename=library.xlsx');

    const readableStream = new Readable();
    readableStream.push(stream);
    readableStream.push(null);
    readableStream.pipe(res);
  } catch (error) {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  }
});

export default router;
