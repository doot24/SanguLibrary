import mongoose, { Schema } from 'mongoose';
import { INotification, INotificationMetadata } from '../interfaces/Notification';

const notificationMetaDataSchema: Schema = new Schema<INotificationMetadata>({
  _id : { required : true, type: String},
  attachedNotification : { required : true, type: String},
  receiver : { type: String },
  read : { type: Number },
});

const notificationSchema: Schema = new Schema<INotification>({
  _id : { required : true, type: String},
  author : { required : true, type: String},
  created : {type : Number},
  title : { type: String },
  text : { type: String }
});

export const NotificationMetaDataSchema = mongoose.model<INotificationMetadata>('NotificationMetaData', notificationMetaDataSchema);
export const NotificationSchema = mongoose.model<INotification>('Notification', notificationSchema);

