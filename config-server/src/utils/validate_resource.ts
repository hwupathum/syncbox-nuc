import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { CustomResponse } from "../custom_response.ts";
import log from "./logger";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      log.error(`An error occurred ... ${error}`);
      return res.send(new CustomResponse(400, "System failure. Try again", {}));
    }
  };

export default validateResource;
