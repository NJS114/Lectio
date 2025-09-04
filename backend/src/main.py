import os
import sys
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Charger les variables d'environnement
from dotenv import load_dotenv
load_dotenv()

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.user import db, User
from src.models.book import Book, Ebook
from src.models.event import Event, EventRegistration
from src.models.analytics import Sale, DailyAnalytics, Promotion
from src.models.communication import Newsletter, NewsletterSubscriber, SupportTicket, SupportMessage, EmailTemplate, EmailLog, NotificationPreference

# Import des blueprints
from src.routes.user import user_bp
from src.routes.analytics import analytics_bp
from src.routes.marketing import marketing_bp
from src.routes.events import events_bp
from src.routes.books import books_bp
from src.routes.ecosystem import ecosystem_bp
from src.routes.google_auth import google_auth_bp
from src.routes.shipping import shipping_bp
from src.routes.email_invoice import email_invoice_bp
from src.routes.communication import communication_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# Configuration CORS pour permettre les requêtes cross-origin
CORS(app, origins="*")

# Enregistrement des blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(analytics_bp, url_prefix='/api')
app.register_blueprint(marketing_bp, url_prefix='/api')
app.register_blueprint(events_bp, url_prefix='/api')
app.register_blueprint(books_bp, url_prefix='/api')
app.register_blueprint(ecosystem_bp, url_prefix='/api')
app.register_blueprint(google_auth_bp, url_prefix='/api/auth/google')
app.register_blueprint(shipping_bp, url_prefix='/api/shipping')
app.register_blueprint(email_invoice_bp)
app.register_blueprint(communication_bp)

# Configuration de la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Création des tables et données de démonstration
with app.app_context():
    db.create_all()
    
    # Vérifier si des données existent déjà
    if User.query.count() == 0:
        from src.utils.seed_data import create_demo_data
        create_demo_data()

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
