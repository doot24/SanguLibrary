import { Router, Request, Response } from "express";
const router = Router();

import { body, query, validationResult } from 'express-validator';
import { IsAuthenticated } from "../utils/AuthGuards";

import { NotificationMetaDataSchema } from "../schemas/NotificationSchema";
import { PipelineStage } from "mongoose";

router.get("/", IsAuthenticated, query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
    }

    let page = Number(req.query.page) || 1;
    let pageSize = Number(req.query.pageSize) || 10;
    let startIndex = (page - 1) * pageSize;
    let endIndex = page * pageSize;

    let readStatus : Number = Number(req.query.read);
    let timeSpan : Number = Number(req.query.time);

    const startTime = new Date(Date.now() - Number(timeSpan)); 
    const startDate = startTime.getTime();  
    
    const endDate = Date.now();

    // add pagination stages to the pipeline
    let pipeline : Array<PipelineStage> = [];

    pipeline.push({ $match: { receiver: req.session.user._id } });
    if(req.query.read)
    {
        pipeline.push({ $match: { read: readStatus } });
    }
    pipeline.push({
      $lookup: {
        from: 'notifications',
        localField: 'attachedNotification',
        foreignField: '_id',
        as: 'notification'
      }
    });
    if(req.query.time)
    {
        pipeline.push({
          $match: {
            'notification.created': {
              $gte: startDate,
              $lte: endDate
            }
          }
        });
    }
    pipeline.push({$sort : {'notification.created': -1}});
    pipeline.push({ $skip: startIndex });
    pipeline.push({ $limit: pageSize });
    pipeline.push({
        $facet: {
          totalCount: [
            { $count: 'count' }
          ],
          results: [
            { $skip: startIndex },
            { $limit: pageSize }
          ]
        }
    });

    // execute the aggregation pipeline with pagination stages
    NotificationMetaDataSchema.aggregate(pipeline).then((results) => {
        if (results[0].results.length == 0) {
            return res.status(200).json({
                status: "success",
                notifications: [],
                totalNotifications: 0,
                totalPages: 0,
                currentPage: page,
                hasPreviousPage: false,
                hasNextPage: false
            });
        }
        const totalCount = results[0].totalCount[0].count;
        const data = results[0].results;
      
        return res.status(200).json({
          status: "success",
          notifications: data,
          totalNotifications: totalCount,
          totalPages: Math.ceil(totalCount / pageSize),
          currentPage: page,
          hasPreviousPage: page > 1,
          hasNextPage: endIndex < totalCount
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
            receiver: req.session.user._id
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
        { $match: { read: Number(req.query.read), receiver: req.session.user._id } },
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
