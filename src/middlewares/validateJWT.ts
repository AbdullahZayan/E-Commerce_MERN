import { NextFunction, Request, Response } from "express";
import  Jwt  from 'jsonwebtoken'
import userModel from "../models/userModel";
import { ExtendRequest } from "../types/extendedRequest";


// interface ExtendRequest extends Request {
//     user?: any;
// }

const validateJWT = (req: ExtendRequest, res: Response, next: NextFunction) => {
    const authorizationHeader = req.get('authorization');

    if (!authorizationHeader) {
        res.status(403).send("Authorization header was not provided");
        return;
    }
    if (!authorizationHeader.startsWith("Bearer ")) {
        res.status(403).send("Authorization header format is 'Bearer <token>'");
        return;
    }
    
    
    // Corrected splitting the token to extract the actual JWT token
    const token = authorizationHeader.split(" ")[1];
    if (!token) {
        res.status(403).send("Bearer token not found!");
        return;
    }

    Jwt.verify(token, process.env.JWT_SECRET || '', async (err, payload) => {
        if(err) {
            res.status(403).send("Invalid token");
            return;
        }
    // Jwt.verify(token, process.env.JWT_SECRET || "", async (err, payload) => {
    //     if (err) {
    //       res.status(403).send("Invalid token");
    //       return;
    //     }
       

        if(!payload){
            res.status(403).send("Invalid token payload");
            return;
        }

        const userPayload = payload as {
            email: string;
            firstName: string;
            lastName: string;
        };

        //Fetch user from database based on the payload
        const user = await userModel.findOne({ email: userPayload.email });
        req.user = user; // Attach the user object to the request
        next();
    });
};



export default validateJWT;

