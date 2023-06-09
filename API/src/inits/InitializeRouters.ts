import auth from "../routes/Auth";
import user from "../routes/User";
import notification from "../routes/Notification"
import Petitions from "../routes/Petitions";
import checkouts from "../routes/Checkouts";
import home from "../routes/Home";

//admin
import resurceManagement from "../routes/admin/ResourceManagement";
import notificationmanagement from "../routes/admin/NotificationManagement"
import usermanagement from "../routes/admin/UserManagement";
import petitionmanagement from "../routes/admin/PetitionManagement";
import checkoutManagement from "../routes/admin/CheckoutManagement";
import categoryManagement from "../routes/admin/CategoryManagement";
import listingManagement from "../routes/admin/ListingManagement";

//search
import resourceSearch from "../routes/ResourceSearch"

import express from 'express';

export function InitializeRouters(app: express.Application) {
    app.use("/auth", auth);
    app.use("/user", user);
    app.use("/notification", notification);
    app.use("/petitions", Petitions);
    app.use("/search", resourceSearch);
    app.use("/checkouts", checkouts);
    app.use("/home", home);

    app.use("/admin/resourcemanagement", resurceManagement);
    app.use("/admin/resourcemanagement/category/", categoryManagement);
    app.use("/admin/resourcemanagement/listing/", listingManagement);

    app.use("/admin/notificationmanagement", notificationmanagement);
    app.use("/admin/usermanagement", usermanagement);
    app.use("/admin/petitionmanagement", petitionmanagement);
    app.use("/admin/checkoutmanagement", checkoutManagement);
}