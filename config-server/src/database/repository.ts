import connection from "./connection";

export function addNewUser(username: string, password: string, scope: string, callback: Function) {
    let sql_query = 'INSERT INTO users SET ?';
    connection.query(sql_query, { username, password, scope }, (error, result, fields) => callback(error, result, fields));
}

export function getUserByUsername(username: string, callback: Function) {
    let sql_query = `SELECT * FROM users WHERE username = '${username}'`;
    connection.query(sql_query, (error, result, fields) => callback(error, result, fields));
}

export function updateUserPasswordByUsername(username: string, password: string, callback: Function) {
    let sql_query = 'UPDATE users SET password = ? WHERE username = ?';
    connection.query(sql_query, [password, username], (error, result, fields) => callback(error, result, fields));
}
