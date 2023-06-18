import { Application, Express } from "express";
import mongoose from "mongoose";

import { GetConnectionString, GetServerPort } from "../utils/Env"

import { InitializeCollections } from "./InitializeCollections";

export const InitializeMongo = async (app: Application): Promise<void> => {
    mongoose.set('strictQuery', false);
    mongoose.connect(GetConnectionString()).then(() => {
    InitializeCollections()
    app.listen(GetServerPort(),() => {
        console.log(`app running...`);
    });
    }).catch((error) => {
        console.error(`An error occurred while starting the server: ${error}`);
    });
};