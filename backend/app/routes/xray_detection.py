from . import bp
from flask import Response
from common import my_logging
from flask import request,jsonify
from ..metricss import custom_metrics
import psycopg2

_logger = my_logging.getLogger("config")

conn = psycopg2.connect(
    host="127.0.0.1",  # Use the container name #172.20.0.4
    database="hacker_TG",
    user="hacker",
    password="root",
    port = "5432"
    )
    # select1 = "SELECT * FROM public.empolyee_entry LIMIT 1;"
cursor = conn.cursor()

@bp.route('/upload', methods=['POST','GET'])
def upload_image():
    if 'image' in request.files:
        image = request.files['image']
        #TO-DO save image to database
        # Process the uploaded image here, for example, save it to a folder
        # image.save('path/to/save/image.jpg')
        if ("abnormal" in image.filename):
            custom_metrics.abnormal_counter.inc()

        result = f'{image.filename} is abnormal. Please check it and notice to relevant personnel.'
        _logger.info(result)

        return Response(result, 200)
    return Response('No image provided', 400)

@bp.route('/hr/dashboard', methods=['POST','GET']) 
def dailyAttendenceMetrics():

    if request.method == 'GET':
        zone = request.form.get('dept')  #ALL、AZ 、HQ
        print(zone)
        start_date = request.form.get('start_date')
        print(start_date)
        end_date = request.form.get('end_date')
        print(end_date)
        sql = ""
        if zone != "ALL": 
            # SQL query with placeholders
            sql = """
            SELECT
                empolyee_entry.zone,
                empolyee_entry.date,
                COUNT(empolyee_entry.entryid) as entry_count,
                COUNT(CASE WHEN empolyee_entry.lable = 'late' THEN 1 ELSE NULL END) AS late_count,
                COUNT(CASE WHEN empolyee_entry.lable = 'normal' THEN 1 ELSE NULL END) AS normal_count
            FROM
                public.empolyee_entry
            WHERE
                (empolyee_entry.zone = %s)
                AND (empolyee_entry.date BETWEEN %s AND %s)
            GROUP BY
                empolyee_entry.zone, empolyee_entry.date;
            """

            # Execute the query with parameters
            cursor.execute(sql, (zone, start_date, end_date))

        else:
            sql = """
            SELECT
                empolyee_entry.date,
                COUNT(empolyee_entry.entryid) as entry_count,
                COUNT(CASE WHEN empolyee_entry.lable = 'late' THEN 1 ELSE NULL END) AS late_count,
                COUNT(CASE WHEN empolyee_entry.lable = 'normal' THEN 1 ELSE NULL END) AS normal_count
            FROM
                public.empolyee_entry
            WHERE
                empolyee_entry.date BETWEEN %s AND %s
            GROUP BY
                empolyee_entry.date;
            """
            # Execute the query with parameters
            cursor.execute(sql, (start_date, end_date))
        # Fetch the results
        results = cursor.fetchall()
        print(results)


         # Convert results to a list of dictionaries
        if zone != "ALL":
            result_dicts = [
                {
                    'zone': row[0],
                    'date': row[1],
                    'entry_count': row[2],
                    'late_count': row[3],
                    'normal_count': row[4]
                }
                for row in results
            ]
        else:
            result_dicts = [
                {
                    'date': row[0],
                    'entry_count': row[1],
                    'late_count': row[2],
                    'normal_count': row[3]
                }
                for row in results
            ]
        # Return results in JSON format
        return jsonify(result_dicts)
    
    

            
            
        
        
    
    
    
    
    
    

