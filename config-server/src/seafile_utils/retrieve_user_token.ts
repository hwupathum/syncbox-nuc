import { exec } from "child_process";
import config from "config";
import { SeafileResponse } from "../model/seafile_response.model";

export default function retrieveUserToken(
  username: string,
  password: string,
  callback: Function
) {
  const host = config.get("seafile_host");
  let command: string = `curl -d "username=${username}" -d "password=${password}" ${host}/api2/auth-token/`;
  exec(command, (error, stdout, stderr) =>
    callback(new SeafileResponse(error, stdout, stderr))
  );
}
