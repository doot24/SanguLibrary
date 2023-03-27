import { NotificationMetaDataSchema, NotificationSchema } from '../schemas/NotificationSchema';
import { Notification, NotificationMetaData } from '../interfaces/Notification';
import { randomUUID } from "crypto";

export function SendToUser(userid: string, author: string, title: string, text: string): Promise<any> {
  let notification = new Notification();
  notification._id = randomUUID();
  notification.author = author;
  notification.created = Date.now();
  notification.title = title;
  notification.text = text;

  let meta = new NotificationMetaData();
  meta._id = randomUUID();
  meta.attachedNotification = notification._id;
  meta.receiver = userid;

  return new NotificationSchema(notification)
    .save()
    .then(() => new NotificationMetaDataSchema(meta).save())
    .catch(() => {
      throw new Error('Failed to save the notification and its metadata.');
    });
}