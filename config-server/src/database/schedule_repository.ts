import connection from "./connection";

export function createNewSchedule(username: string, filename: string, start_date: string, start_time: string, callback: Function) {
    let sql_query = 'INSERT INTO schedules SET ?';
    connection.query(sql_query, { username, filename, start_date, start_time }, (error, result, fields) => callback(error, result, fields));
}

export function getAllSchedules(callback: Function) {
    let sql_query = 'SELECT * FROM schedules';
    connection.query(sql_query, (error, result, fields) => callback(error, result, fields));
}

export function deleteScheduleById(schedule_id: number, callback: Function) {
    let sql_query = `DELETE FROM schedules WHERE schedule_id = ${schedule_id}`;
    connection.query(sql_query, (error, result, fields) => callback(error, result, fields));
}
