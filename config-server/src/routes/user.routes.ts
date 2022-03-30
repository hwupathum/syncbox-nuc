import express from "express";
import {
  createUserHandler,
  loginUserHandler,
} from "../controller/user.controller";

const router = express.Router();

router.post(
  "/api/users/register",
  createUserHandler
);

router.post(
  "/api/users/login",
  loginUserHandler
);

export default router;
