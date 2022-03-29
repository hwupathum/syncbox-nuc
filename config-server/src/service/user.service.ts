import { CustomResponse } from "../custom_response.ts";
import config from "config";
import {
  addNewUser,
  getUserByUsername,
  updateUserPasswordByUserId,
} from "../database/user_repository";
import { MySQLResponse } from "../model/mysql_response.model";
import { SeafileResponse } from "../model/seafile_response.model";
import { User } from "../model/user.model";
import {
  retrieveUserTokenFromConfigFile,
  retrieveUserTokenFromServer,
} from "../seafile_utils/retrieve_user_token";
import createDirectory from "../file_system_utils/create_directory";
import log from "../utils/logger";
import createFile from "../file_system_utils/create_file";
import configFileTemplate from "../seafile_utils/config_file_template";
import mountSeadrive from "../seafile_utils/mount_seadrive";
import { comparePassword, hashPassword } from "../security/bcrypt";
import { BcryptResponse } from "../model/bcrypt_response.model";
import updateSeafileConfigurationFile from "../seafile_utils/update_config";
import getDirectoryHash from "../seafile_utils/get_directory_hash";

const base_directory = config.get("base_directory");

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
      retrieveUserTokenFromServer(
        username,
        password,
        (response: SeafileResponse) => {
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
                } else if (response.hash) {
                  getDirectoryHash(
                    opt.token,
                    response.hash,
                    (password: string, response: SeafileResponse) => {
                      const directory_details = JSON.parse(response.stdout);
                      
                      let path_hash = "";
                      if (directory_details.length > 0) {
                        path_hash = JSON.parse(response.stdout)[0].id;
                      }
                      addNewUser(
                        username,
                        password,
                        `${user_directory}/data`,
                        path_hash,
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
        }
      );
    }
  });
}

export function loginUser(input: Partial<User>, callback: Function) {
  const username: string = input.username!;
  const password: string = input.password!;
  log.info(`Login request... Username: ${username}`);

  getUserByUsername(username, (response: MySQLResponse) => {
    if (response.error) {
      log.error(`An error occurred ... ${response.error.message}`);
      callback(new CustomResponse(500, "System failure. Try again", {}));
    } else if (response.results && response.results.length > 0) {
      let user: User = response.results[0];
      // get access token from server
      retrieveUserTokenFromServer(
        username,
        password,
        (response: SeafileResponse) => {
          if (response.stdout) {
            let opt: any = JSON.parse(response.stdout);

            if (opt.non_field_errors) {
              comparePassword(
                password,
                user.password,
                (response: BcryptResponse) => {
                  if (response.error) {
                    log.error(
                      `An error occurred ... ${response.error.message}`
                    );
                    callback(
                      new CustomResponse(500, "System failure. Try again", {})
                    );
                  } else if (response.reply) {
                    // Server password changed but not updated the SyncBox
                    log.error(
                      `${username} has changed the server password ...`
                    );
                    callback(
                      new CustomResponse(500, "Server password has changed", {})
                    );
                  } else {
                    log.error(
                      `An error occurred ... ${opt.non_field_errors[0]}`
                    );
                    callback(
                      new CustomResponse(401, opt.non_field_errors[0], {})
                    );
                  }
                }
              );
            } else if (opt.token) {
              comparePassword(
                password,
                user.password,
                (response: BcryptResponse) => {
                  if (response.error) {
                    log.error(
                      `An error occurrred ... ${response.error.message}`
                    );
                    callback(
                      new CustomResponse(500, "System failure. Try again", {})
                    );
                  } else if (!response.reply) {
                    log.info(
                      `Server password of User: ${username} was changed ...`
                    );
                    hashPassword(password, (response: BcryptResponse) => {
                      if (response.error) {
                        log.error(
                          `An error occurrred ... ${response.error.message}`
                        );
                        callback(
                          new CustomResponse(
                            500,
                            "System failure. Try again",
                            {}
                          )
                        );
                      } else if (response.hash) {
                        // update the SyncBox password and configuration file
                        updateUserPasswordByUserId(
                          user.user_id,
                          response.hash,
                          (response: MySQLResponse) => {
                            if (response.error) {
                              log.error(
                                `An error occurrred ... ${response.error.message}`
                              );
                              callback(
                                new CustomResponse(
                                  500,
                                  "System failure. Try again",
                                  {}
                                )
                              );
                            }
                          }
                        );
                        updateSeafileConfigurationFile(
                          `${base_directory}/${username}/seadrive.conf`,
                          opt.token
                        );
                      }
                    });
                  }
                  log.info(`${username} successfully logged in ...`);
                  callback(
                    new CustomResponse(200, "", { username, token: opt.token })
                  );
                }
              );
            }
          } else {
            // cannot connect to the server
            log.error("Unable to connect to the server ...");
            comparePassword(
              password,
              user.password,
              (response: BcryptResponse) => {
                if (response.error) {
                  log.error(`An error occurred ... ${response.error.message}`);
                  callback(
                    new CustomResponse(500, "System failure. Try again", {})
                  );
                } else if (response.reply) {
                  retrieveUserTokenFromConfigFile(
                    `${base_directory}/${username}/seadrive.conf`,
                    (error: string, token: string) => {
                      if (token) {
                        console.log(`${username} successfully logged in...`);
                        callback(
                          new CustomResponse(200, "", { username, token })
                        );
                      } else {
                        log.error(`An error occurred ... ${error}`);
                        callback(new CustomResponse(500, error, {}));
                      }
                    }
                  );
                } else {
                  console.error("Incorrect credentials");
                  callback(
                    new CustomResponse(401, "Incorrect credentials", {})
                  );
                }
              }
            );
          }
        }
      );
    } else {
      log.error(`User: ${username} is not registered`);
      callback(new CustomResponse(401, "User is not registered", {}));
    }
  });
}
