import auth from "../routes/Auth";
import user from "../routes/User";
import notification from "../routes/Notification"
import  Petitions  from "../routes/Petitions";

//admin
import resurceManagement from "../routes/admin/ResourceManagement";
import notificationmanagement from "../routes/admin/NotificationManagement"
import usermanagement from "../routes/admin/UserManagement";
import petitionmanagement from "../routes/admin/PetitionManagement";

//search
import resourceSearch from "../routes/admin/ResourceSearch"

import express from 'express';

export function InitializeRouters(app: express.Application) {
    app.use("/auth", auth);
    app.use("/user", user);
    app.use("/notification", notification);
    app.use("/petitions", Petitions);
    app.use("/search", resourceSearch);

    app.use("/admin/resourcemanagement", resurceManagement);
    app.use("/admin/notificationmanagement", notificationmanagement);
    app.use("/admin/usermanagement", usermanagement);
    app.use("/admin/petitionmanagement", petitionmanagement);
}