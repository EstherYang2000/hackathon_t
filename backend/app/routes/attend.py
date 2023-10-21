from flask import Response
# from common import my_logging
from flask import request,jsonify
import psycopg2
from app.routes.db import conn
from flask import Flask
import json
from . import bp

app = Flask(__name__)
@bp.route('/attend', methods=['POST'])
def security_chart1():
    if request.method == 'POST': 
        data = request.get_json()
        start_time = data['start_time'] 
        end_time = data['end_time']
        depid = data['depId'] 
        zone = data['zone']
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
