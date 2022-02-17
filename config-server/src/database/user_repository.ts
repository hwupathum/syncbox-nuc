import { CustomResponse } from "../custom_response.ts";
import { MySQLResponse } from "../model/mysql_response.model";
import connection from "./connection";

export function addNewUser(
  username: string,
  password: string,
  scope: string,
  callback: Function
) {
  let sql_query = "INSERT INTO users SET ?";
  connection.query(
    sql_query,
    { username, password, scope },
    (error, result, fields) =>
      callback(new MySQLResponse(error, result, fields))
  );
}

export function getAllUsers(callback: Function) {
  let sql_query = "SELECT * FROM users";
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function getUserByUserId(user_id: number, callback: Function) {
  let sql_query = `SELECT * FROM users WHERE user_id = ${user_id}`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function getUserByUsername(username: string, callback: Function) {
  let sql_query = `SELECT * FROM users WHERE username = '${username}'`;
  connection.query(sql_query, (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function updateUserPasswordByUsername(
  username: string,
  password: string,
  callback: Function
) {
  let sql_query = "UPDATE users SET password = ? WHERE username = ?";
  connection.query(sql_query, [password, username], (error, result, fields) =>
    callback(error, result, fields)
  );
}

export function updateUserPasswordByUserId(
  user_id: number,
  password: string,
  callback: Function
) {
  let sql_query = "UPDATE users SET password = ? WHERE user_id = ?";
  connection.query(sql_query, [password, user_id], (error, result, fields) =>
    callback(new MySQLResponse(error, result, fields))
  );
}

export function deleteUserById(user_id: number, callback: Function) {
  let sql_query = `DELETE FROM users WHERE user_id = ${user_id}`;
  connection.query(sql_query, (error, result, fields) =>
    callback(error, result, fields)
  );
}
