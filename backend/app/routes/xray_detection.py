from . import bp
from flask import Response, send_file
from common import my_logging
from flask import request
from ..metricss import custom_metrics
import os
import shutil
from datetime import datetime
from app.routes.db import conn
from app.routes.mail import sendmail_condition



_logger = my_logging.getLogger("config")

@bp.route('/test', methods=['GET'])
def send_email_():
    late_event = "being late today"  # trigger = 1
    contraband_event = "bring contraband today" # trigger = 2
    trigger_events = []
    trigger_events.append(late_event)
    trigger_events.append(contraband_event)
    empid = "EMP001"
    late_time = "2023-09-11 07:57:00"
    contraband_object_list = [1]
    return sendmail_condition('vincent826826@gmail.com',empid,trigger_events,late_time,contraband_object_list)
    

@bp.route('/model_inference', methods=['POST'])
def model_inference():
    if 'image' in request.files:
        image = request.files['image']
        image.save('static/to_inference.jpg')
        
        # remove previous inference result
        try:
            os.remove('runs/detect/result/labels/to_inference.txt')
        except OSError:
            pass
        # inference 
        os.system("python yolo/detect.py --weights yolo/epoch_099.pt --source static/to_inference.jpg --save-txt --name result")
        
        # if ("abnormal" in image.filename):
        #     custom_metrics.abnormal_counter.inc()

        # result = f'{image.filename} is abnormal. Please check it and notice to relevant personnel.'
        # _logger.info(result)
        pred = [0] * 5
        try:
            with open('runs/detect/result/labels/to_inference.txt') as f:
                _logger.info('inside')
                for l in f:
                    label = int(l.strip().split(' ')[0])
                    pred[label] += 1
        except:
            _logger.info('Error')
        
        shutil.copyfile('runs/detect/result/to_inference.jpg', 'static/result.jpg')
    
        output = {}
        output['image'] = 'static/result.jpg'
        output['pred'] = pred
        output['emp_id'] = image.filename.split('.')[0]
        try:
            predict_image(output['emp_id'], *output['pred'])
        except:
            pass
        #return send_file('../runs/detect/result/inference.jpg', mimetype='image/jpg')
        # return Response(output, 200)
        return output
    return Response('No image provided', 400)

def predict_image(empId, type1, type2, type3, type4, type5):
    
    # sendmail_condition('vincent826826@gmail.com',empId,trigger_events,datatime_str,contraband_object_list)
    
    # empId = 
    now_time = datetime.now()
    datatime_str =  now_time.strftime("%Y-%m-%d %H:%M:%S")
    date = now_time.date()
    time = now_time.time()
    week = now_time.date().isocalendar()[1]
    weekday = now_time.weekday()

    # print(empId)
    # print(datatime_str)
    # print(date)
    # print(time)
    # print(week)
    # print(weekday)

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

        # print(label)
        time_dif = 0
        if label == "late":
            start = empshift
            end  = time
            time_dif = (end.hour - start.hour)*60 + end.minute - start.minute + (end.second - start.second)/60.0
        # print(int(time_dif))

    with conn.cursor() as cur:
        sql = "SELECT MAX(CAST(entryid AS int)) FROM empolyee_entry"
        cur.execute(sql)
        row_data = cur.fetchone()
        entryid = + row_data[0] + 2
    print(entryid)
    

    toolscantime = 0.5

    with conn.cursor() as cur:
        sql = "INSERT INTO public.empolyee_entry(entryid, empid, empshift, depid, zone, datetime, toolscantime, imgid, identity, date, time, week, weekday, timediff, lable, boundingresult, type1, type2, type3, type4, type5) VALUES ('{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', '{}', null, '{}', '{}', '{}', '{}', '{}')"
        sql = sql.format(entryid, empId, empshift, depid, zone, datatime_str, toolscantime, " ", identity, date, time, week, weekday, time_dif, label, type1, type2, type3, type4, type5)
        print(sql)
        cur.execute(sql)

    late_event = "being late today"  # trigger = 1
    contraband_event = "bring contraband today" # trigger = 2
    trigger_events = []

    if time_dif > 0:
        trigger_events.append(late_event)
    if type1 > 0 or type2 > 0 and type3 > 0 and type4 > 0 and type5> 0:
        trigger_events.append(contraband_event)

    contraband_object_list = []
    if type1 > 0:
        contraband_object_list.append(1)
    if type2 > 0:
        contraband_object_list.append(2)
    if type3 > 0:
        contraband_object_list.append(3)
    if type4 > 0:
        contraband_object_list.append(4)
    if type5 > 0:
        contraband_object_list.append(5)
    
    sendmail_condition('vincent826826@gmail.com',empId,trigger_events,datatime_str,contraband_object_list)


    return sql
