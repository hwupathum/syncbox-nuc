import fs from "fs";
import log from "../utils/logger";

export default function createFile(file_name: string, content: string) {
  if (!fs.existsSync(file_name)) {
    log.info(`Creating file... ${file_name}`);
    fs.writeFile(file_name, content, (error) => {
      if (error) {
        log.error(`An error occurred ... ${error.message}`);
        return;
      }
    });
  } else {
    log.error(`${file_name} already exists ...`);
  }
}
