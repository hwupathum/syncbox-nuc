require("dotenv").config();
import express from "express";
import config from "config";
import log from "./utils/logger";
import connectToMySQLDatabase from "./utils/mysql_connection";
import router from "./routes";

const app = express();
const server_port = config.get<number>("server_port");

app.use(router);

app.listen(server_port, () => {
  log.info(`Application started at http://localhost:${server_port} ...`);
  connectToMySQLDatabase();
});
