import log from "../utils/logger";

var exec = require("child_process").exec;
const data_directory = `/home/${
  require("os").userInfo().username
}/.seadrive/data`;

export default function mountSeadrive(
  config: string,
  virtualDriveDir: string,
  logFile?: string,
  isForeground?: boolean
) {
  log.info(`Mounting seadrive to ${virtualDriveDir}...`);
  let command: string = `seadrive -c ${config} ${
    isForeground ? "-f" : ""
  } -d ${data_directory} ${logFile ? `-l ${logFile}` : ""} ${virtualDriveDir}`;
  log.info(command);
  exec(command, (error: any, stdout: any, stderr: any) => {
    if (stdout) {
      console.log(`Mounted directory ${virtualDriveDir} successfully...`);
    } else {
      console.error(`An error occurred ${stderr || error}`);
    }
  });
}
