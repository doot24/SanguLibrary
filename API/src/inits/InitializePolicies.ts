import { contentSecurityPolicy, dnsPrefetchControl, expectCt, frameguard, hidePoweredBy, hsts, ieNoOpen, noSniff, referrerPolicy, xssFilter } from 'helmet';
import cors from 'cors';
import express from 'express';

export function InitializePolicies(app: express.Application) {
    app.use(contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', '*'],
        },
    }));
    app.use(dnsPrefetchControl());
    app.use(expectCt());
    app.use(frameguard());
    app.use(hidePoweredBy());
    app.use(hsts());
    app.use(ieNoOpen());
    app.use(noSniff());
    app.use(referrerPolicy());
    app.use(xssFilter());

    app.use(cors({
        origin: true,
        credentials: true
    }));
}