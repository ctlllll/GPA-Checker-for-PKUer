from time import sleep
import pickle
from GPAChecker import portal

sess = portal()
output = {}
while True:
    userData = pickle.load(open('userData', 'rb+'))
    mailData = pickle.load(open('mailData', 'rb+'))
    for userName in userData.keys():
        print(userName, userData[userName])
        if userName in output.keys():
            last = output[userName]
            sess.userName = str(userName)
            sess.password = str(userData[userName])
            sess.login()
            new = sess.getOutput()
            if last != new:
                sess.sendMailto(new, mailData[userName])
            sleep(1)
        else:
            sess.userName = str(userName)
            sess.password = userData[userName]
            sess.login()
            output[userName] = sess.getOutput()
            sleep(1)
    sleep(3)
