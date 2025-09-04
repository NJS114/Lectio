"""
Routes pour la gestion des emails et factures
"""
from flask import Blueprint, request, jsonify, send_file
from datetime import datetime
import os
import logging

from ..services.email_service import email_service
from ..services.invoice_service import invoice_service

logger = logging.getLogger(__name__)

email_invoice_bp = Blueprint('email_invoice', __name__)

@email_invoice_bp.route('/api/email/test', methods=['GET'])
def test_email_config():
    """
    Test de la configuration email
    """
    try:
        # Vérifier la configuration
        config_status = {
            'smtp_server': email_service.smtp_server,
            'smtp_port': email_service.smtp_port,
            'username': email_service.username,
            'default_sender': email_service.default_sender,
            'password_configured': bool(email_service.password)
        }
        
        return jsonify({
            'success': True,
            'message': 'Configuration email récupérée',
            'config': config_status
        })
        
    except Exception as e:
        logger.error(f"Erreur lors du test de configuration email : {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@email_invoice_bp.route('/api/email/send-test', methods=['POST'])
def send_test_email():
    """
    Envoie un email de test
    """
    try:
        data = request.get_json()
        to_email = data.get('to_email', 'aouniibrahim94@gmail.com')
        
        subject = "Test Email - Plateforme Lectio"
        html_content = """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #2d5a27; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 Lectio</h1>
                    <h2>Email de Test</h2>
                </div>
                <div class="content">
                    <p>Bonjour,</p>
                    <p>Ceci est un email de test pour vérifier que le système d'envoi d'emails de la plateforme Lectio fonctionne correctement.</p>
                    <p><strong>Date :</strong> """ + datetime.now().strftime("%d/%m/%Y %H:%M:%S") + """</p>
                    <p>Si vous recevez cet email, la configuration est opérationnelle !</p>
                    <p>Cordialement,<br>L'équipe Lectio</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        success = email_service.send_email(to_email, subject, html_content)
        
        if success:
            return jsonify({
                'success': True,
                'message': f'Email de test envoyé avec succès à {to_email}'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Échec de l\'envoi de l\'email de test'
            }), 500
            
    except Exception as e:
        logger.error(f"Erreur lors de l'envoi de l'email de test : {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@email_invoice_bp.route('/api/invoice/generate', methods=['POST'])
def generate_invoice():
    """
    Génère une facture PDF pour une commande
    """
    try:
        data = request.get_json()
        
        # Données de commande par défaut pour les tests
        order_data = data.get('order_data', {
            'order_number': f'CMD-{datetime.now().strftime("%Y%m%d%H%M%S")}',
            'items': [
                {
                    'title': 'L\'Étranger - Albert Camus',
                    'price': 8.50,
                    'quantity': 1
                },
                {
                    'title': 'Le Petit Prince - Antoine de Saint-Exupéry',
                    'price': 6.90,
                    'quantity': 2
                }
            ]
        })
        
        # Données client par défaut pour les tests
        customer_data = data.get('customer_data', {
            'name': 'Marie Dubois',
            'email': 'aouniibrahim94@gmail.com',
            'address': '45 Avenue des Champs-Élysées',
            'city': '75008 Paris'
        })
        
        # Générer la facture
        invoice_result = invoice_service.generate_invoice_pdf(order_data, customer_data)
        
        if invoice_result['success']:
            return jsonify({
                'success': True,
                'message': 'Facture générée avec succès',
                'invoice_data': {
                    'invoice_number': invoice_result['invoice_number'],
                    'filename': invoice_result['filename'],
                    'total_ht': invoice_result['total_ht'],
                    'total_ttc': invoice_result['total_ttc'],
                    'commission': invoice_result['commission'],
                    'seller_revenue': invoice_result['seller_revenue']
                }
            })
        else:
            return jsonify({
                'success': False,
                'error': invoice_result['error']
            }), 500
            
    except Exception as e:
        logger.error(f"Erreur lors de la génération de facture : {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@email_invoice_bp.route('/api/invoice/download/<filename>', methods=['GET'])
def download_invoice(filename):
    """
    Télécharge une facture PDF
    """
    try:
        filepath = os.path.join(invoice_service.invoices_dir, filename)
        
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True, download_name=filename)
        else:
            return jsonify({
                'success': False,
                'error': 'Facture non trouvée'
            }), 404
            
    except Exception as e:
        logger.error(f"Erreur lors du téléchargement de facture : {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@email_invoice_bp.route('/api/order/complete', methods=['POST'])
def complete_order():
    """
    Finalise une commande : génère la facture et envoie les emails
    """
    try:
        data = request.get_json()
        
        # Données de commande
        order_data = data.get('order_data', {
            'order_number': f'CMD-{datetime.now().strftime("%Y%m%d%H%M%S")}',
            'date': datetime.now().strftime("%d/%m/%Y"),
            'total': '22.30',
            'items': [
                {
                    'title': 'L\'Étranger - Albert Camus',
                    'price': 8.50,
                    'quantity': 1
                },
                {
                    'title': 'Le Petit Prince - Antoine de Saint-Exupéry',
                    'price': 6.90,
                    'quantity': 2
                }
            ]
        })
        
        # Données client
        customer_data = data.get('customer_data', {
            'name': 'Marie Dubois',
            'email': 'aouniibrahim94@gmail.com',
            'address': '45 Avenue des Champs-Élysées',
            'city': '75008 Paris'
        })
        
        results = {}
        
        # 1. Envoyer l'email de confirmation de commande
        confirmation_sent = email_service.send_order_confirmation(
            customer_data['email'],
            customer_data['name'],
            order_data
        )
        results['confirmation_email'] = confirmation_sent
        
        # 2. Générer la facture PDF
        invoice_result = invoice_service.generate_invoice_pdf(order_data, customer_data)
        results['invoice_generated'] = invoice_result['success']
        
        if invoice_result['success']:
            # 3. Envoyer la facture par email
            invoice_data = invoice_service.get_invoice_data_for_email(invoice_result, order_data)
            invoice_sent = email_service.send_invoice_email(
                customer_data['email'],
                customer_data['name'],
                invoice_data,
                invoice_result['filepath']
            )
            results['invoice_email'] = invoice_sent
            results['invoice_data'] = invoice_data
        
        # 4. Simuler l'envoi de notification d'expédition
        shipping_data = {
            'order_number': order_data['order_number'],
            'shipping_date': datetime.now().strftime("%d/%m/%Y"),
            'tracking_number': f'SC{datetime.now().strftime("%Y%m%d%H%M%S")}',
            'carrier': 'Colissimo',
            'estimated_delivery': '2-3 jours ouvrés'
        }
        
        shipping_sent = email_service.send_shipping_notification(
            customer_data['email'],
            customer_data['name'],
            shipping_data
        )
        results['shipping_email'] = shipping_sent
        results['shipping_data'] = shipping_data
        
        return jsonify({
            'success': True,
            'message': 'Commande finalisée avec succès',
            'results': results
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la finalisation de commande : {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@email_invoice_bp.route('/api/invoices/list', methods=['GET'])
def list_invoices():
    """
    Liste toutes les factures générées
    """
    try:
        invoices = []
        invoices_dir = invoice_service.invoices_dir
        
        if os.path.exists(invoices_dir):
            for filename in os.listdir(invoices_dir):
                if filename.endswith('.pdf'):
                    filepath = os.path.join(invoices_dir, filename)
                    stat = os.stat(filepath)
                    
                    invoices.append({
                        'filename': filename,
                        'size': stat.st_size,
                        'created': datetime.fromtimestamp(stat.st_ctime).strftime("%d/%m/%Y %H:%M:%S"),
                        'download_url': f'/api/invoice/download/{filename}'
                    })
        
        # Trier par date de création (plus récent en premier)
        invoices.sort(key=lambda x: x['created'], reverse=True)
        
        return jsonify({
            'success': True,
            'invoices': invoices,
            'count': len(invoices)
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la récupération des factures : {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

