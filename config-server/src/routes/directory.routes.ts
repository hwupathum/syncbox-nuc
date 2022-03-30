import express from "express";
import {
  deleteScheduleHandler,
  retrieveDirectoriesHandler,
  retrieveSchedulesHandler,
  retrieveSyncDetailsHandler,
  scheduleDownloadHandler,
} from "../controller/directory.controller";

const router = express.Router();

router.get(
  "/api/files",
  retrieveDirectoriesHandler
);

router.get(
  "/api/schedules",
  retrieveSchedulesHandler
);

router.post(
  "/api/schedules",
  scheduleDownloadHandler
);

router.delete(
  "/api/schedules",
  deleteScheduleHandler
);

router.get(
  "/api/sync",
  retrieveSyncDetailsHandler
);

export default router;
