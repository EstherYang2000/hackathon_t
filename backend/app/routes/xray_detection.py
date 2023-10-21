from . import bp
from flask import Response, send_file
from common import logging
from flask import request
from ..metricss import custom_metrics
import os
import shutil


_logger = logging.getLogger("config")


@bp.route('/upload', methods=['POST'])
def upload_image():
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
        
        shutil.copyfile('runs/detect/result/inference.jpg', 'static/result.jpg')
    
        output = {}
        output['image'] = 'static/result.jpg'
        output['pred'] = pred
        output['emp_id'] = image.filename.split('.')[0]
        #return send_file('../runs/detect/result/inference.jpg', mimetype='image/jpg')
        # return Response(output, 200)
        return output
    return Response('No image provided', 400)
