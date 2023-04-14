import express, { Application } from "express";

// Initialize environment variables
import * as dotenv from "dotenv";
dotenv.config();

const app: Application = express();

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize express session
import { InitializeSessions } from "./inits/InitializeSessions";
InitializeSessions(app);

// Initalize headers & policies
import { InitializePolicies } from "./inits/InitializePolicies";
InitializePolicies(app);

// Initialize all app routers
import { InitializeRouters } from "./inits/InitializeRouters";
InitializeRouters(app);

// Enable express static file sharing
import history from 'connect-history-api-fallback';
app.use(history());
app.use(express.static("site"));

// Compress Requests
const compression = require("compression");
app.use(compression());

// Temporary, Initialize firebase api
import { initializeFirebase } from "./inits/InitializeFirebase";
initializeFirebase();

// Initialize app & db connection
import { InitializeMongo } from "./inits/InitializeMongo";
InitializeMongo(app);