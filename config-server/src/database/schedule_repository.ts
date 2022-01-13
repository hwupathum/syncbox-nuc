import connection from "./connection";

export function createNewSchedule(username: string, path: string, time: string, callback: Function) {
    let sql_query = `INSERT INTO schedules (user_id, full_path, start_time) VALUES ((SELECT user_id FROM users WHERE username = ${username}), '${path}', '${time}')`;
    connection.query(sql_query, (error, result, fields) => callback(error, result, fields));
}

export function getAllSchedules(callback: Function) {
    let sql_query = 'SELECT * FROM schedules';
    connection.query(sql_query, (error, result, fields) => callback(error, result, fields));
}

export function deleteScheduleById(schedule_id: number, callback: Function) {
    let sql_query = `DELETE FROM schedules WHERE schedule_id = ${schedule_id}`;
    connection.query(sql_query, (error, result, fields) => callback(error, result, fields));
}
