from . import bp
from flask import Response
from hackathon_t.backend.common import my_logging
from flask import request
from ..metricss import custom_metrics
from common.utils import connectPostgres

_logger = my_logging.getLogger("config")



@bp.route('/upload', methods=['POST','GET'])
def upload_image():
    if 'image' in request.files:
        image = request.files['image']
        #TO-DO save image to database
        cur = connectPostgres()
        # Process the uploaded image here, for example, save it to a folder
        # image.save('path/to/save/image.jpg')
        if ("abnormal" in image.filename):
            custom_metrics.abnormal_counter.inc()

        result = f'{image.filename} is abnormal. Please check it and notice to relevant personnel.'
        _logger.info(result)

        return Response(result, 200)
    return Response('No image provided', 400)

