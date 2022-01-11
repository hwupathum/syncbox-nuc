CREATE DATABASE IF NOT EXISTS syncbox;

USE syncbox;

CREATE TABLE IF NOT EXISTS users (
    userid INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    password LONGTEXT NOT NULL,
    scope VARCHAR(255) NOT NULL,
    PRIMARY KEY (userid)
);

CREATE TABLE IF NOT EXISTS schedules (
    schedule_id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    start_date VARCHAR(20) NOT NULL,
    start_time VARCHAR(10) NOT NULL,
    PRIMARY KEY (scheduleId)
);
