import mysql from 'mysql';

require('dotenv').config();

const host = process.env.DATABASE_HOST ?? 'http://172.17.0.1:3308';
const port = process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT) : 3308;
const user = process.env.DATABASE_USER ?? 'root'
const password = process.env.DATABASE_PASSWORD ?? 'secret';
const database = process.env.DATABASE_NAME ?? 'syncbox';

export default mysql.createConnection({ host, port, user, password, database });
