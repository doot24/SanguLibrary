import { Router, Request, Response } from "express";
import { IsAuthenticated } from "../utils/AuthGuards";
import { CheckoutPetition } from "../interfaces/Petition";

import { CheckoutSchema } from "../schemas/CheckoutSchema";
import { CheckoutPetitionSchema } from "../schemas/PetitionSchema";

import { Hold } from "../interfaces/Hold";
import { HoldSchema } from "../schemas/HoldSchema";

import { body, validationResult } from "express-validator";
import { randomUUID } from "crypto";
import { SendToSystem } from "../utils/Notification";

const router = Router();

router.post("/create", IsAuthenticated, body("resource_id").notEmpty(), body("type").notEmpty(), async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
        }
        let checkouts: number = await CheckoutSchema.countDocuments({ student: req.session.user._id });
        if (checkouts > 3) {
            throw new Error("limit reached");
        }

        let result: any = await CheckoutSchema.findOne({ resource_id: req.body.resource_id });

        if (result) {
            throw new Error("resource is already taken!")
        }

        let holdCheck : any = await HoldSchema.findOne({resource_id : req.body.resource_id});

        if (holdCheck) {
            throw new Error("resource is already reserved!")
        }

        let hold : Hold = new Hold();
        hold._id = randomUUID();
        hold.dateIssued = Date.now();
        hold.resource_id = String(req.body.resource_id);
        hold.resource = Number(req.body.type);
        hold.student = String(req.session.user._id);
        
        await new HoldSchema(hold).save();

        // send petition to user
        let checkoutPetition = new CheckoutPetition();
        checkoutPetition._id = randomUUID();
        checkoutPetition.timestamp = Date.now()
        checkoutPetition.owner = req.session.user._id
        checkoutPetition.status = "pending";
        checkoutPetition.text = "";
        checkoutPetition.comment = "";
        checkoutPetition.template = "sys_checkout";
        checkoutPetition.resource_id = String(req.body.resource_id);
        checkoutPetition.resource_type = Number(req.body.type);

        // send petition to admin/librarian
        SendToSystem("ახალი განცხადება",["admin", "editor", "employee"],`ბიბლიოთეკაში შემოვიდა ახალი განცხადება`);

        await new CheckoutPetitionSchema(checkoutPetition).save();

        res.status(200).json({ status: "success" });
    }
    catch (error) {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    }
});

export default router;
