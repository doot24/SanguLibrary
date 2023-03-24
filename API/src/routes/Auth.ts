import { Router, Request, Response } from "express";
import {  body,  validationResult } from 'express-validator';
import { IsNotAuthenticated, IsAuthenticated } from "../utils/AuthGuards";
import { User } from "../interfaces/User";
import { UserSchema } from "../schemas/UserSchema";

import axios from 'axios';
import { randomUUID } from "crypto";

const router = Router();

router.post("/login", IsNotAuthenticated, body("email").isEmail().normalizeEmail(), body("password").notEmpty(), (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({status:"error", message : "მოთხოვნის ფორმატი არასწორია!"});
    }

    let emailBody : string = req.body.email;
    let passwordBody : string = req.body.password;

    // attempt to login to university
    axios.post("https://ums.sangu.edu.ge/auth/login", {email:emailBody, password : passwordBody}).then((result) => {
        let sanguData = result.data;    

        let sanguUser : User = new User();
        sanguUser.firstName = sanguData.firstName;
        sanguUser.lastName = sanguData.lastName;
        sanguUser.email = sanguData.email;
        sanguUser.photo = sanguData.photo;
        sanguUser.publicNumber = sanguData.personalNo;
        sanguUser.phoneNumber = sanguData.phone;
        
        UserSchema.findOne({email : emailBody}).then((userResult) => {
            if(!userResult)
            {
                sanguUser.userid = randomUUID();
                let sanguUserSchema = new UserSchema(sanguUser);

                sanguUserSchema.save().then(() => {
                    req.session.user = sanguUserSchema;
                    req.session.save((err) => {
                        if(err)
                        {
                            throw err;
                        }
                        res.status(200).json({status:"success", user : sanguUser});
                    })
                });
            }
            else {
                sanguUser.userid = userResult.userid;
                sanguUser.roles = userResult.roles;
                UserSchema.updateOne({userid : sanguUser.userid}, {
                    firstName : sanguUser.firstName,
                    lastName : sanguUser.lastName,
                    email : sanguUser.email,
                    photo : sanguUser.photo,
                    publicNumber : sanguUser.publicNumber,
                    phoneNumber : sanguUser.phoneNumber
                }).then(() => {
                    
                    req.session.user = sanguUser;
                    req.session.save((err) => {
                        if(err)
                        {
                            throw err;
                        }
                        res.status(200).json({status:"success", user : sanguUser});
                    })
                })
            }
        });

    }).catch((error) => {
        if(error.code == "ERR_BAD_REQUEST")
        {
            return res.status(403).json({status:"fail", message : "ელ.ფოსტა ან პაროლი არასწორია"});
        }

        res.status(400).json({status:"fail", message : "მოთხოვნის დამუშავება ვერ მოხერხდა!"});
    });
});

router.post('/logout', IsAuthenticated, (req : Request, res : Response) => {
    req.session.destroy((err) => {
        if(err)
        {
            return res.status(400).json({status:"error", message : "მოთხოვნის დამუშავება ვერ მოხერხდა!"})
        }
        res.status(200).json({status:"success"}).end();
    })
});

export default router;
