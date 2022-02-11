import fs from "fs";
import log from "../utils/logger";

export default function createDirectory(directory_name: string) {
  if (!fs.existsSync(directory_name)) {
    log.info(`Creating directory... ${directory_name}`);
    fs.mkdirSync(`${directory_name}`, { recursive: true });
  } else {
    log.error(`${directory_name} already exists ...`);
  }
}
