import { Router, Request, Response, query } from "express";
import { HasRoles, IsAuthenticated } from "../../utils/AuthGuards";
import { CheckoutSchema } from "../../schemas/CheckoutSchema";

import { body, check, param } from "express-validator";
import { Checkout } from "../../interfaces/Checkout";
import { randomUUID } from "crypto";

import { BookSchema } from "../../schemas/ResourceSchemas/book";
import { JournalSchema } from "../../schemas/ResourceSchemas/Journal";
import { RiderSchema } from "../../schemas/ResourceSchemas/Rider";
import { DissertationSchema } from "../../schemas/ResourceSchemas/Dissertation";
import { SendToUserSystem } from "../../utils/Notification";

const router = Router();

// used by editor to quckly create and confirm a checkout
router.post("/create", IsAuthenticated, HasRoles(["admin", "editor"]), body("cipher").notEmpty(), body("student").notEmpty().isUUID(), body("returnDate").notEmpty(), async (req: Request, res: Response) => {
   var errorMSG: string = "მოთხოვნის დამუშავება ვერ მოხერხდა!";

   try {

      const bookPromise: any = await BookSchema.findOne({ saveCipher: req.body.cipher });
      const journalPromise: any = await JournalSchema.findOne({ saveCipher: req.body.cipher });
      const riderPromise: any = await RiderSchema.findOne({ saveCipher: req.body.cipher });
      const dissertationPromise: any = await DissertationSchema.findOne({ saveCipher: req.body.cipher });

      let resource: any = null;

      if (bookPromise) {
         resource = bookPromise;
      } else if (journalPromise) {
         resource = journalPromise;
      } else if (riderPromise) {
         resource = riderPromise;
      } else if (dissertationPromise) {
         resource = dissertationPromise;
      }

      let result: any = await CheckoutSchema.findOne({ resource_id: resource._id });

      if (result) {
         errorMSG = "მასალა გატანილია!";
         throw new Error(errorMSG)
      }

      let newCheckout: Checkout = new Checkout();
      newCheckout._id = randomUUID();
      newCheckout.student = req.body.student;
      newCheckout.employee = String(req.session.user._id);
      newCheckout.dateIssued = Date.now();
      newCheckout.returnDate = req.body.returnDate;
      newCheckout.resource = Number(resource.resourceType);
      newCheckout.resource_id = String(resource._id);

      await new CheckoutSchema(newCheckout).save();

      res.status(200).json({ status: "success" });
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: errorMSG });
   }
});

import { ResourceType } from "../../interfaces/Resources";

// used by editor check who and what is requesting
router.get("/holdinfo", IsAuthenticated, HasRoles(["admin", "editor"]), param("holdid").notEmpty(), param("resource_type").notEmpty(), async (req: Request, res: Response) => {
   var errorMSG: string = "მოთხოვნის დამუშავება ვერ მოხერხდა!";
   
   try {

      let pipeline: any = [
         {
            '$match':
            {
               "_id": req.query.holdid
            }
            
         },
         {
            '$lookup': {
               'from': 'users',
               'localField': 'student',
               'foreignField': '_id',
               'as': 'student'
            }
         },
         {
            '$lookup': {
               'from': 'checkouts',
               'localField': 'student',
               'foreignField': 'student',
               'as': 'checkoutHistory'
            }
         }
      ]

      switch (Number(req.query.resource_type)) {
         case ResourceType.Book:
            pipeline.push({
               '$lookup': {
                  'from': 'books',
                  'localField': 'resource_id',
                  'foreignField': '_id',
                  'as': 'requestedResource'
               }
            },)
            break;
         case ResourceType.Journal:
            pipeline.push({
               '$lookup': {
                  'from': 'journals',
                  'localField': 'resource_id',
                  'foreignField': '_id',
                  'as': 'requestedResource'
               }
            },)
            break;
         case ResourceType.Dissertation:
            pipeline.push({
               '$lookup': {
                  'from': 'dissertations',
                  'localField': 'resource_id',
                  'foreignField': '_id',
                  'as': 'requestedResource'
               }
            },)
            break;
         case ResourceType.Rider:
            pipeline.push({
               '$lookup': {
                  'from': 'riders',
                  'localField': 'resource_id',
                  'foreignField': '_id',
                  'as': 'requestedResource'
               }
            },)
            break;
      }
      pipeline.push( {
         '$match': {
            'requestedResource': {
               '$ne': []
            }
         }
      });
      let holdInfo : any = await HoldSchema.aggregate(pipeline);
      res.status(200).json({ status: "success", holdInfo });
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: errorMSG });
   }
});

