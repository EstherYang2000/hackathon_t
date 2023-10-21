from flask import Flask, request
from flask_cors import CORS

# from app.extensions import db
# from flask_migrate import Migrate

# monitor
from prometheus_flask_exporter import PrometheusMetrics

# read env
from dotenv import load_dotenv
load_dotenv()

from common import logging
logger = logging.getLogger("init")

metrics = PrometheusMetrics.for_app_factory()

def create_app(config_class=None):

    # if we want use react build result
    # add static_folder='../frontend/build', static_url_path='' to Flask
    app = Flask(__name__, static_folder='../static', static_url_path='/static')


    # if we want to seperate frontend & backend
    CORS(app, resources={r"/*":{"origins":"*"}})

    # # Initialize Flask extensions here (ex. DB)
    # if not config_class:
    #     db_config = os.getenv("APP_SETTINGS")
    # app.config.from_object(db_config)
    # db.init_app(app)
    # Migrate(app=app, db=db, compare_type=True)


    # Register blueprints here
    from .routes import bp as main_bp
    app.register_blueprint(main_bp)

    metrics.init_app(app)
    with app.app_context():

        metrics.register_default(
            metrics.counter(
                'by_path_counter', 'Request count by request paths',
                labels={'path': lambda: request.path}
            )
        )

    # @app.route('/')
    # def index():
    #     return app.send_static_file('index.html')

    '''
    Handle React with Flask route issue
    '''
    # @app.errorhandler(404)
    # def not_found(e):
    #     return app.send_static_file('index.html')


    return app