from flask import Flask
from app import create_app
from waitress import serve


app = create_app()
app = Flask(__name__)


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)

    # app.run('127.0.0.1', port=5000, debug=True)
    app.debug = True

    # serve(app=app, host='172.0.0.1', port=5000)