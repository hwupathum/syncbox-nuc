require("dotenv").config();
import express from "express";
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import config from "config";
import log from "./utils/logger";
import connectToMySQLDatabase from "./utils/mysql_connection";
import router from "./routes";

declare module "express-session" {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

const app = express();
const server_port = config.get<number>("server_port");

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
  name: 'username',
  cookie: {
      maxAge: 60 * 60
  },
  secret: 'asecret',
  resave: true,
  saveUninitialized: true
}));

app.use(router);

app.listen(server_port, () => {
  log.info(`Application started at http://localhost:${server_port} ...`);
  connectToMySQLDatabase();
});
