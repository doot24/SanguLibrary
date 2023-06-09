import { Router, Request, Response,  } from "express";
import { HasRoles, IsAuthenticated } from "../../utils/AuthGuards";
import { CheckoutSchema } from "../../schemas/CheckoutSchema";

import { body, validationResult, check, query, param } from "express-validator";
import { Checkout } from "../../interfaces/Checkout";
import { randomUUID } from "crypto";

import { BookSchema } from "../../schemas/ResourceSchemas/book";
import { JournalSchema } from "../../schemas/ResourceSchemas/Journal";
import { RiderSchema } from "../../schemas/ResourceSchemas/Rider";
import { DissertationSchema } from "../../schemas/ResourceSchemas/Dissertation";
import { SendToUserSystem } from "../../utils/Notification";
import { ResourceType } from "../../interfaces/Resources";
import { Pagination } from "../../interfaces/Pagination";
import { UserSchema } from "../../schemas/UserSchema";
import { HoldSchema } from "../../schemas/HoldSchema";

const router = Router();

router.get("/holds", IsAuthenticated, HasRoles(["admin", "editor"]), param("page").notEmpty(), param("pageSize").notEmpty(), async (req: Request, res: Response) => {
   var errorMSG: string = "მოთხოვნის დამუშავება ვერ მოხერხდა!";
   const { page, pageSize }: any = req.query;

   try {

      let agg = [
         {
            '$match': { }
          },
         {
           '$lookup': {
             'from': 'users',
             'localField': 'student',
             'foreignField': '_id',
             'as': 'studentInfo'
           }
         },
         {
           '$lookup': {
             'from': 'checkouts',
             'localField': 'student',
             'foreignField': 'student',
             'as': 'checkoutHistory'
           }
         },
         {
           '$lookup': {
             'from': 'journals',
             'let': { 'resource_id': '$resource_id' },
             'pipeline': [
               { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
             ],
             'as': 'journalResources'
           }
         },
         {
           '$lookup': {
             'from': 'books',
             'let': { 'resource_id': '$resource_id' },
             'pipeline': [
               { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
             ],
             'as': 'bookResources'
           }
         },
         {
           '$lookup': {
             'from': 'dissertations',
             'let': { 'resource_id': '$resource_id' },
             'pipeline': [
               { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
             ],
             'as': 'dissertationResources'
           }
         },
         {
           '$lookup': {
             'from': 'riders',
             'let': { 'resource_id': '$resource_id' },
             'pipeline': [
               { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
             ],
             'as': 'riderResources'
           }
         },
         {
            '$addFields': {
              'attachedResource': {
                '$concatArrays': [
                  '$journalResources',
                  '$bookResources',
                  '$dissertationResources',
                  '$riderResources'
                ]
              }
            }
          },
          {
            '$project': {
              'journalResources': 0,
              'bookResources': 0,
              'dissertationResources': 0,
              'riderResources': 0
            }
          }
       ];
       
       
       
      let holds: any = await HoldSchema.aggregate(agg);

      const totalResults = holds.length;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedResults = holds.slice(startIndex, endIndex);
      
      const pagination: Pagination = {
         totalPages: Math.ceil(totalResults / pageSize),
         currentPage: page,
      };

      res.status(200).json({ status: "success", holds: paginatedResults, pagination });
   }
   catch (error) {
      console.error(error)
      res.status(400).json({ status: "fail", message: errorMSG });
   }
});

router.get("/checkouts", IsAuthenticated, HasRoles(["admin", "editor"]), param("page").notEmpty(), param("pageSize").notEmpty(), async (req: Request, res: Response) => {
  var errorMSG: string = "მოთხოვნის დამუშავება ვერ მოხერხდა!";
  const { page, pageSize }: any = req.query;

  try {

     let agg = [
        {
          '$lookup': {
            'from': 'users',
            'localField': 'student',
            'foreignField': '_id',
            'as': 'studentInfo'
          }
        },
        {
          '$lookup': {
            'from': 'users',
            'localField': 'employee',
            'foreignField': '_id',
            'as': 'employeeInfo'
          }
        },
        {
          '$lookup': {
            'from': 'journals',
            'let': { 'resource_id': '$resource_id' },
            'pipeline': [
              { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
            ],
            'as': 'journalResources'
          }
        },
        {
          '$lookup': {
            'from': 'books',
            'let': { 'resource_id': '$resource_id' },
            'pipeline': [
              { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
            ],
            'as': 'bookResources'
          }
        },
        {
          '$lookup': {
            'from': 'dissertations',
            'let': { 'resource_id': '$resource_id' },
            'pipeline': [
              { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
            ],
            'as': 'dissertationResources'
          }
        },
        {
          '$lookup': {
            'from': 'riders',
            'let': { 'resource_id': '$resource_id' },
            'pipeline': [
              { '$match': { '$expr': { '$eq': ['$_id', '$$resource_id'] } } }
            ],
            'as': 'riderResources'
          }
        },
        {
           '$addFields': {
             'attachedResource': {
               '$concatArrays': [
                 '$journalResources',
                 '$bookResources',
                 '$dissertationResources',
                 '$riderResources'
               ]
             }
           }
         },
         {
           '$project': {
             'journalResources': 0,
             'bookResources': 0,
             'dissertationResources': 0,
             'riderResources': 0,
             'employee':0,
             'student':0,
             'resource':0,
             'resource_id':0,
             '__v0':0,
             'studentInfo.roles':0,
             'studentInfo.__v0':0,
             'employeeInfo.roles':0,
             'employeeInfo.__v0':0
           }
         }
      ];
      
      
      
     let holds: any = await CheckoutSchema.aggregate(agg);

     const totalResults = holds.length;
     const startIndex = (page - 1) * pageSize;
     const endIndex = startIndex + pageSize;
     const paginatedResults = holds.slice(startIndex, endIndex);
     
     const pagination: Pagination = {
        totalPages: Math.ceil(totalResults / pageSize),
        currentPage: page,
     };

     res.status(200).json({ status: "success", checkouts: paginatedResults, pagination });
  }
  catch (error) {
     console.error(error)
     res.status(400).json({ status: "fail", message: errorMSG });
  }
});

router.post("/setcheckout", IsAuthenticated, HasRoles(["admin", "editor"]), body("holdid").notEmpty(), body("resource_type").notEmpty(), body("status").notEmpty(), body("returnDate").notEmpty(), async (req: Request, res: Response) => {
   let errorMSG = "მოთხოვნის დამუშავება ვერ მოხერხდა!"
   try {
      let hold: any = await HoldSchema.findOne({ _id: req.body.holdid });
      let result: any = await CheckoutSchema.findOne({ resource_id: hold.resource_id });

      if (result) {
         errorMSG = "მასალა გატანილია!";
         throw new Error(errorMSG)
      }

      if (!hold) {
         errorMSG = "რეზერვი არ არსებობს!";
         throw new Error(errorMSG)
      }

      let status: String = req.body.status;

      if (status === "confirmed") {
         let checkout: Checkout = new Checkout();
         checkout._id = randomUUID();
         checkout.dateIssued = Date.now();
         checkout.employee = String(req.session.user._id);
         checkout.resource = Number(req.body.resource_type);
         checkout.resource_id = hold.resource_id;
         checkout.returnDate = req.body.returnDate
         checkout.student = hold.student;

         await new CheckoutSchema(checkout).save();
         await HoldSchema.findOneAndDelete({ _id: hold._id });

         SendToUserSystem(hold.student, "გატანის განცხადება", "მასალის გატანის განცხადება დადასტურდა მობრძანდით ბიბლიოთეკაში და გაიტანეთ! ");

         return res.status(200).json({ status: "success" });
      }
      await HoldSchema.findOneAndDelete({_id : req.body.holdid});
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
