export interface INotificationMetadata {
    _id : String,
    attachedNotification : String,
    receiver : String,
    read : Boolean,
}

export interface INotification {
    _id : String,
    title : String,
    created : Number,
    text : String,
    author : String
}

export class Notification implements INotification {
    _id: String = "";
    title: String = "";
    created : Number = Date.now()
    text: String = "";
    author: String = "";

}

export class NotificationMetaData implements INotificationMetadata {
    _id: String = "";
    attachedNotification: String = "";
    receiver: String = "";
    read: Boolean = false;
}