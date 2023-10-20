# from . import bp
from flask import Response
# from common import my_logging
from flask import request,jsonify
import psycopg2
import pandas as pd
from app.routes.db import conn
from . import bp

# conn = psycopg2.connect(
#     host="127.0.0.1",  # Use the container name #172.20.0.4
#     database="hacker_TG",
#     user="postgres",
#     password="root",
#     port = "5432"
#     )

from flask import Flask

@bp.route("/")
def hello():
    return "Hello, World!"

@bp.route('/test', methods=['POST','GET'])
def test():
    with conn.cursor() as cur:
        sql = "SELECT * FROM empolyee_entry"
        cur.execute(sql)

        name = [desc[0] for desc in cur.description]
        
        ## 取得資料
        rows = pd.DataFrame(cur.fetchall(),columns=name)
        
    return name

@bp.route('/security/dashboard', methods=['POST'])
def security_dashboard():
    if request.method == 'POST': 
        data = request.get_json()
        start_time = data['start_time'] 
        end_time = data['end_time'] 

    with conn.cursor() as cur:
        sql = """
        SELECT SUM(type1) as type1, SUM(type2) as type2, SUM(type3) as type3, SUM(type4) as type4, SUM(type5) as type5
        FROM public.empolyee_entry
        WHERE '{}' <= datetime AND datetime <= '{}' AND zone = 'AZ' 
        """.format(start_time, end_time)
        cur.execute(sql)
        count_az = cur.fetchall()[0]

        sql = """
        SELECT SUM(type1) as type1, SUM(type2) as type2, SUM(type3) as type3, SUM(type4) as type4, SUM(type5) as type5
        FROM public.empolyee_entry
        WHERE '{}' <= datetime AND datetime <= '{}' AND zone = 'HQ' 
        """.format(start_time, end_time)
        cur.execute(sql)
        count_hq = cur.fetchall()[0]

        return_dict = {
            "AZ" : count_az,
            "HQ" : count_hq
        }
    return return_dict

@bp.route('/security/chart', methods=['POST'])
def security_chart():
    if request.method == 'POST': 
        data = request.get_json()
        start_time = data['start_time'] 
        end_time = data['end_time'] 

    with conn.cursor() as cur:
        return_dict = { str(cate): ["0" for weekday in range(1, 8)] for cate in range(1, 6)}
        for weekday in range(1, 8):
            sql = """SELECT SUM(type1) as type1, SUM(type2) as type2, SUM(type3) as type3, SUM(type4) as type4, SUM(type5) as type5
            FROM public.empolyee_entry
            WHERE '{}' <= datetime AND datetime <= '{}' AND weekday = '{}'
            """.format(start_time, end_time, weekday)
            #print(sql)
            cur.execute(sql)
            ## 取得資料
        
            count = cur.fetchall()[0]

            for cat_idx in range(len(count)):
                return_dict[str(cat_idx+1)][weekday-1] = count[cat_idx]
        return return_dict
