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
    } catch (error: any) {
      log.error(`An error occurred ... ${error.errors[0]?.message}`);
      return res.send(new CustomResponse(400, error.errors[0]?.message, {}));
    }
  };

export default validateResource;
