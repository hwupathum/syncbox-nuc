import express from "express";
import { createUserHandler, loginUserHandler } from "../controller/user.controller";
import { CREATE_USER_SCHEMA } from "../schema/user.schema";
import validateResource from "../utils/validate_resource";

const router = express.Router();

router.post(
  "/api/users/register",
  validateResource(CREATE_USER_SCHEMA),
  createUserHandler
);

router.post(
  "/api/users/login",
  validateResource(CREATE_USER_SCHEMA),
  loginUserHandler
);

export default router;
