import { CustomResponse } from "../custom_response.ts";
import { addNewUser, getUserByUsername } from "../database/user_repository";
import { MySQLResponse } from "../model/mysql_response.model";
import { SeafileResponse } from "../model/seafile_response.model";
import { User } from "../model/user.model";
import retrieveUserToken from "../seafile_utils/retrieve_user_token";
import createDirectory from "../file_system_utils/create_directory";
import log from "../utils/logger";
import createFile from "../file_system_utils/create_file";
import configFileTemplate from "../seafile_utils/config_file_template";
import mountSeadrive from "../seafile_utils/mount_seadrive";
import { hashPassword } from "../security/bcrypt";
import { BcryptResponse } from "../model/bcrypt_response.model";

const base_directory = "/srv/syncbox";

export function createUser(input: Partial<User>, callback: Function) {
  const username: string = input.username!;
  const password: string = input.password!;
  log.info(`Register request... Username: ${username}`);

  // check user availability
  getUserByUsername(username, (response: MySQLResponse) => {
    if (response.error) {
      log.error(`An error occurred ... ${response.error.message}`);
      callback(new CustomResponse(500, "System failure. Try again", {}));
    } else if (response.results && response.results.length > 0) {
      log.error(`User: ${username} is already registered ...`);
      callback(new CustomResponse(409, "User is already registered", {}));
    } else {
      // get access token from server
      log.info(`Connecting to the server for verify user: ${username} ...`);
      retrieveUserToken(username, password, (response: SeafileResponse) => {
        if (response.stdout) {
          let opt: any = JSON.parse(response.stdout);

          if (opt.non_field_errors) {
            log.error(`An error occurred ... ${opt.non_field_errors}`);
            callback(
              new CustomResponse(
                401,
                "Unable to register with the provided credentials",
                {}
              )
            );
          } else if (opt.token) {
            log.info(`Successfully logged in... Username: ${username}`);
            let user_directory: string = `${base_directory}/${username}`;

            createDirectory(`${user_directory}/data`);
            createFile(
              `${user_directory}/seadrive.conf`,
              configFileTemplate(username, opt.token, username)
            );
            mountSeadrive(
              `${user_directory}/seadrive.conf`,
              `${user_directory}/data`,
              `${user_directory}/seadrive.log`,
              true
            );
            hashPassword(password, (response: BcryptResponse) => {
              if (response.error) {
                log.error(`An error occurred ... ${response.error.message}`);
                callback(
                  new CustomResponse(500, "System failure. Try again", {})
                );
              } else {
                addNewUser(
                  username,
                  response.hash,
                  `${user_directory}/data`,
                  (response: MySQLResponse) => {
                    if (response.error) {
                      log.error(
                        `An error occurred ... ${response.error.message}`
                      );
                      callback(
                        new CustomResponse(
                          500,
                          "User saving failed. Try again",
                          {}
                        )
                      );
                    } else {
                      log.info(`Successfully logged in ...`);
                      callback(
                        new CustomResponse(200, "", {
                          username,
                          token: opt.token,
                        })
                      );
                    }
                  }
                );
              }
            });
          }
        } else {
          log.error(
            `An error occurred ... ${
              response.error ? response.error.message : response.stderr
            }`
          );
          callback(new CustomResponse(500, "System failure. Try again", {}));
        }
      });
    }
  });
}
