from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={r"/*": {"origins": ["http://localhost:3000", "http://127.0.0.1:3000"]}})
    
    
    from routes.jobs import jobs_bp
    app.register_blueprint(jobs_bp)

    from routes.users import users_bp
    app.register_blueprint(users_bp)
    
    @app.route('/')
    def index():
        return {"message": "Welcome to the JobFinder API"}
    
    return app