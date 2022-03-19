import cron from "node-cron";
import fs from "fs";
import config from "config";
import {
  deleteScheduleById,
  getAllSchedules,
} from "../database/schedule_repository";
import { getAllUsers, getUserByUserId } from "../database/user_repository";
import mountSeadrive from "../seafile_utils/mount_seadrive";
import unmountDirectory from "./unmountDirectory";
import { updateFileSyncedTime } from "../database/file_repository";
import { MySQLResponse } from "../model/mysql_response.model";
import log from "../utils/logger";

const spawn = require("child_process").spawn;
const base_directory = config.get("base_directory");
const logger_script: string = config.get("logger_script");

export function mountDirectoriesForSavedUsers() {
  getAllUsers((response: MySQLResponse) => {
    if (response.error) {
      log.error(`An error occurred ... ${response.error}`);
    } else if (response.results && response.results.length > 0) {
      console.log(response.results);
      
      for (let index in response.results) {
        let user = response.results[index];
        if (user.scope) {
          unmountDirectory(user.scope, () =>
            mountSeadrive(
              `${base_directory}/${user.username}/seadrive.conf`,
              user.scope,
              `${base_directory}/${user.username}/seadrive.log`,
              true
            )
          );
        }
      }
    }
  });
}

export function dowloadScheduledFiles() {
  cron.schedule("* * * * *", () => {
    getAllSchedules((response: MySQLResponse) => {
      if (response.error) {
        log.error(`An error occurred ... ${response.error}`);
      } else if (response.results && response.results.length > 0) {
        let current = new Date();
        response.results.forEach((schedule: any) => {
          if (current >= schedule.start_time) {
            log.info(`Date Matched for file ${schedule.full_path} ...`);
            getUserByUserId(schedule.user_id, (response: MySQLResponse) => {
              if (response.error) {
                log.error(`An error occurred ... ${response.error}`);
              } else if (response.results && response.results.length > 0) {
                let user = response.results[0];
                let file_path = `${user.scope}/${schedule.full_path}`;
                deleteScheduleById(
                  schedule.schedule_id,
                  (response: MySQLResponse) => {
                    if (response.error) {
                      log.error(`An error occurred ... ${response.error}`);
                    } else if (fs.existsSync(file_path)) {
                      console.log(`Downloading file: ${schedule.full_path}...`);
                      fs.readFile(file_path, "utf8", (error, data) => {
                        if (error) {
                          log.error(`An error occurred ... ${response.error}`);
                        } else if (data) {
                          log.info(
                            `Successfully downloaded file: ${schedule.full_path} ...`
                          );
                          updateFileSyncedTime(
                            schedule.user_id,
                            schedule.full_path,
                            (response: MySQLResponse) => {
                              if (response.error) {
                                log.error(
                                  `An error occurred ... ${response.error}`
                                );
                              } else {
                                log.info(
                                  `Database updated for ${schedule.full_path} file with synced data ...`
                                );
                              }
                            }
                          );
                        }
                      });
                    } else {
                      log.error(`File: ${file_path} not exists ...`);
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  });
}

export function logFileAccessHistory() {
  cron.schedule("0 0 * * *", () => {
    spawn("python3", [logger_script]);
    log.info("Logged the file access history ...");
  });
}
