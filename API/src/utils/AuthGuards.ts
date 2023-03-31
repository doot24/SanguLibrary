import * as express from 'express';

export const IsAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).json({ status:"error" ,message: "თქვენ არ გაქვთ ჩართული შესაბამისი უფლება" }).end();
    }
};
  
export const HasRole = (role: string) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.session.user?.roles.includes(role)) {
        next();
    } else {
        res.status(403).json({  status:"error", message: "თქვენ არ გაქვთ ჩართული შესაბამისი უფლება" }).end();
    }
};

export const HasRoles = (roles: string[]) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const userRoles = req.session.user?.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (hasRole) {
        next();
    } else {
        res.status(403).json({ status: "error", message: `თქვენ არ გაქვთ ჩართული შესაბამისი უფლება. საჭიროა მინიმუმ ერთი შესაბამისი როლი: ${roles.join(', ')}` }).end();
    }
};

export const IsNotAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session.user) {
        next();
    } else {
        res.status(403).json({  status:"error", message: "თქვენ არ გაქვთ ჩართული შესაბამისი უფლება" }).end();
    }
};
  