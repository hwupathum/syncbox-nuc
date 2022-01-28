#!/usr/bin/bash

CONFIG_SERVER_PID=0;
WEB_INTERFACE_PID=0;
WEBDAV_SERVER_PID=0;

# ****************************************************
# INSTALL THE MYSQL SERVER IF IT IS NOT ALREADY IN
# ****************************************************

type mysql >/dev/null 2>&1 && echo "MySQL is already installed..." || \
( echo "MySQL is not installed..." && sudo apt update && sudo apt install mysql-server && echo "MySQL is installed..."  );

# ****************************************************
# START THE MYSQL SERVER IF IT IS NOT RUNNING
# ****************************************************

UP=$(pgrep mysql | wc -l);
if [ "$UP" -eq 0 ];
then
        echo "MySQL is down...";
        sudo service mysql start --init-file /data/application/init.sql
else
        echo "MySQL is running...";
fi

# ****************************************************
# START/STOP THE CONFIG SERVER
# ****************************************************

start_config_server() {
        cd /home/melangakasun/Desktop/FYP/syncbox-nuc/config-server;
        npm start;
        CONFIG_SERVER_PID=$(ps -aux | grep syncbox-config-server);
}

stop_config_server() {
        kill -9 $CONFIG_SERVER_PID;
}

# ****************************************************
# START/STOP THE WEB INTERFACE
# ****************************************************

start_web_interface() {
        cd /home/melangakasun/Desktop/FYP/syncbox-nuc/web-interface;
        npm start;
        WEB_INTERFACE_PID=$(ps -aux | grep syncbox-web-interface); 
}

stop_web_interface() {
        kill -9 $WEB_INTERFACE_PID;
}

# ****************************************************
# START/STOP THE WEBDAV SERVER
# ****************************************************

# TODO

case "$1" in 
        start)
                start_config_server & start_web_interface;
        ;;
        stop)
                stop_config_server  & stop_web_interface;        
        ;;
        restart)
                stop_config_server;
                stop_web_interface;   
                start_config_server;
                start_web_interface;
        ;;
        status)
                # code to check status of app comes here 
                # example: status program_name
        ;;
        *)
        echo "Usage: $0 {start|stop|status|restart}"
esac

exit 0 