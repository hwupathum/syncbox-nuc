import { exec } from "child_process";
import config from "config";
import { SeafileResponse } from "../model/seafile_response.model";

const host = config.get("seafile_host");

export default function getDirectoryHash(
  token: string,
  password: string,
  callback: Function
) {
  let command: string = `curl -H 'Authorization: Token ${token}' -H 'Accept: application/json; indent=4' ${host}/api2/repos/`;
  exec(command, (error, stdout, stderr) => {
    callback(password, new SeafileResponse(error, stdout, stderr));
  });
}
