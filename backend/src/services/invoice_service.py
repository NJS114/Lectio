"""
Service de génération de factures PDF pour la plateforme Lectio
"""
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.pdfgen import canvas
import logging

logger = logging.getLogger(__name__)

class InvoiceService:
    def __init__(self):
        self.company_name = os.getenv('COMPANY_NAME', 'Lectio')
        self.company_address = os.getenv('COMPANY_ADDRESS', '123 Rue de la Lecture, 75001 Paris, France')
        self.company_phone = os.getenv('COMPANY_PHONE', '+33 1 23 45 67 89')
        self.company_email = os.getenv('COMPANY_EMAIL', 'contact@lectio.fr')
        self.company_siret = os.getenv('COMPANY_SIRET', '12345678901234')
        self.tva_rate = float(os.getenv('TVA_RATE', 20.0))
        
        # Créer le dossier des factures s'il n'existe pas
        self.invoices_dir = '/home/ubuntu/lectio-backend-complete/invoices'
        os.makedirs(self.invoices_dir, exist_ok=True)
    
    def generate_invoice_number(self):
        """
        Génère un numéro de facture unique
        """
        now = datetime.now()
        timestamp = now.strftime("%Y%m%d%H%M%S")
        return f"FACT-{timestamp}"
    
    def generate_invoice_pdf(self, order_data, customer_data):
        """
        Génère une facture PDF pour une commande
        """
        try:
            invoice_number = self.generate_invoice_number()
            filename = f"facture_{invoice_number}.pdf"
            filepath = os.path.join(self.invoices_dir, filename)
            
            # Créer le document PDF
            doc = SimpleDocTemplate(filepath, pagesize=A4)
            story = []
            
            # Styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                textColor=colors.HexColor('#2d5a27')
            )
            
            # En-tête de la facture
            story.append(Paragraph(f"FACTURE N° {invoice_number}", title_style))
            story.append(Spacer(1, 20))
            
            # Informations de l'entreprise et du client
            company_client_data = [
                ['ÉMETTEUR', 'DESTINATAIRE'],
                [
                    f"{self.company_name}<br/>{self.company_address}<br/>Tél: {self.company_phone}<br/>Email: {self.company_email}<br/>SIRET: {self.company_siret}",
                    f"{customer_data.get('name', 'Client')}<br/>{customer_data.get('address', '')}<br/>{customer_data.get('city', '')}<br/>Email: {customer_data.get('email', '')}"
                ]
            ]
            
            company_client_table = Table(company_client_data, colWidths=[8*cm, 8*cm])
            company_client_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d5a27')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 12),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
                ('VALIGN', (0, 0), (-1, -1), 'TOP'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
            ]))
            
            story.append(company_client_table)
            story.append(Spacer(1, 30))
            
            # Informations de la facture
            invoice_date = datetime.now().strftime("%d/%m/%Y")
            info_data = [
                ['Date de facture:', invoice_date],
                ['Commande N°:', order_data.get('order_number', 'N/A')],
                ['Mode de paiement:', 'Carte bancaire'],
            ]
            
            info_table = Table(info_data, colWidths=[4*cm, 6*cm])
            info_table.setStyle(TableStyle([
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ]))
            
            story.append(info_table)
            story.append(Spacer(1, 30))
            
            # Tableau des articles
            items_data = [['Description', 'Quantité', 'Prix unitaire HT', 'Total HT']]
            
            subtotal_ht = 0
            for item in order_data.get('items', []):
                price_ht = float(item.get('price', 0)) / (1 + self.tva_rate / 100)
                quantity = int(item.get('quantity', 1))
                total_ht = price_ht * quantity
                subtotal_ht += total_ht
                
                items_data.append([
                    item.get('title', 'Article'),
                    str(quantity),
                    f"{price_ht:.2f}€",
                    f"{total_ht:.2f}€"
                ])
            
            # Calculs des totaux
            tva_amount = subtotal_ht * (self.tva_rate / 100)
            total_ttc = subtotal_ht + tva_amount
            
            # Commission Lectio (20%)
            commission_rate = 20.0
            commission_amount = subtotal_ht * (commission_rate / 100)
            seller_revenue = subtotal_ht - commission_amount
            
            # Ajouter les lignes de totaux
            items_data.extend([
                ['', '', 'Sous-total HT:', f"{subtotal_ht:.2f}€"],
                ['', '', f'TVA ({self.tva_rate}%):', f"{tva_amount:.2f}€"],
                ['', '', 'TOTAL TTC:', f"{total_ttc:.2f}€"],
                ['', '', '', ''],
                ['', '', 'Commission Lectio (20%):', f"{commission_amount:.2f}€"],
                ['', '', 'Revenus vendeur:', f"{seller_revenue:.2f}€"],
            ])
            
            items_table = Table(items_data, colWidths=[8*cm, 2*cm, 3*cm, 3*cm])
            items_table.setStyle(TableStyle([
                # En-tête
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2d5a27')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                
                # Corps du tableau
                ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 10),
                ('GRID', (0, 0), (-1, len(items_data)-4), 1, colors.black),
                
                # Lignes de totaux
                ('FONTNAME', (2, -6), (-1, -1), 'Helvetica-Bold'),
                ('BACKGROUND', (2, -3), (-1, -3), colors.HexColor('#e8f5e8')),
                ('FONTSIZE', (2, -3), (-1, -3), 12),
                
                # Commission et revenus vendeur
                ('BACKGROUND', (2, -2), (-1, -1), colors.HexColor('#f0f8f0')),
                ('TEXTCOLOR', (2, -2), (-1, -1), colors.HexColor('#2d5a27')),
            ]))
            
            story.append(items_table)
            story.append(Spacer(1, 30))
            
            # Conditions de paiement
            conditions_style = ParagraphStyle(
                'Conditions',
                parent=styles['Normal'],
                fontSize=9,
                textColor=colors.grey
            )
            
            conditions_text = """
            <b>Conditions de paiement :</b><br/>
            Paiement comptant par carte bancaire.<br/>
            TVA non applicable, art. 293 B du CGI.<br/>
            En cas de retard de paiement, indemnité forfaitaire pour frais de recouvrement : 40€ (art. L441-6 du code de commerce).
            """
            
            story.append(Paragraph(conditions_text, conditions_style))
            
            # Générer le PDF
            doc.build(story)
            
            logger.info(f"Facture générée avec succès : {filepath}")
            
            return {
                'success': True,
                'invoice_number': invoice_number,
                'filepath': filepath,
                'filename': filename,
                'total_ht': subtotal_ht,
                'tva_amount': tva_amount,
                'total_ttc': total_ttc,
                'commission': commission_amount,
                'seller_revenue': seller_revenue
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la génération de la facture : {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_invoice_data_for_email(self, invoice_result, order_data):
        """
        Prépare les données de facture pour l'email
        """
        return {
            'invoice_number': invoice_result['invoice_number'],
            'order_number': order_data.get('order_number', 'N/A'),
            'date': datetime.now().strftime("%d/%m/%Y"),
            'total': f"{invoice_result['total_ttc']:.2f}"
        }

# Instance globale du service de facturation
invoice_service = InvoiceService()

