import { Router, Request, Response } from "express";
const router = Router();

import { body, query, validationResult } from 'express-validator';
import { IsAuthenticated } from "../utils/AuthGuards";

import { NotificationMetaDataSchema } from "../schemas/NotificationSchema";

router.get("/", IsAuthenticated, query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
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
            '$match': {
                'receiver': req.session.user.userid
            }
        },
        {
            '$lookup': {
                'from': 'notifications',
                'localField': 'attachedNotification',
                'foreignField': '_id',
                'as': 'notification'
            }
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
    ];

    // execute the aggregation pipeline with pagination stages
    NotificationMetaDataSchema.aggregate(agg).then((results) => {
        NotificationMetaDataSchema.countDocuments({ receiver: req.session.user.userid }).exec().then((totalNotifications) => {
            return res.status(200).json({
                status: "success",
                notifications: results,
                totalNotifications: totalNotifications,
                totalPages: Math.ceil(totalNotifications / pageSize),
                currentPage: page,
                hasPreviousPage: page > 1,
                hasNextPage: endIndex < totalNotifications
            });
        });
    }).catch(() => {
        res.status(400).json({
            status: "fail",
            message: "მოთხოვნის დამუშავება ვერ მოხერხდა!"
        });
    });
});

router.post("/setread", IsAuthenticated, body("notificationid").notEmpty().isUUID(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    NotificationMetaDataSchema.findOneAndUpdate(
        {
            _id: req.body.notificationid,
            receiver: req.session.user.userid
        },
        {
            $set: { read: true }
        },
        { new: true }
    ).then((updatedNotification) => {
        if (!updatedNotification) {
            return res.status(404).json({
                status: "fail",
                message: "შეტყობინება ვერ მოიძებნა!"
            });
        }
        res.status(200).json({
            status: "success"
        });
    }).catch((error) => {
        res.status(400).json({
            status: "fail",
            message: "შეტყობინების სტატუსის განახლება ვერ მოხერხდა"
        });
    });
});

router.get("/status", IsAuthenticated, query("read").notEmpty().isNumeric(), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    let page = Number(req.query.page) || 1;
    let pageSize = Number(req.query.pageSize) || 10;
    let endIndex = page * pageSize;

    let pipeline = [
        { $match: { read: Number(req.query.read), receiver: req.session.user.userid } },
        {
            '$lookup': {
                'from': 'notifications',
                'localField': 'attachedNotification',
                'foreignField': '_id',
                'as': 'notification'
            }
        },
        { $skip: (page - 1) * pageSize },
        { $limit: pageSize },
        {
            '$unset': '__v'
        }
    ];

    NotificationMetaDataSchema.aggregate(pipeline).then((notifications) => {
        res.status(200).json({
            status: "success",
            notifications: notifications,
            currentPage: page,
            totalPages: Math.ceil(notifications.length / pageSize),
            hasPreviousPage: page > 1,
            hasNextPage: notifications.length > endIndex
        });
    }).catch(() => {
        res.status(400).json({
            status: "fail",
            message: "შეტყობინების მოძებნა ვერ მოხერხდა"
        });
    });
});

export default router;
