import mysql from "mysql";
import config from "config";
import log from "./logger";

async function connectToMySQLDatabase() {
  const mysql_host = config.get<string>("mysql_host");
  const mysql_port = config.get<number>("mysql_port");
  const mysql_user = config.get<string>("mysql_user");
  const mysql_password = config.get<string>("mysql_password");
  const mysql_database = config.get<string>("mysql_database");

  try {
    const connection = mysql.createConnection({
      host: mysql_host,
      port: mysql_port,
      user: mysql_user,
      password: mysql_password,
      database: mysql_database,
    });
    connection.connect((error) => {
      if (error) {
        log.error(`Error connecting: ${error.stack} ...`);
        return;
      }
      log.info(`Successfully connected to MySQL ...`);
    });
  } catch (error) {
    process.exit(1);
  }
}

export default connectToMySQLDatabase;
