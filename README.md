# GPA-Checker-for-PKUer
基于python3的自动查分脚本，自己运行请先安装requests库（pip3 install requests）。然后仅需下载GPAChecker.py，修改该脚本中sendMailto函数中的发送方地址（设置为用于发送提醒的邮箱，并设置密码），修改autoCheck函数中的接收方地址。然后用python3运行GPAChecker.py，输入用户名学号即可自动刷新。

由于数据来源是portal，所以双学位成绩暂时没办法查。又因为portal上的getGPA函数炸了，所以提示的信息可能不太完整，还请见谅。

有问题欢迎发issue～