import express from "express";
import { createUserHandler } from "../controller/user.controller";
import { CREATE_USER_SCHEMA } from "../schema/user.schema";
import validateResource from "../utils/validate_resource";

const router = express.Router();

router.post(
  "/api/users/login",
  validateResource(CREATE_USER_SCHEMA),
  createUserHandler
);

export default router;
