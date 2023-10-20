from flask import Blueprint

bp = Blueprint('main', __name__)

from .xray_detection import upload_image
from .security import security_dashboard,security_chart
from .attend import security_chart1