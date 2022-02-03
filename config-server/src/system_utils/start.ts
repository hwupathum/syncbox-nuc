import cron from 'node-cron';
import fs from 'fs';
import { deleteScheduleById, getAllSchedules } from '../database/schedule_repository';
import { getAllUsers, getUserByUserId } from "../database/user_repository";
import mountSeadrive from "../seafile_utils/mountSeadrive";
import unmountDirectory from "./unmountDirectory";
import { updateFileSyncedTime } from '../database/file_repository';

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

export function dowloadScheduledFiles(base_directory: string) {
    cron.schedule('* * * * *', () => {
        getAllSchedules((error: any, results: any, fields: any) => {
            if (error) {
                console.error(error);
            } else if (results && results.length > 0) {
                let current = new Date();
                results.forEach((schedule: any) => {
                    if (current >= schedule.start_time) {
                        console.log(`Date Matched for file ${schedule.full_path}`);

                        getUserByUserId(schedule.user_id, (error: any, result: any, fields: any) => {
                            if (error) {
                                console.error(error);
                            } else if (result && result.length > 0) {
                                let user = result[0];
                                let file_path = `${user.scope}/${schedule.full_path}`;
                                console.log(file_path);
                                
                                deleteScheduleById(schedule.schedule_id, (error: any, result: any, fields: any) => {
                                    if (error) {
                                        console.error(error);
                                    } else if (fs.existsSync(file_path)) {
                                        console.log(`Downloading file: ${schedule.full_path}...`);
                                        fs.readFile(file_path, 'utf8', (error, data) => {
                                            if (error) {
                                                console.error(error);
                                            } else if (data) {
                                                console.log(`Successfully downloaded file: ${schedule.full_path}`);
                                                updateFileSyncedTime(schedule.user_id, schedule.full_path, (error: any, result: any, fields: any) => {
                                                    if (error) {
                                                        console.error(error);
                                                    } else {
                                                        console.log(`Database updated for ${schedule.full_path} file with synced data`);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        console.log('File not exists');
                                    }
                                });
                            } 
                        });
                    }
                });
            }
        });
    });
}
