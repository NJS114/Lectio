import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShipping } from '../../hooks/useShipping';
import { useAuth } from '../../hooks/useAuth';
import {
  ArrowLeft, Package, Truck, MapPin, Check, Clock, 
  AlertCircle, Phone, Mail, Download, Share2
} from 'lucide-react';

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { trackOrder } = useShipping();
  const { user } = useAuth();
  
  const [trackingData, setTrackingData] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulation de récupération des données de commande
    setTimeout(() => {
      const tracking = trackOrder(orderId);
      setTrackingData(tracking);
      
      // Données de commande simulées
      setOrderDetails({
        id: orderId,
        number: `CMD-${orderId?.slice(-6)?.toUpperCase()}`,
        date: new Date('2024-08-15'),
        status: 'in_transit',
        items: [
          {
            id: 1,
            title: "L'Étranger",
            author: "Albert Camus",
            price: 8.50,
            condition: "Très Bon",
            image: "/api/placeholder/80/100"
          },
          {
            id: 2,
            title: "Sapiens",
            author: "Yuval Noah Harari",
            price: 12.00,
            condition: "Bon",
            image: "/api/placeholder/80/100"
          }
        ],
        shipping: {
          method: "Livraison standard",
          address: "123 rue de la Paix, 75001 Paris",
          cost: 4.95
        },
        payment: {
          method: "Carte bancaire",
          total: 25.45
        },
        carrier: {
          name: "Colissimo",
          trackingNumber: "3S00123456789",
          phone: "3631",
          website: "https://www.laposte.fr/outils/suivre-vos-envois"
        }
      });
      
      setIsLoading(false);
    }, 1000);
  }, [orderId, trackOrder]);

  const getStatusIcon = (status) => {
    const icons = {
      ordered: Clock,
      picked_up: Package,
      in_transit: Truck,
      out_for_delivery: MapPin,
      delivered: Check,
      exception: AlertCircle
    };
    return icons[status] || Clock;
  };

  const getStatusColor = (status) => {
    const colors = {
      ordered: 'var(--color-warning)',
      picked_up: 'var(--color-info)',
      in_transit: 'var(--color-primary)',
      out_for_delivery: 'var(--color-success)',
      delivered: 'var(--color-success)',
      exception: 'var(--color-error)'
    };
    return colors[status] || 'var(--color-text-secondary)';
  };

  const getStatusText = (status) => {
    const texts = {
      ordered: 'Commande confirmée',
      picked_up: 'Récupéré par le transporteur',
      in_transit: 'En cours de transport',
      out_for_delivery: 'En cours de livraison',
      delivered: 'Livré',
      exception: 'Incident de livraison'
    };
    return texts[status] || 'Statut inconnu';
  };

  const handleDownloadInvoice = () => {
    // Simulation de téléchargement de facture
    const link = document.createElement('a');
    link.href = '#';
    link.download = `facture-${orderDetails.number}.pdf`;
    link.click();
  };

  const handleShareTracking = () => {
    if (navigator.share) {
      navigator.share({
        title: `Suivi de commande ${orderDetails.number}`,
        text: `Suivez ma commande Lectio`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers');
    }
  };

  if (!user) {
    return (
      <div className="tracking-page">
        <div className="container">
          <div className="login-required">
            <h2>Connexion requise</h2>
            <p>Vous devez être connecté pour suivre vos commandes.</p>
            <button onClick={() => navigate('/login')} className="btn btn-primary">
              Se connecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="tracking-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Chargement des informations de suivi...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="tracking-page">
        <div className="container">
          <div className="not-found">
            <AlertCircle size={48} />
            <h2>Commande introuvable</h2>
            <p>Aucune commande trouvée avec cet identifiant.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
              Retour au dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-page">
      <div className="container">
        <div className="tracking-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <ArrowLeft size={20} />
            Retour au dashboard
          </button>
          
          <div className="header-actions">
            <button onClick={handleDownloadInvoice} className="action-btn">
              <Download size={20} />
              Facture
            </button>
            <button onClick={handleShareTracking} className="action-btn">
              <Share2 size={20} />
              Partager
            </button>
          </div>
        </div>

        <div className="tracking-content">
          <div className="tracking-main">
            {/* Informations de commande */}
            <div className="order-info">
              <div className="order-header">
                <h1>Commande {orderDetails.number}</h1>
                <div className="order-meta">
                  <span>Passée le {orderDetails.date.toLocaleDateString('fr-FR')}</span>
                  <span className={`status-badge ${orderDetails.status}`}>
                    {getStatusText(orderDetails.status)}
                  </span>
                </div>
              </div>

              <div className="carrier-info">
                <div className="carrier-details">
                  <h3>Transporteur: {orderDetails.carrier.name}</h3>
                  <p>Numéro de suivi: <strong>{orderDetails.carrier.trackingNumber}</strong></p>
                </div>
                <div className="carrier-contact">
                  <a href={`tel:${orderDetails.carrier.phone}`} className="contact-btn">
                    <Phone size={16} />
                    {orderDetails.carrier.phone}
                  </a>
                  <a href={orderDetails.carrier.website} target="_blank" rel="noopener noreferrer" className="contact-btn">
                    <Package size={16} />
                    Site transporteur
                  </a>
                </div>
              </div>
            </div>

            {/* Timeline de suivi */}
            <div className="tracking-timeline">
              <h2>Suivi de votre colis</h2>
              
              {trackingData.length > 0 ? (
                <div className="timeline">
                  {trackingData.map((event, index) => {
                    const Icon = getStatusIcon(event.status);
                    const isLatest = index === trackingData.length - 1;
                    
                    return (
                      <div key={index} className={`timeline-item ${isLatest ? 'latest' : ''}`}>
                        <div className="timeline-icon" style={{ color: getStatusColor(event.status) }}>
                          <Icon size={24} />
                        </div>
                        <div className="timeline-content">
                          <div className="timeline-header">
                            <h3>{event.description}</h3>
                            <span className="timeline-date">
                              {event.date.toLocaleDateString('fr-FR')} à {event.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="timeline-location">{event.location}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-tracking">
                  <Package size={48} />
                  <h3>Aucune information de suivi disponible</h3>
                  <p>Les informations de suivi seront mises à jour dès que votre colis sera pris en charge par le transporteur.</p>
                </div>
              )}
            </div>

            {/* Estimation de livraison */}
            <div className="delivery-estimate">
              <h3>Livraison estimée</h3>
              <div className="estimate-content">
                <div className="estimate-date">
                  <Clock size={24} />
                  <div>
                    <h4>Jeudi 17 août 2024</h4>
                    <p>Entre 9h et 18h</p>
                  </div>
                </div>
                <div className="delivery-address">
                  <MapPin size={24} />
                  <div>
                    <h4>Adresse de livraison</h4>
                    <p>{orderDetails.shipping.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar avec détails de commande */}
          <div className="tracking-sidebar">
            <div className="order-summary">
              <h3>Détails de la commande</h3>
              
              <div className="order-items">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img src={item.image} alt={item.title} />
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      <p>{item.author}</p>
                      <span className="condition">{item.condition}</span>
                    </div>
                    <div className="item-price">{item.price.toFixed(2)}€</div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Sous-total</span>
                  <span>{(orderDetails.payment.total - orderDetails.shipping.cost).toFixed(2)}€</span>
                </div>
                <div className="total-row">
                  <span>Livraison</span>
                  <span>{orderDetails.shipping.cost.toFixed(2)}€</span>
                </div>
                <div className="total-row final">
                  <span>Total</span>
                  <span>{orderDetails.payment.total.toFixed(2)}€</span>
                </div>
              </div>

              <div className="payment-info">
                <h4>Paiement</h4>
                <p>{orderDetails.payment.method}</p>
              </div>
            </div>

            <div className="help-section">
              <h3>Besoin d'aide ?</h3>
              <div className="help-options">
                <button className="help-btn">
                  <Mail size={20} />
                  Contacter le support
                </button>
                <button className="help-btn">
                  <Phone size={20} />
                  Signaler un problème
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .tracking-page {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem 0;
        }

        .tracking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .back-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: 0.9rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: white;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .tracking-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .order-info {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .order-header {
          margin-bottom: 1rem;
        }

        .order-header h1 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .order-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--color-text-secondary);
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.ordered {
          background: var(--color-warning-light);
          color: var(--color-warning);
        }

        .status-badge.in_transit {
          background: var(--color-primary-light);
          color: var(--color-primary);
        }

        .status-badge.delivered {
          background: var(--color-success-light);
          color: var(--color-success);
        }

        .carrier-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border);
        }

        .carrier-contact {
          display: flex;
          gap: 0.5rem;
        }

        .contact-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border: 1px solid var(--color-border);
          border-radius: 6px;
          color: var(--color-text);
          text-decoration: none;
          font-size: 0.8rem;
          transition: all 0.3s ease;
        }

        .contact-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .tracking-timeline {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 1rem;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-border);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 2rem;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-icon {
          position: absolute;
          left: -2rem;
          top: 0;
          width: 2rem;
          height: 2rem;
          background: white;
          border: 2px solid currentColor;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .timeline-item.latest .timeline-icon {
          background: currentColor;
          color: white !important;
        }

        .timeline-content {
          padding-left: 1rem;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.25rem;
        }

        .timeline-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .timeline-date {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
        }

        .timeline-location {
          margin: 0;
          font-size: 0.9rem;
          color: var(--color-text-secondary);
        }

        .no-tracking {
          text-align: center;
          padding: 3rem 0;
          color: var(--color-text-secondary);
        }

        .delivery-estimate {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .estimate-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .estimate-date,
        .delivery-address {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .estimate-date h4,
        .delivery-address h4 {
          margin: 0 0 0.25rem 0;
          font-size: 1rem;
        }

        .estimate-date p,
        .delivery-address p {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .order-summary {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .order-items {
          margin-bottom: 1.5rem;
        }

        .order-item {
          display: flex;
          gap: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--color-border);
        }

        .order-item:last-child {
          border-bottom: none;
        }

        .order-item img {
          width: 60px;
          height: 80px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
        }

        .item-info p {
          margin: 0 0 0.5rem 0;
          color: var(--color-text-secondary);
          font-size: 0.8rem;
        }

        .condition {
          background: var(--color-success-light);
          color: var(--color-success);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
        }

        .item-price {
          font-weight: 600;
          color: var(--color-primary);
        }

        .order-totals {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
          margin-bottom: 1rem;
        }

        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .total-row.final {
          font-weight: 600;
          font-size: 1.1rem;
          color: var(--color-primary);
          border-top: 1px solid var(--color-border);
          padding-top: 0.5rem;
          margin-top: 0.5rem;
        }

        .payment-info {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
        }

        .payment-info h4 {
          margin: 0 0 0.5rem 0;
          font-size: 0.9rem;
        }

        .payment-info p {
          margin: 0;
          color: var(--color-text-secondary);
        }

        .help-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .help-options {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .help-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem;
          border: 1px solid var(--color-border);
          border-radius: 8px;
          background: white;
          color: var(--color-text);
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .help-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .loading,
        .not-found,
        .login-required {
          text-align: center;
          padding: 4rem 0;
        }

        .loading-spinner {
          width: 3rem;
          height: 3rem;
          border: 3px solid var(--color-border);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .tracking-content {
            grid-template-columns: 1fr;
          }
          
          .header-actions {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .carrier-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .estimate-content {
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderTrackingPage;

