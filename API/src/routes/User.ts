import { Router, Request, Response } from "express";
import { IsAuthenticated } from "../utils/AuthGuards";
import { UserSchema } from "../schemas/UserSchema";

const router = Router();

router.get("/profile", IsAuthenticated, (req: Request, res: Response) => {
    if(!req.session.user)
    {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
        return;
    }
    UserSchema.findOne({_id : req.session.user._id}).then((userResult) => {
        res.status(200).json({status : "success", user : userResult});
    }).catch(()=>{
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    })
});

router.get("/active", (req: Request, res: Response) => {
    const isActive: boolean = (req.session.user) === undefined;
    const expires = req.session.cookie.expires;
    let maintimeout : any = "0";
    if (expires) {
    const timeout = new Date(expires);
    maintimeout = timeout.toLocaleString('en-US', { timeZone: 'Asia/Tbilisi' });
    } 
    res.status(200).json({active : !isActive, timeout : maintimeout});
});

import { CheckoutSchema } from "../schemas/CheckoutSchema";
router.get("/checkouts", IsAuthenticated, async (req: Request, res: Response) => {
    try
    {
        let agg = [
            {
                "$match" : {
                    "student" : req.session.user._id
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

          let checkouts : any = await CheckoutSchema.aggregate(agg);
          res.status(200).json({ status: "success", checkouts });
    }
    catch(error)
    {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    }
    // CheckoutSchema.find({student : req.session.user._id}).then((Result) => {
    //     res.status(200).json({status : "success", checkouts : Result});
    // }).catch(()=>{
    //     res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    // })
});

router.get("/active", (req: Request, res: Response) => {
    const isActive: boolean = (req.session.user) === undefined;
    res.status(200).json({active : !isActive});
});

export default router;
