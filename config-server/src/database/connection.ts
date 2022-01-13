import mysql from 'mysql';

require('dotenv').config();

const host = 'http://database';
const port = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3308;
const user = process.env.DATABASE_USER ?? 'root'
const password = process.env.DATABASE_PASSWORD ?? 'secret';
const database = process.env.DATABASE_NAME ?? 'syncbox';

const connection = mysql.createConnection({ host, port, user, password, database });
connection.connect((error) => {
    if (error) {
        console.error('error connecting: ' + error.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

export default connection;
