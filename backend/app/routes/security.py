# from . import bp
from flask import Response
# from common import my_logging
from flask import request,jsonify
import psycopg2
# import pandas as pd
from app.routes.db import conn
from . import bp
from flask import Flask
from .llm import LLM
import json


@bp.route('/security/dashboard', methods=['POST'])
def security_dashboard():
    if request.method == 'POST': 
        data = request.get_json()
        start_time = data['start_time'] 
        end_time = data['end_time'] 
    return(search_security_dashboard(start_time, end_time))

def search_security_dashboard(start_time, end_time):

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

        return search_security_chart(start_time, end_time)

def search_security_chart(start_time, end_time):
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
    
@bp.route("/security/weeklyreport", methods=['POST'])
def output_weekly_report():
    if request.method == 'POST': 
        data = request.get_json()
        week_cnt = data['week_cnt'] 
        with open('app/routes/output-security-report.json') as json_file:
            report = json.load(json_file)
            return {'barchart' : report['barchart'][str(week_cnt)], 'linechart':report['linechart'][str(week_cnt)]}
     
@bp.route("/security/chart/llmrealtime", methods=['POST'])
def sec_llmRealtime():
    if request.method == 'POST': 
        data = request.get_json()
        start_time = data['start_time'] 
        end_time = data['end_time'] 
        
        conversation_id = data['conversation_id'] 
        input = data['input'] 
        if conversation_id == "0":
            data1 = search_security_dashboard(start_time, end_time)
            print(data1)
            data2 = search_security_chart(start_time, end_time)
            print(data2)
            prompt = f"""以下資料欄位描述 AZ, HQ是工作廠區的名稱, 他們後面接的5個數字分別代表 1.Electronic Device 2.Laptop 3.scissor 4.knife 5.gun 
            這5類別這週這部門帶進廠區的違禁品總數{data1} 以下資料欄位描述,1 代表 Electronic Device 2 代表 Laptop 3 代表 scissor 4 代表 knife 5 代表 gun 
            後面接的5個數字是這物品這週的週一到週五每天帶進來的違禁品數量 例如 '1': [106, 114, 123, 137, 129, None, None] 
            代表 週一帶了106個Electronic Device 週二有114 週三有123 週四有137 週五有129 {data2}"""
            print(prompt)
            response, conversation_id = LLM(prompt, conversation_id="0")
        else:
            response, conversation_id = LLM(input, conversation_id)
    return {"response":response , "conversation_id":conversation_id}
