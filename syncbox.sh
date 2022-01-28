#!/bin/bash

start_config_server() {
    cd /home/melangakasun/Desktop/FYP/syncbox-nuc/config-server;
    npm start;
}

start_web_interface() {
    cd /home/melangakasun/Desktop/FYP/syncbox-nuc/web-interface;
    npm start;
}

sleep 60;
start_config_server & start_web_interface;
