import os
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db, bcrypt
from routes.device_routes import device_bp
from routes.review_routes import review_bp
from routes.auth_routes import auth_bp

jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    bcrypt.init_app(app)
    Migrate(app, db)

    cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000")
    origins_list = [o.strip() for o in cors_origins.split(",") if o.strip()]
    CORS(app, origins=origins_list)

    jwt.init_app(app)

    app.register_blueprint(device_bp)
    app.register_blueprint(review_bp)
    app.register_blueprint(auth_bp)

    @app.route("/")
    def home():
        return {"message": "GadgetReview API running"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
