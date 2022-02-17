import express from "express";
import { retrieveDirectoriesHandler } from "../controller/directory.controller";
// import { RETRIEVE_DIRECTORIES_SCHEMA } from "../schema/files.schema";
import validateResource from "../utils/validate_resource";

const router = express.Router();

router.get(
  "/api/files",
  // validateResource(RETRIEVE_DIRECTORIES_SCHEMA),
  retrieveDirectoriesHandler
);

export default router;
