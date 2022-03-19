import { MySQLResponse } from "../model/mysql_response.model";
import connection from "../utils/mysql_connection";

export function getFilesByUserId(
  username: any,
  file_names: string,
  callback: Function
) {
  let sql_query = `SELECT full_path, DATE_FORMAT(access_time, '%Y/%m/%d %h:%i:%s %p') as access_time FROM files WHERE user_id = (SELECT user_id FROM users WHERE username = '${username}') AND full_path IN (${file_names})`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function updateFileSyncedTime(
  user_id: number,
  file_names: string,
  callback: Function
) {
  let sql_query = `UPDATE files SET access_time = NOW() WHERE user_id = ${user_id} AND full_path = '${file_names}'`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}


