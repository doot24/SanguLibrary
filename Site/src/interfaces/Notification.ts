export class Notification {
    _id: String = "";
    title: String = "";
    created : number = 0;
    text: String = "";
    author: String = "";
}

export class NotificationMetaData {
    _id: String = "";
    attachedNotification: String = "";
    receiver: String = "";
    read: Boolean = false;
    notification : Notification[] = [];
}