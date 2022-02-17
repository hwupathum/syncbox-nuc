import { Request, Response } from "express";
import { CustomResponse } from "../custom_response.ts";
// import { RetrieveDirectoriesInput } from "../schema/files.schema";
import { retrieveDirectories } from "../service/directory.service";

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
