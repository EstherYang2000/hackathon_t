from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from string import Template
from pathlib import Path
import smtplib
import random

# 上傳照片 ＝> late 、 違禁品 sendmail_condition
#週報 => hr 週報給dept 主管
def sendmail_condition(recipient,empid,trigger_events,late_time,contraband_object_list):
    content = MIMEMultipart()
    subject = "email notification for "
    trigger_events_str = ' and '.join(trigger_events)
    subject += trigger_events_str
    content["subject"] = subject #Mail testing
    content["from"] = "undergraduateIotFarm@gmail.com"
    content["to"] = recipient
    # parameter
    contraband_object_dict = {"1": "Electronic Device", "2": "Laptop", "3": "Scissor", "4": "Knife", "5": "Gun"}
    contraband_objects = [contraband_object_dict.get(str(i), "None") for i in contraband_object_list]
    emailcontent = ""
    mainEvent = ""
    position =""
    length = len(trigger_events)
    contraband_str = ' and '.join(contraband_objects)
    if length == 2:
        template = Template(Path("app/routes/mail_entry.html").read_text())
        emailcontent = f"Here is {empid}'s late time, {late_time}. \n Here is {empid}'s contraband, {contraband_str}."
        position = "HR Resource Manager"
    elif trigger_events[0] == 'being late today':
        template = Template(Path("app/routes/mail_entry.html").read_text())
        emailcontent = f"Here is {empid}'s late time : {late_time}"
        position = "HR Resource Manager"
    elif trigger_events[0] == 'bring contraband today': 
        template = Template(Path("app/routes/mail_entry.html").read_text())
        emailcontent = f"Here is {empid}'s contraband : {contraband_str}"
        position = "Security Operation Manager"
    mainEvent = trigger_events_str
          
    body = template.substitute({"employeeid": empid, "content":emailcontent,"trigger_event": mainEvent,"position":position})
    content.attach(MIMEText(body, "html"))

    with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # 設定SMTP伺服器
        try:
            smtp.ehlo()  # 驗證SMTP伺服器
            smtp.starttls()  # 建立加密傳輸
            smtp.login("undergraduateIotFarm@gmail.com",
                       "nvfxzatrwqixvogm")  # 登入寄件者gmail
            smtp.send_message(content)  # 寄送郵件
            return "success"

        except Exception as e:
            return False

def sendmail_report(recipient,url,week,start_date,end_date):

    content = MIMEMultipart()
    content["subject"] = "Weekly Report"
    content["from"] = "undergraduateIotFarm@gmail.com"
    content["to"] = recipient

    template = Template(Path("common/mail_report.html").read_text())
    url = url
    body = template.substitute({"url": url,"week":week,"start_date":start_date,"end_date":end_date})
    content.attach(MIMEText(body, "html"))

    with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # 設定SMTP伺服器
        try:
            smtp.ehlo()  # 驗證SMTP伺服器
            smtp.starttls()  # 建立加密傳輸
            smtp.login("undergraduateIotFarm@gmail.com",
                       "nvfxzatrwqixvogm")  # 登入寄件者gmail
            smtp.send_message(content)  # 寄送郵件
            return "success"

        except Exception as e:
            return False

if __name__ == '__main__':
    late_event = "being late today"  # trigger = 1
    contraband_event = "bring contraband today" # trigger = 2
    trigger_events = []
    trigger_events.append(late_event)
    trigger_events.append(contraband_event)
    empid = "EMP001"
    late_time = "2023-09-11 07:57:00"
    contraband_object_list = [1]
    sendmail_condition('vincent826826@gmail.com',empid,trigger_events,late_time,contraband_object_list)
    # url = 'https://tedboy.github.io/flask/generated/generated/flask.Response.html'
    # week =  37
    # start_date = '2023-09-11'
    # end_date = '2023-09-17'
    # sendmail_report('ester6126@gmail.com',url,week,start_date,end_date)