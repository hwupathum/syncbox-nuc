import { CustomResponse } from "../custom_response.ts";
import config from "config";
import path from "path";
import fs from "fs";
import { getUserByUsername } from "../database/user_repository";
import { MySQLResponse } from "../model/mysql_response.model";
import log from "../utils/logger";
import { User } from "../model/user.model";
import convertBytes from "../file_system_utils/file_size_converter";
import { getFilesByUserId } from "../database/file_repository";

const base_directory = config.get("base_directory");

export function retrieveDirectories(
  username: string,
  location: string | null,
  callback: Function
) {
  getUserByUsername(username, (response: MySQLResponse) => {
    log.info(
      `File retrieving request... Username: ${username}, Location: ${location}`
    );
    if (response.error) {
      log.error(`An error occurred ... ${response.error.message}`);
      callback(new CustomResponse(500, "System failure. Try again", {}));
    } else if (response.results && response.results.length > 0) {
      let user: User = response.results[0];
      let directory: string = `${base_directory}/${user.username}/data`;
      if (location) {
        directory = path.join(directory, location);
      }
      log.info(`Retrieving files from ${directory} ...`);
      fs.readdir(directory, "utf8", (error, content) => {
        if (error) {
          log.error(`An error occurred ... ${error.message}`);
          callback(new CustomResponse(500, "System failure. Try again", {}));
        } else {
          const directories: any = [];
          const files: any = [];
          let file_names: string = "";
          content.forEach((result) => {
            let name = path.join(directory, result);
            let size = convertBytes(fs.statSync(name).size);
            let extension = path.extname(result);
            if (fs.lstatSync(name).isDirectory()) {
              directories.push({ name: result, size, extension });
            } else {
              files.push({ name: result, size, extension });
              file_names += `'${location}/${result}', `;
            }
          });
          if (files.length > 0) {
            getFilesByUserId(
              username,
              file_names.slice(0, -2),
              (response: MySQLResponse) => {
                if (response.results && response.results.length > 0) {
                  const result_names = response.results.map(
                    (result: any) => result.full_path
                  );

                  files.forEach((file: any) => {
                    let index = result_names.indexOf(
                      `${location}/${file.name}`
                    );
                    if (index > -1) {
                      file.access_time =
                        response.results[index].access_time || "N/A";
                      file.synced_time =
                        response.results[index].synced_time || "N/A";
                    }
                  });
                }
                callback(
                  new CustomResponse(200, "", { data: { directories, files } })
                );
              }
            );
          } else {
            callback(
              new CustomResponse(200, "", { data: { directories, files } })
            );
          }
        }
      });
    } else {
      log.error(`User: ${username} is not registered`);
      callback(new CustomResponse(401, "User is not registered", {}));
    }
  });
}
