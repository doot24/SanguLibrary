import { Router, Request, Response } from "express";
import { HasRoles, IsAuthenticated } from "../../utils/AuthGuards";
import { CheckoutSchema } from "../../schemas/CheckoutSchema";

import { body } from "express-validator";
import { Checkout } from "../../interfaces/Checkout";
import { randomUUID } from "crypto";
import { CheckoutPetitionSchema } from "../../schemas/PetitionSchema";
import { CheckoutPetition } from "../../interfaces/Petition";

import { BookSchema } from "../../schemas/ResourceSchemas/book";
import { JournalSchema } from "../../schemas/ResourceSchemas/Journal";
import { RiderSchema } from "../../schemas/ResourceSchemas/Rider";
import { DissertationSchema } from "../../schemas/ResourceSchemas/Dissertation";

const router = Router();

// used by editor to quckly create and confirm a checkout
router.post("/create", IsAuthenticated, HasRoles(["admin", "editor"]), body("student").notEmpty().isUUID(), body("type").notEmpty().isNumeric(), body("resource_id").notEmpty().isUUID(), body("return").notEmpty().isString(), async (req: Request, res: Response) => {
   try {

      let result: any = await CheckoutSchema.findOne({ resource_id: req.body.resource_id });

      if (result) {
         throw new Error("resource is already reserved!")
      }

      let newCheckout: Checkout = new Checkout();
      newCheckout._id = randomUUID();
      newCheckout.student = req.body.student;
      newCheckout.employee = String(req.session.user._id);
      newCheckout.dateIssued = String(Date.now());
      newCheckout.returnDate = String(req.body.return);
      newCheckout.resource = Number(req.body.type);
      newCheckout.resource_id = String(req.body.resource_id);

      let checkoutPetition = new CheckoutPetition();
      checkoutPetition._id = randomUUID();
      checkoutPetition.timestamp = Date.now()
      checkoutPetition.owner = req.body.student;
      checkoutPetition.status = "confirmed";
      checkoutPetition.text = "";
      checkoutPetition.comment = "";
      checkoutPetition.template = "";
      checkoutPetition.resource_id = String(req.body.resource_id);
      checkoutPetition.resource_type = Number(req.body.type);

      await new CheckoutSchema(newCheckout).save();
      await new CheckoutPetitionSchema(checkoutPetition).save();

      res.status(200).json({ status: "success" });
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
   }
});

router.post("/return", IsAuthenticated, HasRoles(["admin", "editor"]), body("cipher").notEmpty(), async (req: Request, res: Response) => {
   try {
       const bookPromise : any = await BookSchema.findOne({saveCipher : req.body.cipher});
       const journalPromise : any = await JournalSchema.findOne({saveCipher : req.body.cipher});
       const riderPromise : any = await RiderSchema.findOne({saveCipher : req.body.cipher});
       const dissertationPromise : any = await DissertationSchema.findOne({saveCipher : req.body.cipher});
       
       let id : string = "";
       if (bookPromise) {
         id = bookPromise._id;
       } else if (journalPromise) {
         id = journalPromise._id;
       } else if (riderPromise) {
         id = riderPromise._id;
       } else if (dissertationPromise) {
         id = dissertationPromise._id;
       }

       let result : any = await CheckoutSchema.findOneAndDelete({resource_id : id});

       if(!result)
       {
         throw new Error("no checkout found!");
       }

       res.status(200).json({ status: "success"});
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
   }
});

export default router;
