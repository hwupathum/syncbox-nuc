var exec = require('child_process').exec;

export default function unmountDirectory(directory: string) {
    console.log(`Unmounting directory ${directory}...`);
    let command: string = `fusermount -uz ${directory}`;
    exec(command, (error: any, stdout: any, stderr: any) => {
        if (stdout) {
            console.log(`${directory} is unmounted successfully...`);
        } else {
            console.error(`An error occurred ${error || stderr}`);
        }
    });
}
