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
        let booksResults : any = await BookSchema.find();
        let journalsResults : any = await JournalSchema.find();
        let dissertationsResults : any = await DissertationSchema.find();
        let ridersResults : any = await RiderSchema.find();

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
