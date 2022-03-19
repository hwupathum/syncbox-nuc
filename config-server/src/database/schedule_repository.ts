import { MySQLResponse } from "../model/mysql_response.model";
import connection from "../utils/mysql_connection";

export function createNewSchedule(
  username: string,
  path: string,
  time: string,
  callback: Function
) {
  let sql_query = `INSERT INTO schedules (user_id, full_path, start_time) VALUES ((SELECT user_id FROM users WHERE username = '${username}'), '${path}', '${time}')`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function getAllSchedules(callback: Function) {
  let sql_query = "SELECT * FROM schedules";
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function getAllSchedulesByUsername(
  username: string,
  callback: Function
) {
  let sql_query = `SELECT * FROM schedules WHERE user_id = (SELECT user_id FROM users WHERE username = '${username}')`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function getScheduleByFilePath(
  username: string,
  path: string,
  callback: Function
) {
  let sql_query = `SELECT * FROM schedules WHERE full_path = '${path}' AND user_id = (SELECT user_id FROM users WHERE username = '${username}')`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function updateScheduledTime(
  username: string,
  path: string,
  time: string,
  callback: Function
) {
  let sql_query = `UPDATE schedules SET start_time = '${time}' WHERE user_id = (SELECT user_id FROM users WHERE username = '${username}') AND full_path = '${path}'`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function deleteScheduleById(schedule_ids: string, callback: Function) {
  let sql_query = `DELETE FROM schedules WHERE schedule_id IN (${schedule_ids})`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}
