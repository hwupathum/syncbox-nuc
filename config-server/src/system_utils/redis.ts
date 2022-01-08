import redis from 'redis';

const redis_port = 6379;

const redis_client = redis.createClient(redis_port, '172.17.0.1');

export function saveUser(username: string, user_data: string): void {
    redis_client.hset('users', username, user_data, (error, reply) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`User: ${username} saved in the database...`);
        }
    });
}

export function getUser(username: string, callback: Function) {
    redis_client.hget('users', username, (error, reply) => {
        callback(error, reply);
    });
}

export function getAllUsers(callback: Function) {
    redis_client.hgetall('users', (error, data) => {
        if (error) {
            console.error(error);
        } else if (data) {
            callback(data);
        }
    });
}

export function deleteUser(username: string, callback: Function) {
    redis_client.hdel('users', username, (error, reply) => {
        callback(error, reply);
    });
}

export function scheduleDownload(file: string, schedule_data: string): void {
    redis_client.hset('shedulers', file, schedule_data, (error, reply) => {
        if (error) {
            console.error(error);
        } else {
            console.log(`File: ${file} saved in the database...`);
        }
    });
}

export function getAllSchedulers(callback: Function) {
    redis_client.hgetall('shedulers', (error, data) => {
        if (error) {
            console.error(error);
        } else if (data) {
            callback(data);
        }
    });
}

export function deleteScheduler(filename: string) {
    redis_client.hdel('shedulers', filename, (error, reply) => {
        if (error) {
            console.error(error);
        } else if (reply) {
            console.log(`Successfully deleted the file ${filename}`);
        }
    });
}
