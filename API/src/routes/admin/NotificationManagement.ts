import { Router, Request, Response } from "express";
const router = Router();

import { body,query, validationResult } from 'express-validator';
import { IsAuthenticated, HasRole,HasRoles } from "../../utils/AuthGuards";
import { randomUUID } from "crypto";

import { Notification, NotificationMetaData } from "../../interfaces/Notification";
import { NotificationSchema, NotificationMetaDataSchema } from "../../schemas/NotificationSchema";
import { UserSchema } from "../../schemas/UserSchema";

router.get("/", IsAuthenticated, HasRoles(["admin", "editor", "employee"]), query("page").notEmpty().isNumeric(), query("pageSize").notEmpty().isNumeric(), (req: Request, res: Response) => {
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
      $match: {
        author: { $ne: "სისტემა" }
      }
    },
    {
      $skip: startIndex
    },
    {
      $limit: pageSize
    }
  ];
  

  // execute the aggregation pipeline with pagination stages
  NotificationSchema.aggregate(agg).then((results) => {
    NotificationSchema.countDocuments({ author: { $ne: "სისტემა" } }).exec().then((totalNotifications) => {
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


router.post("/createglobal", IsAuthenticated, HasRoles(["admin", "editor"]), body("title").notEmpty().isString(), body("text").notEmpty().isString(), (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: "error", message: "მოთხოვნის ფორმატი არასწორია!" });
  }

  let notification: Notification = new Notification();
  notification._id = randomUUID();
  notification.author = req.session.user.firstName + " " + req.session.user.lastName;
  notification.title = req.body.title;
  notification.text = req.body.text;

  new NotificationSchema(notification).save().then(() => {
    // insert multiple metadata
    return UserSchema.find().then((results) => {
      const notifications : Array<NotificationMetaData> = results.map((user) => ({
        _id : randomUUID(),
        created : Date.now(),
        attachedNotification : notification._id,
        receiver : user._id,
        read : false
      }));

      return NotificationMetaDataSchema.insertMany(notifications)
        .then(() => {
          res.status(200).json({ status: "success" });
        });
    });
  }).catch(() => {
    res.status(400).json({ status: "fail", message: "მოთხოვნის დამუშავება ვერ მოხერხდა!" });
  });
});

export default router;
