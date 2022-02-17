import { Request, Response } from "express";
import { CustomResponse } from "../custom_response.ts";
// import { CreateUserInput, LoginUserInput } from "../schema/user.schema";
import { createUser, loginUser } from "../service/user.service";

export async function createUserHandler(req: Request, res: Response) {
  const body = req.body;
  try {
    createUser(body, (response: CustomResponse) => {
      if (response.status === 200) {
        req.session.user = {
          name: response.data.username,
          token: response.data.token,
        };
      }
      res.send(response);
    });
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}

export async function loginUserHandler(req: Request, res: Response) {
  const body = req.body;
  try {
    loginUser(body, (response: CustomResponse) => {
      if (response.status === 200) {
        req.session.user = {
          name: response.data.username,
          token: response.data.token,
        };
      }
      res.send(response);
    });
  } catch (error) {
    res.send(new CustomResponse(500, "System failure. Try again", {}));
  }
}
