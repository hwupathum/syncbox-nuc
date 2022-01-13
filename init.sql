CREATE DATABASE IF NOT EXISTS syncbox;

USE syncbox;

CREATE TABLE IF NOT EXISTS users (
    user_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    scope VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    full_path TEXT NOT NULL,
    start_time DATETIME NOT NULL,
    PRIMARY KEY (schedule_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS logs (
    log_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    path TEXT NOT NULL,
    extension VARCHAR(5) NOT NULL,
    acess_time DATETIME NOT NULL,
    mod_time DATETIME NOT NULL,
    size INT NOT NULL,
    PRIMARY KEY (log_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
