export class Notification {
    _id: string = "";
    title: string = "";
    created : number = 0;
    text: string = "";
    author: string = "";
}

export class NotificationMetaData {
    _id: string = "";
    attachedNotification: string = "";
    receiver: string = "";
    read: boolean = false;
    notification : Notification[] = [];
}