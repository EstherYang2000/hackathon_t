import psycopg2
from simplegmail import Gmail
import os
import openai
import os
import base64
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import base64
from email.message import EmailMessage
import google.auth
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# def connectPostgres():
#     conn = psycopg2.connect(
#     host="127.0.0.1",  # Use the container name #172.20.0.4
#     database="hacker_TG",
#     user="hacker",
#     password="root",
#     port = "5432"
#     )
#     # select1 = "SELECT * FROM public.empolyee_entry LIMIT 1;"
#     cur = conn.cursor()
#     return cur


# gmail = Gmail()

# def create_email(system_prompt:str):
#     # openai.api_key = os.getenv("OPENAI_API_KEY")
#     # user_prompt = input("Describe the email you want. \n")
#     # messages = [
#     #         {"role": "system", "content": system_prompt},
#     #         {"role": "user", "content": user_prompt}
#     # ]
#     user_prompt = "test"
#     def write_email(prompt):
#         # messages.append({"role": "user", "content": prompt})
#         # completion = openai.ChatCompletion.create(
#         #     model="gpt-3.5-turbo",
#         #     messages=messages
#         # )
#         # reply = completion.choices[0].message["content"]
#         # print(reply)
#         # messages.append({"role": "assistant", "content": reply})
#         return "Please type done if satisfied, if not, continue prompting"
        
#     # while user_prompt != "done":
#     #     user_prompt = write_email(user_prompt)
#     final_draft = user_prompt
#     # final_draft = messages[-1]["content"]
#     return final_draft 

#  # will open a browser window to ask you to log in and authenticate


# def send_email(recipient, subject, message):
#     gmail = Gmail()
    
#     message = message.replace("\n", "<br>")
#     params = {
#         "to": recipient,
#         "sender": "estheryangyujie.mg12@nycu.edu.tw",
#         "subject": subject,
#         "msg_html": message,
#         "signature": True  # use my account signature
#     }
#     message = gmail.send_message(**params)  # equivalent to send_message(to="you@youremail.com", sender=...)
    
#     print("Message sent successfully")
    
    
# def emailToManager(recipient):
#     system_prompt = """
#     Please write an email in the style of the user given a prompt and the sample emails below. Don't be too formal, keep the email brief, and don't add additional information, just express what the user says in the prompt. 
#     Sign the email as Ian Samir. 

#     SAMPLES:
#     Hi Mrs. Satchwell,

#     Sorry for the late response; I forgot to send an email earlier. My presentation is about Social Media Safety and I should have two panel members for the presentation. 

#     Thanks,

#     Ian Samir

#     """
#     final_email = create_email("")
#     subject = "null"
#     recipient = recipient # manager email

#     send_email(recipient = recipient, subject = subject, message = final_email)


# emailToManager("ester6126@gmail.com")



# # Define the scopes and client ID details
# SCOPES = ['https://www.googleapis.com/auth/gmail.send']

# # Create credentials and set up the Gmail API service
# flow = InstalledAppFlow.from_client_secrets_file('common/client_secret.json', SCOPES)
# creds = flow.run_local_server(port=0)
# # flow = InstalledAppFlow.from_client_secrets_file(
# #     CLIENT_ID, CLIENT_SECRET, SCOPES)
# # creds = flow.run_local_server(port=0)
# service = build('gmail', 'v1', credentials=creds)
# YOUR_EMAIL_ADDRESS = 'estheryangyujie.mg12@nycu.edu.tw'
# recipient = 'ester6126@gmail.com'
# # Compose the email
# # Compose the email
# email_message = """
# Subject: Your Subject
# To: ester6126@gmail.com
# From: estheryangyujie.mg12@nycu.edu.tw
# MIME-Version: 1.0
# Content-type: text/html
# Content-Transfer-Encoding: 8bit

# <html>Test</html>
# """

# # Encode the email message in base64
# message_bytes = email_message.encode('utf-8')
# message_base64 = base64.urlsafe_b64encode(message_bytes).decode('utf-8')

# # Send the email
# message = service.users().messages().send(userId='me', body={'raw': message_base64}).execute()
# print(f"Message Id: {message['id']}")
