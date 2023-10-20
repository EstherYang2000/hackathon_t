from flask import Response
# from common import my_logging
from flask import request,jsonify
import psycopg2
import pandas as pd
from db import conn
from flask import Flask
import json
from . import bp

app = Flask(__name__)
@bp.route('/attend', methods=['POST'])
def security_chart():
    if request.method == 'POST': 
        start_time = request.values['start_time'] 
        end_time = request.values['end_time']
        depid = request.values['depId'] 
        zone = request.values['zone']
        zone = f"('{zone}')" if zone != "ALL" else f"('AZ', 'HQ')"
        

    return_arr = []
    with conn.cursor() as cur:
        sql =  """SELECT *
        FROM public.empolyee_entry
        WHERE '{}' <= datetime AND datetime <= '{}' AND zone in {} AND depid = '{}'
        """.format(start_time, end_time, zone, depid)
        cur.execute(sql)
        data = cur.fetchall()
        name = [desc[0] for desc in cur.description]

        for row in data:
            tmp_dict = {}
            for idx in range(len(row)):
                tmp_dict[name[idx]] = (str(row[idx]))
            return_arr.append(tmp_dict)
        
    # print(json.dumps(return_dict))
    return jsonify({'data':return_arr})
