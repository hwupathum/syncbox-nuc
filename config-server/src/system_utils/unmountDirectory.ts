require('dotenv').config();

const SSH = require('simple-ssh');
const ssh = new SSH({ host: `${process.env.HOST_IP_ADDRESS}`, user: `${process.env.HOST_USERNAME}`, pass: `${process.env.HOST_PASSWORD}` });

export default function unmountDirectory(directory: string) {
    console.log(`Unmounting directory ${directory}...`);
    let command: string = `fusermount -uz ${directory}`;
    ssh.exec(command, {
        out: function (stdout: string) { console.log(stdout); },
        err: function (stderr: string) { console.log(`An error occurred ${stderr}`); },
        exit: function (code: number | string) { console.log(code === 0 ? `${directory} is unmounted successfully...` : `code ${code}`); },
    }).start();
}
