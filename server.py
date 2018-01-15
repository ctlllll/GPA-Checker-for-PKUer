from flask import Flask, request, render_template, make_response
from GPAChecker import portal
import pickle
import os
import re
from time import sleep

app = Flask(__name__)
portal = portal()


def validateEmail(email):

    if len(email) > 7:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            return 1
    return 0


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    userName = request.form['userName']
    password = request.form['password']
    portal.__init__()
    code = portal.httpLogin(userName, password)
    if code == 1:
        resp = make_response(render_template('success.html'))
        resp.set_cookie('userName', userName)
        return resp
    if code == -1:
        return render_template('error.html')
    if code == 0:
        resp = make_response(render_template('modify.html'))
        resp.set_cookie('userName', userName)
        return resp


@app.route('/register', methods=['POST'])
def register():
    try:
        userName = request.cookies.get('userName')
        mailAddress = request.form['mailAddress']
        if validateEmail(mailAddress) == 0:
            data = pickle.load(open('userData', 'rb+'))
            data.pop(userName)
            pickle.dump(data, open('userData', 'wb+'))
            return '<h3>No mail address or address invalid,account deleted!</h3>'
        data = {}
        if os.path.exists('mailData'):
            data = pickle.load(open('mailData', 'rb+'))
        data[userName] = mailAddress
        pickle.dump(data, open('mailData', 'wb+'))
        return '<h3>Mail address registered successfully!</h3>'
    except:
        return '<h3>Error!</h3>'


if __name__ == '__main__':
    app.run()
