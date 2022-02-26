# pip install mysql-connector-python

import os
from datetime import datetime
import threading
import mysql.connector

def updatelog(filename, path):
    with open(filename, "a", encoding="utf-8", errors="backslashreplace") as file_object:
        for path, subdirs, files in os.walk(path):
            for name in files:
                full_path = os.path.join(path, name)
                info = os.stat(full_path)
                info_tuple = (os.getlogin(), datetime.date(datetime.now()), full_path, info.st_size, info.st_mtime, info.st_atime, info.st_ino)
                # print(",".join(map(str,info_tuple)))
                file_object.write("\t".join(map(str,info_tuple)))
                file_object.write("\n")

def print_user(user):
    print(user)

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="secret",
    port="3308",
    database="syncbox"
)

mycursor = mydb.cursor()

mycursor.execute("SELECT username, scope FROM users")

myresult = mycursor.fetchall()

thread_pool = []

for x in myresult:
    thread_pool.append(threading.Thread(target=print_user, args=(x,)))

try:
    for t in thread_pool:
        t.start()
except:
    print("Error: unable to start thread")


# updatelog("sampledata.txt", "/home/udara/Documents/FYP/")