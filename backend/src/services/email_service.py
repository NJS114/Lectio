"""
Service d'envoi d'emails pour la plateforme Lectio
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('MAIL_PORT', 587))
        self.use_tls = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
        self.username = os.getenv('MAIL_USERNAME')
        self.password = os.getenv('MAIL_PASSWORD')
        self.default_sender = os.getenv('MAIL_DEFAULT_SENDER')
        
    def send_email(self, to_email, subject, html_content, text_content=None, attachments=None):
        """
        Envoie un email avec contenu HTML et pièces jointes optionnelles
        """
        try:
            # Créer le message
            msg = MIMEMultipart('alternative')
            msg['From'] = self.default_sender
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Ajouter le contenu texte si fourni
            if text_content:
                text_part = MIMEText(text_content, 'plain', 'utf-8')
                msg.attach(text_part)
            
            # Ajouter le contenu HTML
            html_part = MIMEText(html_content, 'html', 'utf-8')
            msg.attach(html_part)
            
            # Ajouter les pièces jointes si fournies
            if attachments:
                for attachment in attachments:
                    self._add_attachment(msg, attachment)
            
            # Envoyer l'email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                if self.use_tls:
                    server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)
            
            logger.info(f"Email envoyé avec succès à {to_email}")
            return True
            
        except Exception as e:
            logger.error(f"Erreur lors de l'envoi de l'email à {to_email}: {str(e)}")
            return False
    
    def _add_attachment(self, msg, attachment_path):
        """
        Ajoute une pièce jointe au message
        """
        try:
            with open(attachment_path, "rb") as attachment:
                part = MIMEBase('application', 'octet-stream')
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            filename = os.path.basename(attachment_path)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename= {filename}',
            )
            msg.attach(part)
            
        except Exception as e:
            logger.error(f"Erreur lors de l'ajout de la pièce jointe {attachment_path}: {str(e)}")
    
    def send_order_confirmation(self, user_email, user_name, order_data):
        """
        Envoie un email de confirmation de commande
        """
        subject = f"Confirmation de commande #{order_data['order_number']} - Lectio"
        
        html_content = self._get_order_confirmation_template(user_name, order_data)
        
        return self.send_email(user_email, subject, html_content)
    
    def send_shipping_notification(self, user_email, user_name, shipping_data):
        """
        Envoie un email de notification d'expédition
        """
        subject = f"Votre commande #{shipping_data['order_number']} a été expédiée - Lectio"
        
        html_content = self._get_shipping_notification_template(user_name, shipping_data)
        
        return self.send_email(user_email, subject, html_content)
    
    def send_invoice_email(self, user_email, user_name, invoice_data, invoice_pdf_path):
        """
        Envoie un email avec la facture en pièce jointe
        """
        subject = f"Facture #{invoice_data['invoice_number']} - Lectio"
        
        html_content = self._get_invoice_email_template(user_name, invoice_data)
        
        return self.send_email(
            user_email, 
            subject, 
            html_content, 
            attachments=[invoice_pdf_path]
        )
    
    def _get_order_confirmation_template(self, user_name, order_data):
        """
        Template HTML pour la confirmation de commande
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #2d5a27; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .order-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .button {{ background-color: #2d5a27; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📚 Lectio</h1>
                    <h2>Confirmation de commande</h2>
                </div>
                
                <div class="content">
                    <p>Bonjour {user_name},</p>
                    
                    <p>Nous avons bien reçu votre commande et nous vous remercions pour votre confiance !</p>
                    
                    <div class="order-details">
                        <h3>Détails de votre commande</h3>
                        <p><strong>Numéro de commande :</strong> #{order_data['order_number']}</p>
                        <p><strong>Date :</strong> {order_data['date']}</p>
                        <p><strong>Total :</strong> {order_data['total']}€</p>
                        
                        <h4>Articles commandés :</h4>
                        <ul>
                            {self._format_order_items(order_data.get('items', []))}
                        </ul>
                    </div>
                    
                    <p>Votre commande sera traitée dans les plus brefs délais. Vous recevrez un email de confirmation d'expédition avec le numéro de suivi dès que votre colis sera pris en charge par le transporteur.</p>
                    
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/tracking" class="button">Suivre ma commande</a>
                    </p>
                </div>
                
                <div class="footer">
                    <p>Merci de faire confiance à Lectio pour vos achats de livres !</p>
                    <p>L'équipe Lectio<br>
                    📧 contact@lectio.fr | 📞 +33 1 23 45 67 89</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _get_shipping_notification_template(self, user_name, shipping_data):
        """
        Template HTML pour la notification d'expédition
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #2d5a27; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .shipping-info {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .tracking-number {{ background-color: #e8f5e8; padding: 10px; border-radius: 5px; font-weight: bold; text-align: center; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
                .button {{ background-color: #2d5a27; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📦 Lectio</h1>
                    <h2>Votre commande a été expédiée !</h2>
                </div>
                
                <div class="content">
                    <p>Bonjour {user_name},</p>
                    
                    <p>Bonne nouvelle ! Votre commande #{shipping_data['order_number']} a été expédiée et est maintenant en route vers vous.</p>
                    
                    <div class="shipping-info">
                        <h3>Informations d'expédition</h3>
                        <p><strong>Transporteur :</strong> {shipping_data.get('carrier', 'Colissimo')}</p>
                        <p><strong>Date d'expédition :</strong> {shipping_data['shipping_date']}</p>
                        <p><strong>Livraison estimée :</strong> {shipping_data.get('estimated_delivery', '2-3 jours ouvrés')}</p>
                        
                        <div class="tracking-number">
                            <p>Numéro de suivi : {shipping_data['tracking_number']}</p>
                        </div>
                    </div>
                    
                    <p>Vous pouvez suivre votre colis en temps réel en utilisant le numéro de suivi ci-dessus.</p>
                    
                    <p style="text-align: center;">
                        <a href="http://localhost:5173/tracking" class="button">Suivre mon colis</a>
                    </p>
                </div>
                
                <div class="footer">
                    <p>Merci pour votre commande !</p>
                    <p>L'équipe Lectio<br>
                    📧 contact@lectio.fr | 📞 +33 1 23 45 67 89</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _get_invoice_email_template(self, user_name, invoice_data):
        """
        Template HTML pour l'envoi de facture
        """
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #2d5a27; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .invoice-info {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🧾 Lectio</h1>
                    <h2>Votre facture</h2>
                </div>
                
                <div class="content">
                    <p>Bonjour {user_name},</p>
                    
                    <p>Veuillez trouver ci-joint votre facture pour la commande #{invoice_data['order_number']}.</p>
                    
                    <div class="invoice-info">
                        <h3>Détails de la facture</h3>
                        <p><strong>Numéro de facture :</strong> {invoice_data['invoice_number']}</p>
                        <p><strong>Date :</strong> {invoice_data['date']}</p>
                        <p><strong>Montant total :</strong> {invoice_data['total']}€ TTC</p>
                    </div>
                    
                    <p>Cette facture est également disponible dans votre espace client sur notre site web.</p>
                </div>
                
                <div class="footer">
                    <p>Merci pour votre confiance !</p>
                    <p>L'équipe Lectio<br>
                    📧 contact@lectio.fr | 📞 +33 1 23 45 67 89</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    def _format_order_items(self, items):
        """
        Formate la liste des articles pour l'email
        """
        formatted_items = []
        for item in items:
            formatted_items.append(f"<li>{item.get('title', 'Article')} - {item.get('price', '0')}€</li>")
        return ''.join(formatted_items)

# Instance globale du service email
email_service = EmailService()

