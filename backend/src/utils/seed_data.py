from datetime import datetime, date, timedelta
from src.models.user import db, User
from src.models.book import Book, Ebook
from src.models.event import Event, EventRegistration
from src.models.analytics import Sale, DailyAnalytics, Promotion
import random

def create_demo_data():
    """Crée des données de démonstration pour l'application"""
    
    # Utilisateurs de démonstration
    users = [
        {
            'username': 'marie_l',
            'email': 'marie@example.com',
            'name': 'Marie Leclerc',
            'user_type': 'individual'
        },
        {
            'username': 'mollat_bordeaux',
            'email': 'contact@mollat.com',
            'name': 'Librairie Mollat',
            'user_type': 'bookstore',
            'bookstore_name': 'Librairie Mollat',
            'bookstore_address': '15 Rue Vital Carles, 33000 Bordeaux',
            'bookstore_phone': '05 56 56 40 40',
            'bookstore_description': 'Librairie indépendante depuis 1896, spécialisée dans tous les domaines de la connaissance.'
        },
        {
            'username': 'admin',
            'email': 'admin@lectio.fr',
            'name': 'Administrateur Lectio',
            'user_type': 'admin'
        }
    ]
    
    created_users = []
    for user_data in users:
        user = User(**user_data)
        db.session.add(user)
        created_users.append(user)
    
    db.session.commit()
    
    # Livres de démonstration
    books_data = [
        {
            'title': 'L\'Étranger',
            'author': 'Albert Camus',
            'isbn': '9782070360024',
            'description': 'Roman emblématique de la littérature française du XXe siècle.',
            'category': 'Roman',
            'condition': 'Très Bon',
            'sale_price': 8.50,
            'rental_price_2weeks': 3.00,
            'is_for_sale': True,
            'is_for_rent': True,
            'stock_quantity': 3,
            'seller_id': 2  # Mollat
        },
        {
            'title': '1984',
            'author': 'George Orwell',
            'isbn': '9782070368228',
            'description': 'Dystopie prophétique sur la surveillance et le totalitarisme.',
            'category': 'Science-Fiction',
            'condition': 'Neuf',
            'sale_price': 9.20,
            'rental_price_2weeks': 3.50,
            'is_for_sale': True,
            'is_for_rent': True,
            'stock_quantity': 5,
            'seller_id': 2
        },
        {
            'title': 'Le Petit Prince',
            'author': 'Antoine de Saint-Exupéry',
            'isbn': '9782070408504',
            'description': 'Conte poétique et philosophique intemporel.',
            'category': 'Jeunesse',
            'condition': 'Bon',
            'sale_price': 6.90,
            'rental_price_2weeks': 2.50,
            'is_for_sale': True,
            'is_for_rent': True,
            'stock_quantity': 2,
            'seller_id': 2
        },
        {
            'title': 'Sapiens',
            'author': 'Yuval Noah Harari',
            'isbn': '9782226257017',
            'description': 'Une brève histoire de l\'humanité qui révolutionne notre compréhension du monde.',
            'category': 'Essai',
            'condition': 'Neuf',
            'sale_price': 22.00,
            'rental_price_2weeks': 8.00,
            'is_for_sale': True,
            'is_for_rent': True,
            'stock_quantity': 4,
            'seller_id': 2
        }
    ]
    
    created_books = []
    for book_data in books_data:
        book = Book(**book_data)
        db.session.add(book)
        created_books.append(book)
    
    # Ebooks de démonstration
    ebooks_data = [
        {
            'title': 'Python pour les Débutants - Guide Complet 2024',
            'author': 'Jean-Pierre Dubois',
            'description': 'Apprenez Python de zéro avec ce guide complet et pratique.',
            'category': 'Informatique',
            'pages': 200,
            'file_size_mb': 15.2,
            'formats': 'PDF,EPUB',
            'language': 'fr',
            'price': 18.99,
            'is_free_preview': True,
            'status': 'approved',
            'creator_id': 2,
            'download_count': 245
        },
        {
            'title': 'Maîtriser React et Next.js',
            'author': 'Sophie Moreau',
            'description': 'Guide avancé pour développer des applications web modernes.',
            'category': 'Informatique',
            'pages': 350,
            'file_size_mb': 28.7,
            'formats': 'PDF,EPUB,MOBI',
            'language': 'fr',
            'price': 22.99,
            'is_free_preview': False,
            'status': 'approved',
            'creator_id': 2,
            'download_count': 189
        },
        {
            'title': 'Marketing Digital Avancé',
            'author': 'Marc Durand',
            'description': 'Stratégies et techniques pour réussir en marketing digital.',
            'category': 'Business',
            'pages': 180,
            'file_size_mb': 12.4,
            'formats': 'PDF,EPUB',
            'language': 'fr',
            'price': 15.99,
            'is_free_preview': True,
            'status': 'approved',
            'creator_id': 2,
            'download_count': 156
        },
        {
            'title': 'Intelligence Artificielle - Comprendre et Appliquer',
            'author': 'Dr. Claire Martin',
            'description': 'Introduction complète à l\'IA pour les professionnels.',
            'category': 'Informatique',
            'pages': 420,
            'file_size_mb': 35.8,
            'formats': 'PDF,EPUB',
            'language': 'fr',
            'price': 29.99,
            'is_free_preview': False,
            'status': 'approved',
            'creator_id': 2,
            'download_count': 312
        }
    ]
    
    for ebook_data in ebooks_data:
        ebook = Ebook(**ebook_data)
        db.session.add(ebook)
    
    # Événements de démonstration
    events_data = [
        {
            'title': 'Dédicace - Nouveautés de la rentrée',
            'description': 'Venez rencontrer les auteurs des nouveautés littéraires de cette rentrée.',
            'category': 'Dédicace',
            'date': date(2024, 2, 28),
            'time': '16:00',
            'location': 'Librairie Mollat, Bordeaux',
            'max_participants': 100,
            'current_participants': 87,
            'price': 0.0,
            'status': 'completed',
            'organizer_id': 2,
            'library_name': 'Librairie Mollat',
            'tags': 'Dédicace,Nouveautés,Gratuit'
        },
        {
            'title': 'Rencontre avec Albert Camus',
            'description': 'Découvrez l\'univers de l\'auteur de L\'Étranger lors d\'une soirée littéraire exceptionnelle.',
            'category': 'Rencontre d\'auteur',
            'date': date(2024, 3, 15),
            'time': '19:00',
            'location': 'Librairie Mollat, Bordeaux',
            'max_participants': 50,
            'current_participants': 23,
            'price': 0.0,
            'status': 'completed',
            'organizer_id': 2,
            'library_name': 'Librairie Mollat',
            'tags': 'Littérature,Philosophie,Gratuit'
        },
        {
            'title': 'Club de lecture - Science-Fiction',
            'description': 'Discussion autour des dernières parutions SF et échange entre passionnés du genre.',
            'category': 'Club de lecture',
            'date': date(2024, 3, 20),
            'time': '18:30',
            'location': 'Librairie Mollat, Bordeaux',
            'max_participants': 20,
            'current_participants': 12,
            'price': 5.0,
            'status': 'completed',
            'organizer_id': 2,
            'library_name': 'Librairie Mollat',
            'tags': 'Science-Fiction,Discussion,Communauté'
        },
        {
            'title': 'Atelier d\'écriture créative',
            'description': 'Libérez votre créativité lors de cet atelier d\'écriture animé par un auteur professionnel.',
            'category': 'Atelier',
            'date': date(2024, 3, 25),
            'time': '14:00',
            'location': 'Librairie Mollat, Bordeaux',
            'max_participants': 15,
            'current_participants': 8,
            'price': 25.0,
            'status': 'completed',
            'organizer_id': 2,
            'library_name': 'Librairie Mollat',
            'tags': 'Écriture,Créativité,Formation'
        }
    ]
    
    for event_data in events_data:
        event = Event(**event_data)
        db.session.add(event)
    
    # Ventes de démonstration
    sales_data = []
    for i in range(30):  # 30 ventes sur les derniers jours
        sale_date = date.today() - timedelta(days=random.randint(0, 30))
        book = random.choice(created_books)
        
        # Calcul avec commission 20%
        item_price = book.sale_price
        platform_commission = item_price * 0.20
        seller_revenue = item_price * 0.80
        
        sale = Sale(
            book_id=book.id,
            buyer_id=1,  # Marie
            seller_id=book.seller_id,
            item_price=item_price,
            platform_commission=platform_commission,
            seller_revenue=seller_revenue,
            transaction_type=random.choice(['sale', 'rental']),
            rental_duration_days=14 if random.choice([True, False]) else None,
            status='completed',
            sale_date=sale_date
        )
        sales_data.append(sale)
        db.session.add(sale)
    
    # Promotions de démonstration
    promotions_data = [
        {
            'title': 'Rentrée Littéraire -15%',
            'description': 'Profitez de 15% de réduction sur tous les romans de la rentrée.',
            'promotion_type': 'percentage',
            'discount_value': 15.0,
            'promo_code': 'RENTREE15',
            'start_date': date.today() - timedelta(days=10),
            'end_date': date.today() + timedelta(days=20),
            'max_uses': 100,
            'current_uses': 23,
            'min_order_amount': 20.0,
            'is_active': True,
            'creator_id': 2
        },
        {
            'title': 'Frais de port offerts',
            'description': 'Livraison gratuite pour toute commande supérieure à 30€.',
            'promotion_type': 'free_shipping',
            'discount_value': 3.50,
            'promo_code': 'GRATUIT30',
            'start_date': date.today() - timedelta(days=5),
            'end_date': date.today() + timedelta(days=15),
            'max_uses': 200,
            'current_uses': 67,
            'min_order_amount': 30.0,
            'is_active': True,
            'creator_id': 2
        }
    ]
    
    for promo_data in promotions_data:
        promotion = Promotion(**promo_data)
        db.session.add(promotion)
    
    # Commit toutes les données
    db.session.commit()
    
    print("✅ Données de démonstration créées avec succès !")
    print(f"- {len(users)} utilisateurs")
    print(f"- {len(books_data)} livres")
    print(f"- {len(ebooks_data)} ebooks")
    print(f"- {len(events_data)} événements")
    print(f"- {len(sales_data)} ventes")
    print(f"- {len(promotions_data)} promotions")

