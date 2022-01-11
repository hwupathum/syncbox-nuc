import connection from "./connection";

export function createNewSchedule(username: string, filename: string, start_date: string, start_time: string, callback: Function) {
    let sql_query = 'INSERT INTO schedules SET ?';
    connection.query(sql_query, { username, filename, start_date, start_time }, (error, result, fields) => callback(error, result, fields));
}
