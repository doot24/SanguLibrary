import auth from "../routes/Auth";
import user from "../routes/User";
import library from "../routes/Library"
import search from "../routes/Search";
import notification from "../routes/Notification"
import  Petitions  from "../routes/Petitions";

//admin
import bookmanagement from "../routes/admin/BookManagement";
import notificationmanagement from "../routes/admin/NotificationManagement"
import usermanagement from "../routes/admin/UserManagement";
import petitionmanagement from "../routes/admin/PetitionManagement";


import express from 'express';

export function InitializeRouters(app: express.Application) {
    app.use("/auth", auth);
    app.use("/user", user);
    app.use("/library", library);
    app.use("/search", search);
    app.use("/notification", notification);
    app.use("/petitions", Petitions);

    app.use("/admin/bookmanagement", bookmanagement);
    app.use("/admin/notificationmanagement", notificationmanagement);
    app.use("/admin/usermanagement", usermanagement);
    app.use("/admin/petitionmanagement", petitionmanagement);

}