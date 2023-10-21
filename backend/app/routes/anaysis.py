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
from datetime import datetime



@bp.route('/analysis', methods=['GET'])
def analysis_xray():
        result_dicts = {}
        for ty in ["real", "predict"]:
             for z in ['AZ', 'HQ']:
                  result_dicts[z+'_'+ty] = []

        for z in ['AZ', 'HQ']:
            cursor = conn.cursor()
            with conn.cursor() as cur:
                sql = """SELECT datetime, toolscantime
                FROM public.entry_scan
                WHERE zone = '{}'
                ORDER BY datetime""".format(z)
                cur.execute(sql)
                data = cur.fetchall()
                for row in data:
                    result_dicts[z+"_real"].append({"scanTime": float(row[1]), "dateTime": str(row[0])})

                
                data = pd.read_csv(os.path.join("app/routes/model_output/{}_ScanTime_Pred.csv".format(z)))
                data.columns = ["date", "y_pred"]

                for i in range(len(data)):
                    date_str = data.iloc[i]["date"]
                    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                    formatted_date = date_obj.strftime('%Y-%m-%d %H:%M:%S')
                    result_dicts[z+"_predict"].append({"scanTime": data.iloc[i]["y_pred"], "dateTime": formatted_date})
                
                data = pd.read_csv(os.path.join("app/routes/model_output/{}_ScanTime_Real.csv".format(z)))
                for i in range(len(data)):
                    date_str = data.iloc[i]["Date"]
                    date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                    formatted_date = date_obj.strftime('%Y-%m-%d %H:%M:%S')
                    result_dicts[z+"_real"].append({"scanTime": data.iloc[i]["ToolScanTime"], "dateTime": formatted_date})
                
        return result_dicts