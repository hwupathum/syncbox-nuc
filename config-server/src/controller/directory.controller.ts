import { Request, Response } from "express";
import { CustomResponse } from "../custom_response.ts";
// import { RetrieveDirectoriesInput } from "../schema/files.schema";
import {
  deleteSchedules,
  retrieveDirectories,
  retrieveSchedules,
  scheduleDownload,
} from "../service/directory.service";

export async function retrieveDirectoriesHandler(req: Request, res: Response) {
  const username = req.query.username;
  const location = req.query.location;
  try {
    retrieveDirectories(
      `${username}`,
      `${location}`,
      (response: CustomResponse) => {
        res.send(response);
      }
    );
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}

export async function retrieveSchedulesHandler(req: Request, res: Response) {
  const username = req.query.username;
  try {
    retrieveSchedules(`${username}`, (response: CustomResponse) => {
      res.send(response);
    });
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}

export async function scheduleDownloadHandler(req: Request, res: Response) {
  const username = req.query.username;
  const filenames = req.query.filenames;
  const day = req.query.day;
  const time = req.query.time;
  try {
    scheduleDownload(
      `${username}`,
      `${filenames}`,
      `${day}`,
      `${time}`,
      (response: CustomResponse) => {
        res.send(response);
      }
    );
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}

export async function deleteScheduleHandler(req: Request, res: Response) {
  const ids = req.query.ids;

  try {
    deleteSchedules(`${ids}`, (response: CustomResponse) => {
      res.send(response);
    });
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}
