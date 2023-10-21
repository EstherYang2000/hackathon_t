from flask import Response
# from common import my_logging
from flask import request,jsonify
import psycopg2
import pandas as pd
import json
import os
from datetime import datetime
from . import bp
from app.routes.db import conn


@bp.route("/upload_img", methods=['POST'])
def predict_image():
    return_dict = {}
    if request.method == 'POST': 
        image = request.files.get('image', '')
        empId = image.filename.split('.')[0]
        now_time = datetime.now()
        datatime_str =  now_time.strftime("%Y-%m-%d %H:%M:%S")
        date = now_time.date()
        time = now_time.time()
        week = now_time.date().isocalendar()[1]
        weekday = now_time.weekday()

        print(image)
        print(image.filename)
        print(empId)
        print(datatime_str)
        print(date)
        print(time)
        print(week)
        print(weekday)

        with conn.cursor() as cur:
            sql = """
            SELECT *
            FROM empolyee_entry
            WHERE empId = '{}' 
            """.format(empId)
            cur.execute(sql)
            row_data = cur.fetchone()
            empshift = row_data[2]
            depid = row_data[3]
            zone = row_data[4]
            identity = row_data[9]

            label = "normal" if time < empshift else "late"

            print(label)
            time_dif = 0
            if label == "late":
                start = empshift
                end  = time
                time_dif = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0
            print(int(time_dif))

        with conn.cursor() as cur:
            sql = "SELECT MAX(CAST(entryid AS int)) FROM empolyee_entry"
            cur.execute(sql)
            row_data = cur.fetchone()
            entryid = + row_data[0] + 1
        print(entryid)
        

        toolscantime = 0.5
        # bounding
        # boundingresult = None
        result = [0 for i in range(5)]
        type1 = result[0]
        type2 = result[1]
        type3 = result[2]
        type4 = result[3]
        type5 = result[4]

        with conn.cursor() as cur:
            sql = "INSERT INTO public.empolyee_entry(entryid, empid, empshift, depid, zone, datetime, toolscantime, imgid, identity, date, time, week, weekday, timediff, lable, boundingresult, type1, type2, type3, type4, type5) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', null, '{}', '{}', '{}', '{}', '{}')"
            sql = sql.format(entryid, empId, empshift, depid, zone, datatime_str, toolscantime, " ", identity, date, time, week, weekday, time_dif, label, type1, type2, type3, type4, type5)
            print(sql)
            cur.execute(sql)
        return sql
