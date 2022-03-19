require("dotenv").config();
import express from "express";
import cors from "cors";
import ip from "ip";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import config from "config";
import log from "./utils/logger";
import router from "./routes";
import {
  dowloadScheduledFiles,
  logFileAccessHistory,
  mountDirectoriesForSavedUsers,
} from "./system_utils/start";
import { connectToMySQLDatabase } from "./utils/mysql_connection";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const app = express();
app.use(cors({ credentials: true, origin: true }));
const server_port = config.get<number>("server_port");

app.use(cookieParser());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    name: "username",
    cookie: {
      maxAge: 60 * 60,
    },
    secret: "asecret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(router);

app.listen(server_port, () => {
  log.info(`Application started at http://${ip.address()}:${server_port} ...`);
  connectToMySQLDatabase();
  mountDirectoriesForSavedUsers();
  dowloadScheduledFiles();
  logFileAccessHistory();
});
