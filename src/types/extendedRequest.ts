import { Request } from "express";
import validateJWT from "../middlewares/validateJWT";

export interface ExtendRequest extends Request {
  user?: any;
}

