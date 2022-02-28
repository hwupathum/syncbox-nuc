# pip install mysql-connector-python

import os
from datetime import datetime
import mysql.connector

def updatelog(username, filename, path, parent):
    with open(filename, "a", encoding="utf-8", errors="backslashreplace") as file_object:
        for path, subdirs, files in os.walk(path):
            for name in files:
                full_path = os.path.join(path, name)
                info = os.stat(full_path)
                info_tuple = (username, datetime.date(datetime.now()), full_path.replace(parent, ""), info.st_size, datetime.fromtimestamp(info.st_mtime).isoformat(sep=' ', timespec='milliseconds'), info.st_atime, info.st_ino)
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

mycursor.execute("SELECT username, scope FROM users")

myresult = mycursor.fetchall()

filename = datetime.now().strftime("%Y-%m-%d.log")

for x in myresult:
    print(x)
    updatelog(x[0], filename, x[1], x[1])