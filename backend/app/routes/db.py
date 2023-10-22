import psycopg2

# postgresql://hacker:root@db:5432/db_name
conn = psycopg2.connect(
    host="127.0.0.1",  # Use the container name #172.20.0.5
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