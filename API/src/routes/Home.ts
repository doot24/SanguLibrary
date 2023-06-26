import { Router, Request, Response } from "express";
import { IsNotAuthenticated, IsAuthenticated } from "../utils/AuthGuards";

import { CategorySchema } from "../schemas/CategorySchema";
import { BookSchema } from "../schemas/ResourceSchemas/book";
import { JournalSchema } from "../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../schemas/ResourceSchemas/Rider";

const router = Router();

router.get("/sections", IsAuthenticated,  async (req: Request, res: Response) => {
    try
    {
        let agg : any = [{
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
              "checkout_info":0,
              "resourceMeta":0,
              "__v":0,
            }
          }];

        let booksResults : any = await BookSchema.aggregate(agg);
        let journalsResults : any = await JournalSchema.aggregate(agg);
        let dissertationsResults : any = await DissertationSchema.aggregate(agg);
        let ridersResults : any = await RiderSchema.aggregate(agg);

        let response : any = [
            {title : "წიგნები", data : booksResults},
            {title : "ჟურნალები", data : journalsResults},
            {title : "დისერტაციები", data : dissertationsResults},
            {title : "რიდერები", data : ridersResults},
        ]

        res.status(200).json({status : "success", sections : response});
    } 
    catch(error)
    {
        res.status(400).json({
            status: "fail",
            message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
          });
    }
});

export default router;
