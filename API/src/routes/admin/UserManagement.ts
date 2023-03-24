import { Router, Request, Response } from "express";
const router = Router();

import { body, query, validationResult } from 'express-validator';
import { validateUpdateUser } from "../validations/UserManagementValidation";
import { IsAuthenticated, HasRole } from "../../utils/AuthGuards";

import { UserSchema } from "../../schemas/UserSchema";


router.post('/setroles', IsAuthenticated, HasRole("admin"), validateUpdateUser, (req: Request, res: Response) => {
    const roles: Array<string> = JSON.parse(req.body.roles);
    const userID: string = String(req.body.userid);

    UserSchema.findOneAndUpdate(
        { userid: userID },
        { $set: { roles: roles } },
        { new: true }
    ).then(() => {
        res.status(200).json({ status: "success" });
    }).catch(() => {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    });
});

router.post("/delete", IsAuthenticated, HasRole("admin"), body("userid").notEmpty().isUUID(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }
    UserSchema.deleteOne({ userid: req.body.userid }).then(() => {
        res.status(200).json({ status: "success" });

    }).catch(() => {
        res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
    })
});

router.get("/search/publicnum", IsAuthenticated, HasRole("admin"), query("publicNum").notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    UserSchema.findOne({ publicNumber: req.query.publicNum }).then((userResult) => {
        if (!userResult) {
            return res.status(400).json({
                status: "fail",
                message: "მომხმარებელი არ არსებობს!"
            });
        }

        res.status(200).json({
            status: "success",
            user: userResult
        });
    })
        .catch(() => {
            res.status(400).json({
                status: "fail",
                message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
            });
        });
});

router.get("/search/phonenum", IsAuthenticated, HasRole("admin"), query("phoneNum").notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    UserSchema.findOne({ phoneNumber: req.query.phoneNum }).then((userResult) => {
        if (!userResult) {
            return res.status(400).json({
                status: "fail",
                message: "მომხმარებელი არ არსებობს!"
            });
        }

        res.status(200).json({
            status: "success",
            user: userResult
        });
    })
        .catch(() => {
            res.status(400).json({
                status: "fail",
                message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
            });
        });
});

router.get("/users", IsAuthenticated, HasRole("admin"), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    let page = Number(req.query.page) || 1;
    let pageSize = Number(req.query.pageSize) || 10;
    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    // add pagination stages to the pipeline
    const agg = [
        {
            '$match': {}
        },
        {
            '$unset': '__v'
        },
        {
            '$skip': startIndex
        },
        {
            '$limit': pageSize
        }
    ]

    UserSchema.aggregate(agg).then((results) => {
        UserSchema.countDocuments({}).exec().then((totalUsers) => {
            return res.status(200).json({
                status: "success",
                users: results,
                totalusers: totalUsers,
                totalPages: Math.ceil(totalUsers / pageSize),
                currentPage: page,
                hasPreviousPage: page > 1,
                hasNextPage: endIndex < totalUsers
            });
        })
    }).catch(() => {
        res.status(400).json({
            status: "fail",
            message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
        });
    });

});

export default router;
