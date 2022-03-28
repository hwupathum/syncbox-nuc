import { exec } from "child_process";
import config from "config";

const host = config.get("seafile_host");

export default async function getDirectoryHash(
  token: string,
  password: string,
  callback: Function
) {
  let command: string = `curl -H 'Authorization: Token ${token}' -H 'Accept: application/json; indent=4' ${host}/api2/repos/`;
  exec(command, (error, stdout, stderr) => {
    callback(password, stdout);
  });
}
