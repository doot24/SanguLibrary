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
    res.status(200).json({active : !isActive});
});

import { CheckoutSchema } from "../schemas/CheckoutSchema";
router.get("/checkouts", IsAuthenticated, (req: Request, res: Response) => {
    CheckoutSchema.find({student : req.session.user._id}).then((Result) => {
        res.status(200).json({status : "success", checkouts : Result});
    }).catch(()=>{
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    })
});

router.get("/active", (req: Request, res: Response) => {
    const isActive: boolean = (req.session.user) === undefined;
    res.status(200).json({active : !isActive});
});

export default router;
