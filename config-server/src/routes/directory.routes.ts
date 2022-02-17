import express from "express";
import {
  retrieveDirectoriesHandler,
  scheduleDownloadHandler,
} from "../controller/directory.controller";
// import { RETRIEVE_DIRECTORIES_SCHEMA } from "../schema/files.schema";
import validateResource from "../utils/validate_resource";

const router = express.Router();

router.get(
  "/api/files",
  // validateResource(RETRIEVE_DIRECTORIES_SCHEMA),
  retrieveDirectoriesHandler
);

router.post(
  "/api/schedule",
  // validateResource(RETRIEVE_DIRECTORIES_SCHEMA),
  scheduleDownloadHandler
);

export default router;
