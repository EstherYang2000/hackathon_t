from flask import Response
# from common import my_logging
from flask import request,jsonify
import psycopg2
import pandas as pd
from app.routes.db import conn
from flask import Flask
import json
from . import bp
import os

@bp.route('/analysis', methods=['GET'])
def analysis_xray():
        result_dicts = {z:{"real":[], "predict":[]} for z in ['AZ', 'HQ']}
        for z in ['AZ', 'HQ']:
            cursor = conn.cursor()
            with conn.cursor() as cur:
                sql = """SELECT datetime, toolscantime
                FROM public.empolyee_entry
                WHERE zone = '{}'
                ORDER BY datetime""".format(z)
                cur.execute(sql)
                data = cur.fetchall()
                for row in data:
                    result_dicts[z]["real"].append({"scanTime": row[0], "dateTime": str(row[1])})

                data = pd.read_csv(os.path.join("app/routes/model_output/{}_ScanTime_Pred.csv".format(z)))
                data.columns = ["date", "y_pred"]
                for i in range(len(data)):
                    result_dicts[z]["predict"].append({"scanTime": data.iloc[0]["y_pred"], "dateTime": data.iloc[0]["date"]})
                # print(data.iloc[0]["date"])
                
        return result_dicts

