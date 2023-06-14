import * as express from 'express';
import { UserSchema } from '../schemas/UserSchema';
import { User } from '../interfaces/User';

export const IsAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ status:"error" ,message: "სესიას ვადა გაუვიდა ავტორიზაცია თავიდან გაიარეთ" }).end();
    }
};
  
export const HasRole = (role: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    UserSchema.findOne({_id : req.session.user._id}).then((user : User | null) => {
        if(user?.roles.includes(role))
        {
            next();
            return;
        }

        throw new Error();
    }).catch(() => {
        res.status(403).json({ status: "error", message: "თქვენ არ გაქვთ ჩართული შესაბამისი უფლება"}).end();
    });
};

export const HasRoles = (roles: String[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {

    UserSchema.findOne({_id : req.session.user._id}).then((user : User | null) => {
        if(user?.roles.some(role => roles.includes(role)))
        {
            next();
            return;
        }

        throw new Error();
    }).catch(() => {
        res.status(403).json({ status: "error", message: "თქვენ არ გაქვთ ჩართული შესაბამისი უფლება"}).end();
    });
};

export const IsNotAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.user) {
        next();
    } else {
        res.status(403).json({  status:"error", message: "თქვენ არ გაქვთ ჩართული შესაბამისი უფლება" }).end();
    }
};
  