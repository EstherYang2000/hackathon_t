import psycopg2
import os

conn = psycopg2.connect(
    host= os.getenv("DB_HOST"),  # Use the container name #172.20.0.5
    database="hacker_TG",
    user="hacker",
    password="root",
    port = "5432"
    )

# select1 = "SELECT * FROM public.empolyee_entry LIMIT 1;"
# cur = conn.cursor()
# cur.execute(select1)
# # lstResults = cur.fetchall()
# # print(lstResults)
# cur.close