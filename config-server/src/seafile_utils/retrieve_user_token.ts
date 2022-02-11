import { exec } from "child_process";
import config from "config";
import readFile from "../file_system_utils/read_file";
import { SeafileResponse } from "../model/seafile_response.model";

export function retrieveUserTokenFromServer(
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

export function retrieveUserTokenFromConfigFile(
  file_name: string,
  callback: Function
) {
  const { error, content } = readFile(file_name);
  if (content) {
    callback(error, content.split("\n")[3].substring(8));
  }
}
