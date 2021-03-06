# pip install mysql-connector-python

import os
from datetime import datetime
import mysql.connector
import requests

def updatelog(id, username, filename, path, parent):
    mycursor.execute("SELECT full_path, access_time FROM files WHERE user_id = " + str(id))
    files = mycursor.fetchall()

    files_dic = {}
    for full_path, access_time in files:
        files_dic[full_path] = int(access_time.timestamp())

    with open(filename, "a", encoding="utf-8", errors="backslashreplace") as file_object:
        for path, subdirs, files in os.walk(path):
            for name in files:
                full_path = os.path.join(path, name)
                info = os.stat(full_path)

                try:
                    modified = files_dic[full_path.replace(parent, "")]
                except:
                    modified = 0

                info_tuple = (username, datetime.date(datetime.now()).strftime("%m/%d/%Y.log"), full_path.replace(parent, ""), info.st_size, int(info.st_mtime), modified, info.st_ino)
                file_object.write("\t".join(map(str,info_tuple)))
                file_object.write("\n")

mydb = mysql.connector.connect(
    host="localhost",
    user="syncbox",
    password="Secret@123",
    port="3306",
    database="syncbox"
)

mycursor = mydb.cursor()

mycursor.execute("SELECT user_id, username, scope FROM users")

users = mycursor.fetchall()

filename = datetime.now().strftime("%Y-%m-%d.log")

for id, user, scope in users:
    print(id, user, scope)
    updatelog(id, user, filename, scope, scope)

endpoint = "http://localhost:8000/uploadLogs/"
data = {'date': datetime.now()}
files = {'log_file': (filename, open(filename, 'rb'), 'text/plain'), 'Content-Type': 'text/plain'}
response = requests.post(url = endpoint, data = data, files = files)
print(response)
