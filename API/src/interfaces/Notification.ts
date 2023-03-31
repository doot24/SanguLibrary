export class Notification {
    _id: String = "";
    title: String = "";
    created : Number = Date.now()
    text: String = "";
    author: String = "";
}

export class NotificationMetaData {
    _id: String = "";
    attachedNotification: String = "";
    receiver: String = "";
    read: Boolean = false;
}