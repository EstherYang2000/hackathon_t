from flask import Flask
from app import create_app
from waitress import serve

app = create_app()

if __name__ == '__main__':
    app.run('localhost', port=5000, debug=True)
    # serve(app=app, host='172.0.0.1', port=5000)