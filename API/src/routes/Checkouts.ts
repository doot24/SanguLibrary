import { Router, Request, Response } from "express";
import { IsAuthenticated } from "../utils/AuthGuards";

import { CheckoutSchema } from "../schemas/CheckoutSchema";

import { Hold } from "../interfaces/Hold";
import { HoldSchema } from "../schemas/HoldSchema";

import { body, validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { SendToSystem } from "../utils/Notification";
import { ResourceType } from "../interfaces/Resources";
import { BookSchema } from "../schemas/ResourceSchemas/book";
import { JournalSchema } from "../schemas/ResourceSchemas/Journal";
import { DissertationSchema } from "../schemas/ResourceSchemas/Dissertation";
import { RiderSchema } from "../schemas/ResourceSchemas/Rider";
const router = Router();

router.post("/create", IsAuthenticated, body("resource_id").notEmpty(), body("type").notEmpty(), async (req: Request, res: Response) => {
    let errorMSG = "მოთხოვნის დამუშავება ვერ მოხერხდა!";

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
        }
        let checkouts: number = await CheckoutSchema.countDocuments({ student: req.session.user._id });
        let holds: number = await HoldSchema.countDocuments({ student: req.session.user._id });

        if(holds === 1)
        {
            errorMSG = "დაჯავშნის ლიმიტს მიწვდით!";
            throw new Error(errorMSG);
        }

        if (checkouts === 3) {
            errorMSG = "გატანის ლიმიტს მიწვდით!";
            throw new Error(errorMSG);
        }

        let result: any = await CheckoutSchema.findOne({ resource_id: req.body.resource_id });

        if (result) {
            errorMSG = "მოცემული რესურსი გატანილია!";
            throw new Error(errorMSG)
        }

        let holdCheck : any = await HoldSchema.findOne({resource_id : req.body.resource_id});

        if (holdCheck) {
            errorMSG = "მოცემული რესურსი დაჯავშნილია!";
            throw new Error(errorMSG)
        }

         let results : any;

        switch (Number(req.body.resource_type)) {
            case ResourceType.Book:
                results = await BookSchema.findOne({_id:req.body.resource_id})
               break;
            case ResourceType.Journal:
                results = await JournalSchema.findOne({_id:req.body.resource_id})
               break;
            case ResourceType.Dissertation:
                results = await DissertationSchema.findOne({_id:req.body.resource_id})
               break;
            case ResourceType.Rider:
                results = await RiderSchema.findOne({_id:req.body.resource_id})
               break;
         }

        let hold : Hold = new Hold();
        hold._id = randomUUID();
        hold.dateIssued = Date.now();
        hold.resource_id = String(req.body.resource_id);
        hold.resource = Number(req.body.type);
        hold.student = String(req.session.user._id);
        
        await new HoldSchema(hold).save();

        SendToSystem("ახალი გატანის მოთხოვნა",["admin", "editor", "employee"],`ბიბლიოთეკაში შემოვიდა ახალი გატანის მოთხოვნა`);

        res.status(200).json({ status: "success" });
    }
    catch (error) {
        res.status(400).json({ status: "fail", message: errorMSG });
    }
});

export default router;
