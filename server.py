from flask import Flask, request, render_template
from GPAChecker import portal
app = Flask(__name__)
portal = portal()


@app.route('/', methods=['GET', 'POST'])
def home():
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    userName = request.form['userName']
    password = request.form['password']
    code = portal.httpLogin(userName, password)
    if code == 1:
        return render_template('success.html')
    if code == -1:
        return render_template('error.html')
    if code == 0:
        return render_template('modify.html')


@app.route('/register', methods=['POST'])
def register():
    pass


if __name__ == '__main__':
    app.run()
