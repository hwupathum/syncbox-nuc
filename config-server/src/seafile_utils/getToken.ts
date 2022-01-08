import {exec} from 'child_process'

export default async function getToken(host: string, username: string, password: string, callback: Function) {
    let command: string = `curl -d "username=${username}" -d "password=${password}" ${host}/api2/auth-token/`;
    exec(command, (error, stdout, stderr) => {
        callback(error, stdout, stderr);
    });
}
