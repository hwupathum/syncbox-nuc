#!/bin/bash

start_config_server() {
    cd /home/$USER/syncbox-nuc/config-server;
    npm start;
}

start_web_interface() {
    cd /home/$USER/syncbox-nuc/web-interface;
    npm start;
}

start_sql_database() {
    cd /home/$USER/syncbox-nuc;
    docker-compose up -d;
}

start_sql_database & start_config_server & start_web_interface;
