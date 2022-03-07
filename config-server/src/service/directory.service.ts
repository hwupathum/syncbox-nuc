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
import { string } from "zod";
import {
  createNewSchedule,
  deleteScheduleById,
  getAllSchedulesByUsername,
  getScheduleByFilePath,
  updateScheduledTime,
} from "../database/schedule_repository";
import { error } from "console";

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

export function retrieveSchedules(username: string, callback: Function) {
  if (username) {
    getAllSchedulesByUsername(username, (response: MySQLResponse) => {
      if (response.error) {
        log.error(`An error occurred ... ${response.error}`);
        callback(new CustomResponse(500, "System failure. Try again", {}));
      } else {
        log.info(
          `Successfully retrieved the schedule downloads for ${username} ...`
        );
        callback(new CustomResponse(200, "", response.results));
      }
    });
  } else {
    console.error("Username is not provided");
    callback(new CustomResponse(400, "Username is not provided", {}));
  }
}

export function scheduleDownload(
  username: string,
  filenames: string,
  day: string,
  time: string,
  callback: Function
) {
  if (username && filenames && day && time) {
    const splitted_filenames = filenames?.toString().split(", ");
    let success = [];
    let err;
    splitted_filenames.forEach((filename) => {
      let path: string = `${base_directory}/${username}/data${filename}`;
      if (fs.existsSync(path)) {
        const { error, result } = scheduleAllFilesInDirectory(
          username,
          filename,
          `${day} ${time}`
        );
        if (error) {
          log.error(error);
          err = error;
        } else {
          success.push(filename);
        }
      } else {
        log.error(`File ${filename} not found ...`);
        err = { error: "File not exists" };
      }
    });

    if (splitted_filenames.length === success.length) {
      callback(new CustomResponse(200, "", { download: true }));
    } else if (success.length === 0) {
      callback(new CustomResponse(500, "System failure. Try again", {}));
    } else {
      callback(new CustomResponse(200, "", { download: true }));
    }
  } else {
    console.error("Username/Filename/Start Time is not provided");
    callback(
      new CustomResponse(
        400,
        "Username/Filename/Start Time is not provided",
        {}
      )
    );
  }
}

const scheduleAllFilesInDirectory = (
  username: any,
  filename: any,
  time_string: string
) => {
  try {
    if (
      fs
        .lstatSync(`${base_directory}/${username}/data${filename}`)
        .isDirectory()
    ) {
      fs.readdirSync(`${base_directory}/${username}/data${filename}`).forEach(
        (file) => {
          let new_path: string = `/${filename}/${file}`;
          scheduleAllFilesInDirectory(username, new_path, time_string);
        }
      );
    } else {
      filename = filename.replace(/^\/+/, "/");
      getScheduleByFilePath(username, filename, (response: MySQLResponse) => {
        if (response.error) {
          return { error: response.error, result: null };
        } else if (response.results?.length === 0) {
          createNewSchedule(
            username,
            filename,
            time_string,
            (response: MySQLResponse) => {
              if (response.error) {
                return { error: response.error, result: null };
              } else {
                log.info(
                  `File ${filename} of ${username} was scheduled for download on ${time_string} ...`
                );
              }
            }
          );
        } else if (response.results?.length > 0) {
          updateScheduledTime(
            username,
            filename,
            time_string,
            (response: MySQLResponse) => {
              if (response.error) {
                return { error: response.error, result: null };
              } else {
                log.info(
                  `File ${filename} of ${username} was scheduled for download on ${time_string} ...`
                );
              }
            }
          );
        }
      });
    }
    return { error: null, result: true };
  } catch (error) {
    return { error, result: null };
  }
};

export function deleteSchedules(ids: string, callback: Function) {
  if (ids) {
    deleteScheduleById(ids, (response: MySQLResponse) => {
      if (response.error) {
        log.error(`An error occurred ... ${response.error}`);
        callback(new CustomResponse(500, "System failure. Try again", {}));
      } else {
        log.info(`Successfully deleted the schedule downloads ${ids} ...`);
        callback(new CustomResponse(200, "", response.results));
      }
    });
  } else {
    console.error("Schedule IDs not provided");
    callback(new CustomResponse(400, "Schedule IDs not provided", {}));
  }
}
