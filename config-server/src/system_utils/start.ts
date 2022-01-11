import cron from 'node-cron';
import fs from 'fs';
import { deleteScheduleById, getAllSchedules } from '../database/schedule_repository';
import { getAllUsers } from "../database/user_repository";
import mountSeadrive from "../seafile_utils/mountSeadrive";
import unmountDirectory from "./unmountDirectory";

export function mountDirectoriesForSavedUsers(base_directory: string) {
    getAllUsers((error: any, result: any, fields: any) => {
        if (error) {
            console.error(error);
        } else if (result && result.length > 0) {
            for (let index in result) {
                let user = result[index];
                if (user.scope) {
                    unmountDirectory(user.scope);
                    mountSeadrive(`${base_directory}/${user.username}/seadrive.conf`, user.scope, `${base_directory}/${user.username}/seadrive.log`, true);
                }
            }
        }
    });
}

export function dowloadScheduledFiles() {
    cron.schedule('* * * * *', () => {
        getAllSchedules((error: any, result: any, fields: any) => {
            if (error) {
                console.error(error);
            } else if (result && result.length > 0) {
                let current = new Date();
                let time = current.toTimeString().substring(0, 5);
                for (let index in result) {
                    let schedule = result[index];
                    if (current.toLocaleDateString() == schedule.start_date && time >= schedule.start_time) {
                        console.log(`Date Matched for file ${schedule.filename}`);
                        deleteScheduleById(schedule.schedule_id, (error: any, result: any, fields: any) => {
                            if (error) {
                                console.error(error);
                            } else if (fs.existsSync(schedule.filename)) {
                                console.log(`Downloading file: ${schedule.filename}...`);
                                fs.readFile(schedule.filename, 'utf8', (error, data) => {
                                    if (error) {
                                        console.error(error);
                                    } else if (data) {
                                        console.log(`Successfully downloaded file: ${schedule.filename}`);
                                    }
                                });
                            } else {
                                console.log('File not exists');
                            }

                        });
                    }
                }
            }
        });
    });
}
