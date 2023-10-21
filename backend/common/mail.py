from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from string import Template
from pathlib import Path
import smtplib
import random

# 上傳照片 ＝> late 、 違禁品
#週報 => hr 週報給dept 主管
def sendmail(recipient,subject,empid,trigger_events,trigger_events_str,late_time,contraband_object):
    password = random.randint(0, 10000)
    password = '%04d' % password
    content = MIMEMultipart()
    content["subject"] = subject #Mail testing
    content["from"] = "undergraduateIotFarm@gmail.com"
    content["to"] = recipient
    # parameter
    emailcontent = ""
    mainEvent = ""
    position =""
    length = len(trigger_events)
    contraband_str = ' and '.join(contraband_object)
    if length == 2:
        template = Template(Path("common/mail_late.html").read_text())
        emailcontent = f"Here is {empid}'s late time, {late_time}. \n Here is {empid}'s contraband, {contraband_str}."
        position = "HR Manager"
    elif trigger_events[0] == 'being late today':
        template = Template(Path("common/mail_late.html").read_text())
        emailcontent = f"Here is {empid}'s late time: {late_time}"
        position = "HR Manager"
    elif trigger_events[0] == 'bring contraband today': 
        template = Template(Path("common/mail_late.html").read_text())
        emailcontent = f"Here is {empid}'s contraband: {contraband_str}"
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
            return password

        except Exception as e:
            return False

if __name__ == '__main__':
    # sendmail(recipient,subject,empid,trigger_event,late_time,contraband_object)
    late_event = "being late today"  # trigger = 1
    contraband_event = "bring contraband today" # trigger = 2
    trigger_events = []
    trigger_events.append(contraband_event)
    subject = "email notification for "
    trigger_events_str = ' and '.join(trigger_events)
    subject += trigger_events_str
    
    empid = "EMP001"
    late_time = "2023-09-11 07:57:00"
    contraband_object_list = [1, 2]
    contraband_object_dict = {"1": "Electronic Device", "2": "Laptop", "3": "Scissor", "4": "Knife", "5": "Gun"}
    contraband_objects = [contraband_object_dict.get(str(i), "None") for i in contraband_object_list]
    print(empid)
    print(subject)
    print(late_time)
    print(contraband_objects)
    sendmail('ester6126@gmail.com',subject,empid,trigger_events,trigger_events_str,late_time,contraband_objects)