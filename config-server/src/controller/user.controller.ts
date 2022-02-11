import { Request, Response } from "express";
import { CustomResponse } from "../custom_response.ts";
import { CreateUserInput } from "../schema/user.schema";
import { createUser } from "../service/user.service";

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  const body = req.body;
  try {
    const response: CustomResponse = createUser(body);
    if (response.status === 200) {
      req.session.user = {
        name: response.data.username,
        token: response.data.token,
      };
      res.send(response);
    }
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}