import { Pagination } from "../../interfaces/Pagination";
router.get("/holds", IsAuthenticated, HasRoles(["admin", "editor"]), param("page").notEmpty(), param("pageSize").notEmpty(), async (req: Request, res: Response) => {
   var errorMSG: string = "მოთხოვნის დამუშავება ვერ მოხერხდა!";
   const { page, pageSize }: any = req.query; 

   try {

      let holds : any = await HoldSchema.find();
      const totalResults = holds.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = holds.slice(startIndex, endIndex);

      const pagination: Pagination = {
         totalPages: Math.ceil(totalResults / pageSize),
         currentPage: page,
       };

      res.status(200).json({ status: "success", holds : paginatedResults, pagination });
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: errorMSG });
   }
});

import { HoldSchema } from "../../schemas/HoldSchema";

router.post("/setcheckout", IsAuthenticated, HasRoles(["admin", "editor"]), body("holdid").notEmpty(), body("resource_type").notEmpty(),body("status").notEmpty(), body("returnDate").notEmpty(), async (req: Request, res: Response) => {
   let errorMSG = "მოთხოვნის დამუშავება ვერ მოხერხდა!"
   try {
      let hold : any = await HoldSchema.findOne({_id : req.body.holdid});
      let result: any = await CheckoutSchema.findOne({ resource_id: hold.resource_id });

      if (result) {
         errorMSG = "მასალა გატანილია!";
         throw new Error(errorMSG)
      }

      if(!hold)
      {
         errorMSG = "რეზერვი არ არსებობს!";
         throw new Error(errorMSG)
      }

      let status : String = req.body.status;
      
      if(status === "confirmed")
      {
         let checkout : Checkout = new Checkout();
         checkout._id = randomUUID();
         checkout.dateIssued = Date.now();
         checkout.employee = String(req.session.user._id);
         checkout.resource = Number(req.body.resource_type);
         checkout.resource_id = hold.resource_id;
         checkout.returnDate = req.body.returnDate
         checkout.student = hold.student;
        
         await new CheckoutSchema(checkout).save();
         await HoldSchema.findOneAndDelete({_id : hold._id});
        
         SendToUserSystem(hold.student, "გატანის განცხადება", "მასალის გატანის განცხადება დადასტურდა მობრძანდით ბიბლიოთეკაში და გაიტანეთ! ");

         return res.status(200).json({ status: "success" });
      }
      SendToUserSystem(hold.student, "გატანის განცხადება", "მასალის გატანის მოთხოვნა ვერ დადასტურდა! ");
      res.status(200).json({ status: "success" });
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: errorMSG });
   }
});

router.post("/return", IsAuthenticated, HasRoles(["admin", "editor"]), body("cipher").notEmpty(), async (req: Request, res: Response) => {
   let errorMSG = "მოთხოვნის დამუშავება ვერ მოხერხდა!"
   
   try {
      const bookPromise: any = await BookSchema.findOne({ saveCipher: req.body.cipher });
      const journalPromise: any = await JournalSchema.findOne({ saveCipher: req.body.cipher });
      const riderPromise: any = await RiderSchema.findOne({ saveCipher: req.body.cipher });
      const dissertationPromise: any = await DissertationSchema.findOne({ saveCipher: req.body.cipher });

      let id: string = "";
      if (bookPromise) {
         id = bookPromise._id;
      } else if (journalPromise) {
         id = journalPromise._id;
      } else if (riderPromise) {
         id = riderPromise._id;
      } else if (dissertationPromise) {
         id = dissertationPromise._id;
      }

      let result: any = await CheckoutSchema.findOneAndDelete({ resource_id: id });

      if (!result) {
         errorMSG = "მოცემული რესურსი ვერ მოიძებნა!";
         throw new Error(errorMSG);
      }

      res.status(200).json({ status: "success" });
   }
   catch (error) {
      res.status(400).json({ status: "fail", message: errorMSG });
   }
});

export default router;
