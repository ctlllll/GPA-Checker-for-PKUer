import re
import os
import requests
import time
import smtplib
import json
import pickle
from getpass import getpass
from email.mime.text import MIMEText


class portal:
    oauthLogin = 'https://iaaa.pku.edu.cn/iaaa/oauthlogin.do'
    ssoLogin = 'http://portal.pku.edu.cn/portal2017/ssoLogin.do'
    retrScores = 'https://portal.pku.edu.cn/portal2017/bizcenter/score/retrScores.do'
    userName = ''
    password = ''
    getGPAbyXh = 'https://portal.pku.edu.cn/portal2017/bizcenter/score/getGPAbyXh.do'

    def __init__(self):
        self.sess = requests.Session()
        self.sess.headers.update({'User-Agent': 'Chrome'})

    def getNext(self, url, params=[], referer='', verify=False):
        if referer != '':
            self.sess.headers.update({'Referer': referer})
        while True:
            try:
                r = self.sess.get(url, params=params,
                                  timeout=10, verify=verify)
                break
            except:
                print("Get process error")
                time.sleep(10)
        return r.text

    def postNext(self, url, data=[], referer='', verify=False):
        if referer != '':
            self.sess.headers.update({'Referer': referer})
        while True:
            try:
                r = self.sess.post(url, data, timeout=10, verify=verify)
                break
            except:
                print("Post process error")
                time.sleep(10)
        return r.text

    def httpLogin(self, userName, password):
        data = {'appid': 'portal2017', 'userName': '%s' % userName, 'password': '%s' % password, 'randCode': '验证码',
                'smsCode': '短信验证码', 'redirUrl': 'http://portal.pku.edu.cn/portal2017/login.jsp/../ssoLogin.do'}
        tot = 0
        while True:
            cont = self.postNext(self.oauthLogin, data)
            if cont.find('token') != -1:
                break
            tot += 1
            time.sleep(0.5)
            if tot > 3:
                return -1
        data = {}
        if os.path.exists('userData'):
            data = pickle.load(open('userData', 'rb+'))
            if data.get(userName) != None:
                return 0
        data[userName] = password
        pickle.dump(data, open('userData', 'wb+'))
        self.userName = userName
        self.password = password
        return 1

    def login(self):
        if self.userName == '':
            self.userName = input("Please input your student ID:")
        if self.password == '':
            self.password = getpass("Please input your password:")
        self.data = {'appid': 'portal2017', 'userName': '%s' % self.userName, 'password': '%s' % self.password, 'randCode': '验证码',
                     'smsCode': '短信验证码', 'redirUrl': 'http://portal.pku.edu.cn/portal2017/login.jsp/../ssoLogin.do'}
        tot = 0
        while True:
            cont = self.postNext(self.oauthLogin, self.data)
            if cont.find('token') != -1:
                break
            tot += 1
            time.sleep(1)
            if tot > 10:
                self.userName = input("Please input your student ID:")
                self.password = getpass("Please input your password:")
                self.data = {'appid': 'portal2017', 'userName': '%s' % self.userName, 'password': '%s' % self.password, 'randCode': '验证码',
                             'smsCode': '短信验证码', 'redirUrl': 'http://portal.pku.edu.cn/portal2017/login.jsp/../ssoLogin.do'}
        print(cont)
        p = {}
        p['token'] = re.search(r'n":"(.*?)"', cont).group(1)
        p['rand'] = 0.7555405047770082
        cont = self.getNext(self.ssoLogin, p)
        # print(cont)

    def getGrade(self):
        tot = 0
        GPA = self.getGPA()
        while True:
            cont = self.postNext(self.retrScores)
            if cont.find('cjxx') != -1:
                break
            tot += 1
            time.sleep(1)
            if tot > 10:
                self.login()
        s = json.loads(cont)['cjxx']
        output = ''
        for semester in range(len(s)):
            output += 'Semester:' + \
                GPA[semester]['xndxq'] + ' GPA:' + \
                GPA[semester]['gpa'] + '\n\n'
            classList = s[semester]['list']
            for classItem in classList:
                output += classItem['kcmc'] + ' Grade:' + \
                    classItem['xqcj'] + ' GPA:' + classItem['jd'] + '\n'
            output += '\n\n'
        self.grade = output
        print(output)

    def getOutput(self):
        cont = self.postNext(self.retrScores)
        if cont.find('cjxx') == -1:
            return 'There is some mistake with your account'
        s = json.loads(cont)['cjxx']
        output = ''
        for semester in range(len(s)):
            classList = s[semester]['list']
            for classItem in classList:
                output += classItem['kcmc'] + ' Grade:' + \
                    classItem['xqcj'] + ' GPA:' + classItem['jd'] + '\n'
            output += '\n'
        print(output)
        return output

    def getGPA(self):
        tot = 0
        while True:
            cont = self.postNext(self.getGPAbyXh)
            if cont.find('scFormats') != -1:
                break
            tot += 1
            time.sleep(1)
            if tot > 10:
                self.login()
        s = json.loads(cont)['data']
        print(s)
        return s

    def sendMail(self):
        mailserver = smtplib.SMTP(
            'your_smtp_server_address_like_smtp.163.com', 25)
        mailserver.login('your_server_e-mail_address', 'your_password')
        message = self.grade
        msg = MIMEText(message, 'plain', 'utf-8')
        msg['Subject'] = 'GPAChecker Notification'
        msg['from'] = 'your_server_e-mail_address'
        msg['to'] = 'your_client_e-mail_address'
        mailserver.sendmail('your_server_e-mail_address', [
                            'your_client_e-mail_address'], msg.as_string())
        mailserver.quit()

    def autoCheck(self):
        #self.GPA = self.getGPA()
        #while True:
        #    GPA = self.GPA
        #    self.GPA = self.getGPA()
        #    if GPA != self.GPA:
        #        self.getGrade()
        #        self.sendMail()
        #    time.sleep(10)
        self.output=self.getOutput()
        while True:
            output=self.output
            self.output=self.getOutput()
            if output!=self.output:
                self.sendMailto(output,'your_client_e-mail_address')
            time.sleep(10)

    def sendMailto(self, output, dest):
        mailserver = smtplib.SMTP(
            'your_smtp_server_address_like_smtp.163.com', 25)
        mailserver.login('your_server_e-mail_address', 'your_password')
        message = output
        msg = MIMEText(message, 'plain', 'utf-8')
        msg['Subject'] = 'GPAChecker Notification'
        msg['from'] = 'your_server_e-mail_address'
        msg['to'] = dest
        mailserver.sendmail('your_server_e-mail_address', [
                            dest], msg.as_string())
        mailserver.quit()


if __name__ == '__main__':
    portal = portal()
    portal.login()
    portal.autoCheck()
