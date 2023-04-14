import { User } from "../interfaces/User";
import { IsSecureSession, GetConnectionString } from "../utils/Env";
import express from 'express';
import session from "express-session";
import MongoStore from "connect-mongo";

declare module "express-session" {
  interface Session {
    user: User;
  }
}

export function InitializeSessions(app: express.Application) {
  app.use(
    session({
      proxy: true,
      secret: String(process.env.SESSION_SECRET),
      resave: false,
      saveUninitialized: false,
      cookie: { path: '/', secure: IsSecureSession(), sameSite: 'none', httpOnly: true, maxAge: Number(process.env.SESSION_LIFE) },
      store: MongoStore.create({
        mongoUrl: GetConnectionString(),
        autoRemove: "native",
        collectionName: "sessions",
        crypto: { secret: String(process.env.SESSION_SECRET) }
      })
    })
  );
}