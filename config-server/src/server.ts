// TypeScript
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import mountSeadrive from './seafile_utils/mountSeadrive';
import createConfig from './seafile_utils/createConfig';
import getToken from './seafile_utils/getToken';
import path from 'path';
import fs from 'fs';
import cron from 'node-cron';
import yaml from 'js-yaml';
import unmountDirectory from './system_utils/unmountDirectory';
import { getUser, deleteUser, scheduleDownload, getAllSchedulers, deleteScheduler } from './system_utils/redis';
import { addNewUser, getAllUsers, getUserByUsername, updateUserPasswordByUsername } from './database/repository';
import deleteDirectory from './system_utils/deleteDirectory';
import { ExecException } from 'child_process';
import { comparePassword, hashPassword } from './security/bcrypt';

require('dotenv').config();

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}

const host_ip = process.env.HOST_IP_ADDRESS ?? '172.17.0.1';
const seafile_host = process.env.SEAFILE_HOST ?? 'http://www.nextbox.lk:81';
const server_port = process.env.SERVER_PORT ?? 1901;
const base_directory = process.env.VIRTUAL_DRIVE_CONTAINER_DIRECTORY ?? '/home/melangakasun/Desktop/FYP/test';
const config_file_location = 'auth-config.yaml';

const app = express();
app.use(cors({
    origin: [`http://${host_ip}:3000`, `http://${host_ip}:3001`],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(session({
    name: 'username',
    cookie: {
        maxAge: 60 * 60
    },
    secret: 'asecret',
    resave: true,
    saveUninitialized: true
}));

app.post('/register', (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;
    console.log(`Register request... Username: ${username}`);

    getUserByUsername(username, (error: any, result: any, fields: any) => {
        if (error) {
            console.error(error);
            res.status(500).send({ error: error.message });
        } else if (result.length > 0) {
            console.log(`Successfully received the user ${username} from the database...`);
            console.error(`User: ${username} is already registered`);
            res.status(500).send({ error: `User: ${username} is already registered` });
        } else {
            // get access token from server
            getToken(seafile_host, username, password, (error: ExecException | null, stdout: string, stderr: string) => {
                if (stdout) {
                    let opt: any = JSON.parse(stdout);
                    if (opt.non_field_errors) {
                        console.error(opt.non_field_errors);
                        res.status(401).send({ error: 'Unable to register with the provided credentials' });
                    } else if (opt.token) {
                        console.log(`Successfully logged in... Username: ${username}`);
                        let user_directory: string = `${base_directory}/${username}`;

                        // creating a directory for the user
                        if (!fs.existsSync(`${user_directory}/data`)) {
                            console.log(`Creating directory... ${user_directory}/data`);
                            fs.mkdirSync(`${user_directory}/data`, { recursive: true });
                        }

                        // creating the seadrive.conf file for the user
                        if (!fs.existsSync(`${user_directory}/seadrive.conf`)) {
                            console.log(`Creating the configuration file...`);
                            createConfig(`${user_directory}/seadrive.conf`, seafile_host, username, opt.token, username);
                        }

                        // Mounting the directory
                        mountSeadrive(`${user_directory}/seadrive.conf`, `${user_directory}/data`, `${user_directory}/seadrive.log`, true);
                        hashPassword(password, (error: Error | undefined, hash: string) => {
                            if (error) {
                                console.error(error);
                                res.status(500).send({ error: error.message });
                            } else {
                                addNewUser(username, hash, `${user_directory}/data`, (error: any, result: any, fields: any) => {
                                    if (error) {
                                        console.error(error);
                                        res.status(500).send({ error: error.message });
                                    } else {
                                        console.log(`Successfully saved the user ${username} in the database...`);
                                        console.log(`Successfully logged in...`);
                                        req.session.user = { name: username, token: opt.token };
                                        res.status(200).send({ token: opt.token });
                                    }
                                });
                            }
                        });
                    } else {
                        console.error(error ? error.message : stderr);
                        res.status(500).send({ error: error ? error.message : stderr });
                    }
                }
            });
        }
    });
});

app.post('/login', async (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;
    console.log(`Login request... Username: ${username}`);

    getUserByUsername(username, (error: any, result: any, fields: any) => {
        if (error) {
            console.error(`An error occurred... ${error.message}`);
            res.status(500).send({ error: error.message });
        } else if (result.length > 0) {
            let user_data = result[0];

            // get access token from server
            getToken(seafile_host, username, password, (error: ExecException | null, stdout: string, stderr: string) => {
                if (stdout) {
                    let opt: any = JSON.parse(stdout);
                    if (opt.non_field_errors) {
                        comparePassword(password, user_data.password, (error: Error | undefined, reply: boolean) => {
                            if (error) {
                                console.error(`An error occurred... ${error.message}`);
                                res.status(500).send({ error: error.message });
                            } else if (reply) {
                                // Server password changed but not updated the SyncBox
                                console.error(`${username} has changed the server password...`);
                                res.status(401).send({ error: 'Server password was changed' });
                            } else {
                                console.error(`An error occurred... ${opt.non_field_errors}`);
                                res.status(401).send({ error: opt.non_field_errors });
                            }
                        });
                    } else if (opt.token) {
                        comparePassword(password, user_data.password, (error: Error | undefined, reply: boolean) => {
                            if (!reply) {
                                // update the SyncBox password and configuration file
                                // saveUserInRedis(username, password, `${base_directory}/${username}/data`);
                                hashPassword(password, (error: Error | undefined, hash: string) => {
                                    if (error) {
                                        console.error(error);
                                        res.status(500).send({ error: error.message });
                                    } else {
                                        updateUserPasswordByUsername(username, hash, (error: any, result: any, fields: any) => {
                                            if (error) {
                                                console.error(error);
                                                res.status(500).send({ error: error.message });
                                            } else {
                                                console.log(`Successfully updated the password of ${username} in the database...`);
                                            }
                                        });
                                    }
                                });
                                // updateUserPassword(username, password);
                                updateConfigurationFile(`${base_directory}/${username}/seadrive.conf`, opt.token);
                            }
                            console.log(`${username} successfully logged in...`);
                            req.session.user = { name: username, token: opt.token };
                            res.status(200).send({ token: opt.token });
                        });
                    }
                } else {
                    // cannot connect to the server
                    console.error(error?.message);
                    comparePassword(password, user_data.password, (error: Error | undefined, reply: boolean) => {
                        if (error) {
                            console.error(`An error occurred... ${error.message}`);
                            res.status(500).send({ error: error.message });
                        } else if (reply) {
                            let { token, error } = getTokenFromConfigFile(username);
                            if (error) {
                                console.error(`An error occurred... ${error}`);
                                res.status(500).send({ error });
                            } else if (token) {
                                console.log(`${username} successfully logged in...`);
                                req.session.user = { name: username, token };
                                res.status(200).send({ token });
                            }
                        } else {
                            console.error('Incorrect credentials');
                            res.status(401).send({ error: 'Incorrect credentials' });
                        }
                    });
                }
            });
        } else {
            console.error(`User: ${username} is not registered`);
            res.status(500).send({ error: `User: ${username} is not registered` });
        }
    });
});

app.get('/data', async (req, res) => {
    const username = req.query?.username;
    const location = req.query?.location;

    if (username) {
        let user_directory: string = `${base_directory}/${username}/data`;
        if (location) {
            user_directory += `/${location}`;
        }
        fs.readdir(user_directory, (error, results) => {
            if (error) {
                res.status(500).send({ error });
            } else if (results) {
                const directories: any = [];
                const files: any = [];
                results.forEach(result => {
                    let name = path.join(user_directory, result);
                    let size = convertBytes(fs.statSync(name).size);
                    if (fs.lstatSync(name).isDirectory()) {
                        directories.push({ name: result, size });
                    } else {
                        files.push({ name: result, size });
                    }
                });
                res.status(200).send({ data: { directories, files } });
            }
        });
    } else {
        res.status(500).send({ error: 'Username is not provided' });
    }
});

app.get('/download', async (req, res) => {
    const username = req.query?.username;
    const filename = req.query?.filename;

    if (username && filename) {
        let file: string = `${base_directory}/${username}/data${filename}`;
        console.log(file);

        if (fs.existsSync(file)) {
            console.log(`Downloading file: ${filename}`);
            fs.readFile(file, 'utf8', (error, data) => {
                if (error) {
                    console.error(error);
                    res.status(500).send({ error });
                } else if (data) {
                    console.log(`Successfully downloaded file: ${filename}`);
                    res.status(200).send({ download: true });
                }
            });
        } else {
            res.status(404).send({ error: 'File not exists' });
        }
    } else {
        res.status(500).send({ error: 'Username/Filename is not provided' });
    }
});

app.get('/schedule', async (req, res) => {
    const username = req.query?.username;
    const filename = req.query?.filename;
    const day = req.query?.day;
    const time = req.query?.time;

    if (username && filename && day && time) {
        try {
            let file: string = `${base_directory}/${username}/data${filename}`;
            if (fs.existsSync(file)) {
                let schedule_data = { file, date: new Date(JSON.stringify(day)).toLocaleDateString(), time };
                scheduleDownload(file, JSON.stringify(schedule_data));
                res.status(200).send({ download: true });
            } else {
                res.status(404).send({ error: 'File not exists' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    } else {
        res.status(500).send({ error: 'Username/Filename/Start Time is not provided' });
    }
});

const convertBytes = (bytes: number) => {
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

    if (bytes == 0) {
        return "n/a";
    }

    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    if (i == 0) {
        return bytes + " " + sizes[i];
    }
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
}

app.delete('/remove', async (req, res) => {
    let username: string = req.body.username;
    console.log(`Logout request... Username: ${username}`);

    // check if user already registered
    getUser(username, (error: Error | null, data: string) => {
        if (error) {
            console.error(error.message);
            res.status(500).send({ error: error.message });
        } else if (data) {
            let user_data: any = JSON.parse(data);
            deleteUser(username, (error: Error | null, reply: string) => {
                if (error) {
                    console.error(error.message);
                    res.status(500).send({ error: error.message });
                } else {
                    unmountDirectory(user_data.Scope);
                    deleteDirectory(user_data.Scope);
                    console.log(`Successfully removed the user... Username: ${username}`);
                    res.status(200).send({ response: 'Successfully removed the user' });
                }
            });
        } else {
            console.error(`User: ${username} is not available...`);
            res.status(404).send({ error: 'User not found' });
        }
    });
});

app.listen(server_port, () => {
    mountDirectoriesForSavedUsers();
    dowloadScheduledFiles();
});

function mountDirectoriesForSavedUsers() {
    getAllUsers((error: any, result: any, fields: any) => {
        if (error) {
            console.error(error);
        } else if (result && result.length > 0) {
            for (let index in result) {
                let user = result[index];
                console.log(user);
                if (user.scope) {
                    unmountDirectory(user.scope);
                    mountSeadrive(`${base_directory}/${user.username}/seadrive.conf`, user.scope, `${base_directory}/${user.username}/seadrive.log`, true);
                }
            }
        }
    });
}

function dowloadScheduledFiles() {
    cron.schedule('* * * * *', () => {
        getAllSchedulers((schedulers: { [s: string]: string; }) => {
            let current = new Date();
            let time = current.toTimeString().substring(0, 5);
            for (let [filename, file_data] of Object.entries(schedulers)) {
                try {
                    let scheduled_file = JSON.parse(file_data);
                    if (current.toLocaleDateString() == scheduled_file.date && time >= scheduled_file.time) {
                        console.log('Date Matched !', time, scheduled_file);
                        deleteScheduler(filename);
                        if (fs.existsSync(filename)) {
                            console.log(`Downloading file: ${filename}`);
                            fs.readFile(filename, 'utf8', (error, data) => {
                                if (error) {
                                    console.error(error);
                                } else if (data) {
                                    console.log(`Successfully downloaded file: ${filename}`);
                                }
                            });
                        } else {
                            console.log('File not exists');
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        });
    });
}

function getAllUsersFromConfigFile(): any {
    try {
        let data: any = yaml.load(fs.readFileSync(config_file_location, 'utf8'));
        return { users: data.users ?? [] };
    } catch (e) {
        return { error: e }
    }
}

function updateConfigurationFile(file_name: string, new_token: string) {
    try {
        fs.readFile(file_name, 'utf8', (error, content) => {
            if (error) {
                console.error(`An error occurred... ${error.message}`);
            } else if (content) {
                let old_token = content.split('\n')[3].substring(8);
                fs.writeFile(file_name, content.replace(old_token, new_token), 'utf8', (error) => {
                    if (error) {
                        console.error(`An error occurred... ${error.message}`);
                    }
                });
            }
        });
    } catch (error) {
        console.error(`An error occurred... ${error}`);
    }
}

function getTokenFromConfigFile(username: string): any {
    fs.readFile(`${base_directory}/${username}/seadrive.conf`, 'utf8', (error, data) => {
        if (error) {
            console.error(error);
            return { error: 'Unable to access the configuration file' };
        } else if (data) {
            return { token: data.split('\n')[3].substring(8) };
        }
    });
}
