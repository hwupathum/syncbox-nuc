import fs from "fs";
import log from "../utils/logger";

export default function updateFile(file_name: string, content: string) {
  if (fs.existsSync(file_name)) {
    log.info(`Updating file... ${file_name}`);
    fs.writeFile(file_name, content, 'utf8', (error) => {
      if (error) {
        log.error(`An error occurred ... ${error.message}`);
      }
    });
  } else {
    log.error(`${file_name} not exists ...`);
  }
}
