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
import bcrypt from 'bcrypt';
import cron from 'node-cron';
import yaml from 'js-yaml';
import unmountDirectory from './system_utils/unmountDirectory';
import { saveUser, getAllUsers, getUser, deleteUser, scheduleDownload, getAllSchedulers, deleteScheduler } from './system_utils/redis';
import deleteDirectory from './system_utils/deleteDirectory';
import { ExecException } from 'child_process';

require('dotenv').config();

declare module 'express-session' {
    export interface SessionData {
        user: { [key: string]: any };
    }
}

const seeafile_host = process.env.SEAFILE_HOST ?? 'http://172.17.0.1:7080';
const server_port = process.env.SERVER_PORT ?? 1901;
const base_directory = process.env.VIRTUAL_DRIVE_CONTAINER_DIRECTORY ?? '/home/melangakasun/Desktop/FYP/test';
const config_file_location = 'auth-config.yaml';

const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
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
    let data: any = getUserFromConfigFile(username);

    // check user is registered
    if (data?.error) {
        console.error(`An error occurred... ${data.error.message}`);
        res.status(500).send({ error: data.error.message });
    } else if (data?.user) {
        console.error(`User: ${username} is already registered`);
        res.status(500).send({ error: `User: ${username} is already registered` });
    } else {
        // get access token from server
        getToken(seeafile_host, username, password, (error: ExecException | null, stdout: string, stderr: string) => {
            if (stdout) {
                let opt: any = JSON.parse(stdout);
                if (opt.non_field_errors) {
                    console.error(opt.non_field_errors);
                    res.status(401).send({ error: 'Unable to register with the provided credentials' });
                } else if (opt.token) {
                    console.log(`Successfully logged in... Username: ${username}, Token: ${opt.token}`);
                    let user_directory: string = `${base_directory}/${username}`;
                    if (!fs.existsSync(`${user_directory}/data`)) {
                        // creating a directory for the user
                        console.log(`Creating directory... ${user_directory}/data`);
                        fs.mkdirSync(`${user_directory}/data`, { recursive: true });
                    }
                    if (!fs.existsSync(`${user_directory}/seadrive.conf`)) {
                        // creating the seadrive.conf file for the user
                        console.log(`Creating the configuration file...`);
                        createConfig(`${user_directory}/seadrive.conf`, seeafile_host, username, opt.token, username);
                    }
                    // Mounting the directory
                    console.log(`Mounting with the Seadrive directory...`);
                    mountSeadrive(`${user_directory}/seadrive.conf`, `${user_directory}/data`, `${user_directory}/seadrive.log`, true);
                    // await jsonCache.set('users', users);
                    // saveUserInRedis(username, password, `${user_directory}/data`);
                    saveUserAndPassword(username, password, `${user_directory}/data`);
                    console.log(`Successfully logged in...`);
                    req.session.user = { name: username, token: opt.token };
                    res.status(200).send({ token: opt.token });
                }
            } else {
                console.error(error ? error.message : stderr);
                res.status(500).send({ error: error ? error.message : stderr });
            }
        });
    }
});

app.post('/login', async (req, res) => {
    let username: string = req.body.username;
    let password: string = req.body.password;
    console.log(`Login request... Username: ${username}`);
    let data: any = getUserFromConfigFile(username);
    // updateUserPassword(username, '123');

    // check user is registered
    if (data?.error) {
        console.error(`An error occurred... ${data.error.message}`);
        res.status(500).send({ error: data.error.message });
    } else if (data?.user) {
        let user_data = data.user;
        // get access token from server
        getToken(seeafile_host, username, password, (error: ExecException | null, stdout: string, stderr: string) => {
            if (stdout) {
                let opt: any = JSON.parse(stdout);
                if (opt.non_field_errors) {
                    bcrypt.compare(password, user_data.password, (error, reply) => {
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
                    bcrypt.compare(password, user_data.password, (error, reply) => {
                        if (!reply) {
                            // update the SyncBox password and configuration file
                            // saveUserInRedis(username, password, `${base_directory}/${username}/data`);
                            updateUserPassword(username, password);
                            updateConfigurationFile(`${base_directory}/${username}/seadrive.conf`, opt.token);
                        }
                        console.log(`Successfully logged in... Username: ${username}, Token: ${opt.token}`);
                        req.session.user = { name: username, token: opt.token };
                        res.status(200).send({ token: opt.token });
                    });
                }
            } else {
                // cannot connect to the server
                console.error(error?.message);
                bcrypt.compare(password, user_data.password, (error, reply) => {
                    if (error) {
                        console.error(`An error occurred... ${error.message}`);
                        res.status(500).send({ error: error.message });
                    } else if (reply) {
                        let { token, error } = getTokenFromConfigFile(username);
                        if (error) {
                            console.error(`An error occurred... ${error}`);
                            res.status(500).send({ error });
                        } else if (token) {
                            console.log(`Successfully logged in... Username: ${username}, Token: ${token}`);
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
    try {
        let user_list: any = getAllUsersFromConfigFile();
        if (user_list?.users && user_list.users.length > 0) {
            for (let index in user_list.users) {
                let user = user_list.users[index];
                if (user.rules?.path) {
                    unmountDirectory(user.rules.path);
                    mountSeadrive(`${base_directory}/${user.username}/seadrive.conf`, user.rules.path, `${base_directory}/${user.username}/seadrive.log`, true);
                }
            }
        } else if (user_list?.error) {
            console.error(`An error occurred... ${user_list.error}`);
        }
    } catch (error) {
        console.error(error);
    }
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

function getUserFromConfigFile(username: string): any {
    try {
        let data: any = yaml.load(fs.readFileSync(config_file_location, 'utf8'));
        let users = data.users ? data.users : [];
        for (let i = 0; i < users.length; i++) {
            let user_object = users[i];
            if (user_object.username === username) {
                console.log(`${username} is registered with the SyncBox...`);
                return { user: user_object };
            }
        }
        return;
    } catch (e) {
        return { error: e }
    }
}

function updateUserPassword(username: string, password: string) {
    try {
        let data: any = yaml.load(fs.readFileSync(config_file_location, 'utf8'));
        let users = data.users ?? [];

        for (let i = 0; i < users.length; i++) {
            let user_object = users[i];
            if (user_object.username === username) {
                bcrypt.hash(password, 10, function (err: any, hash: string) {
                    if (err) {
                        console.error(err);
                    } else if (hash) {
                        user_object.password = `{bcrypt}${hash}`;
                        data.users[i] = user_object;
                        let yaml_string = yaml.dump(data);
                        fs.writeFileSync(config_file_location, yaml_string, 'utf8');
                        console.log(`Successfully updated the password of ${username}...`);
                    }
                });
                break;
            }
        }
    } catch (error) {
        console.error(`An error occurred ${error}`);
    }
}

function saveUserAndPassword(username: string, password: string, directory: string) {
    try {
        let data: any = yaml.load(fs.readFileSync(config_file_location, 'utf8'));
        let user_count = data.users ? data.users.length : 0;
        bcrypt.hash(password, 10, function (err: any, hash: string) {
            if (err) {
                console.error(err);
            } else if (hash) {
                data.users[user_count] = { username, password: `{bcrypt}${hash}`, rules: { path: directory, modify: true } };
                let yaml_string = yaml.dump(data);
                fs.writeFileSync(config_file_location, yaml_string, 'utf8');
                console.log(`Successfully updated the password of ${username}...`);
            }
        });
    } catch (error) {
        console.error(`An error occurred ${error}`);
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
