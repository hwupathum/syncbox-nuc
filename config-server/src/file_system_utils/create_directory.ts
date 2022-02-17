import fs from "fs";
import unmountDirectory from "../system_utils/unmountDirectory";
import log from "../utils/logger";

export default function createDirectory(directory_name: string) {
  if (!fs.existsSync(directory_name)) {
    log.info(`Creating directory... ${directory_name}`);
    fs.mkdirSync(`${directory_name}`, { recursive: true });
  } else {
    log.error(`${directory_name} already exists ...`);
    unmountDirectory(directory_name);
  }
}
