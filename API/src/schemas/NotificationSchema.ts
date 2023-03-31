import mongoose, { Schema } from 'mongoose';
import { Notification, NotificationMetaData } from '../interfaces/Notification';

const notificationMetaDataSchema: Schema = new Schema<NotificationMetaData>({
  _id : { required : true, type: String},
  attachedNotification : { required : true, type: String},
  receiver : { type: String },
  read : { type: Number },
});

const notificationSchema: Schema = new Schema<Notification>({
  _id : { required : true, type: String},
  author : { required : true, type: String},
  created : {type : Number},
  title : { type: String },
  text : { type: String }
});

export const NotificationMetaDataSchema = mongoose.model<NotificationMetaData>('NotificationMeta', notificationMetaDataSchema);
export const NotificationSchema = mongoose.model<Notification>('Notification', notificationSchema);

