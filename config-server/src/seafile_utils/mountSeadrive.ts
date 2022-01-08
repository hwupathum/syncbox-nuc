require('dotenv').config();

const SSH = require('simple-ssh');
const ssh = new SSH({ host: `${process.env.HOST_IP_ADDRESS}`, user: `${process.env.HOST_USERNAME}`, pass: `${process.env.HOST_PASSWORD}` });
const data_directory = process.env.SEAFILE_DATA_DIRECTORY ?? '~/.seadrive/data';

export default function mountSeadrive(config: string, virtualDriveDir: string, logFile?: string, isForeground?: boolean) {
    console.log(`Mounting seadrive to ${virtualDriveDir}...`);
    let command: string = `seadrive -c ${config} ${isForeground ? '-f' : ''} -d ${data_directory} ${logFile ? `-l ${logFile}` : ''} ${virtualDriveDir}`;
    ssh.exec(command, {
        out: function (stdout: any) { console.log(stdout); },
        err: function (stderr: any) { console.log(`An error occurred ${stderr}`); },
        exit: function (code: any) { console.log(code === 0 ? `Mounted directory ${virtualDriveDir} successfully...` : `code ${code}`); },
    }).start();
}
