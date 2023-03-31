import { NotificationMetaDataSchema, NotificationSchema } from '../schemas/NotificationSchema';
import { Notification, NotificationMetaData } from '../interfaces/Notification';
import { randomUUID } from "crypto";
import { UserSchema } from '../schemas/UserSchema';
import { User } from '../interfaces/User';

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

export function SendToSystem(title: string, text: string): Promise<void> {
  let notification = new Notification();
  notification._id = randomUUID();
  notification.author = "სისტემა";
  notification.created = Date.now();
  notification.title = title;
  notification.text = text;

  return UserSchema.find({ roles: "editor" })
    .then((results) => {
      const metadataDocs = results.map((user: User) => {
        let meta = new NotificationMetaData();
        meta._id = randomUUID();
        meta.attachedNotification = notification._id;
        meta.receiver = user.userid;
        return meta;
      });

      return Promise.all([
        new NotificationSchema(notification).save(),
        NotificationMetaDataSchema.insertMany(metadataDocs),
      ]);
    })
    .then(() => {
      return;
    })
    .catch(() => {
      throw new Error("Failed to save the notifications and their metadata.");
    });
}
