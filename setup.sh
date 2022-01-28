#!/bin/bash

#################################################################################
# Copy the SyncBox script to /usr/bin and make it executable
#################################################################################

sudo cp syncbox.sh /usr/bin/syncbox.sh
sudo chmod +x /usr/bin/syncbox.sh

#################################################################################
# Copy the SyncBox service file to /etc/systemd/system and give it permissions
#################################################################################

sudo cp syncbox.service /etc/systemd/system/syncbox.service
sudo chmod 644 /etc/systemd/system/syncbox.service

#################################################################################
# Start and enable the SyncBox service
#################################################################################

sudo systemctl daemon-reload
sudo systemctl start syncbox
sudo systemctl enable syncbox

exit 0