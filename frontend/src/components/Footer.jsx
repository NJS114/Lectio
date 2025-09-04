import React from 'react';
import { Leaf, Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          {/* Logo et description */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="logo">
                <div className="logo__icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path 
                      d="M8 6h16c1.1 0 2 .9 2 2v16c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      fill="none"
                    />
                    <path 
                      d="M12 10v12M20 10v12M16 6v20" 
                      stroke="currentColor" 
                      strokeWidth="1.5"
                    />
                    <circle 
                      cx="16" 
                      cy="16" 
                      r="12" 
                      stroke="var(--color-green-primary)" 
                      strokeWidth="1" 
                      fill="none" 
                      strokeDasharray="2 2"
                    />
                  </svg>
                </div>
                <span className="logo__text">LECTIO</span>
              </div>
            </div>
            <p className="footer__description">
              La marketplace qui donne une seconde vie aux livres. 
              Vendez, achetez, louez entre passionnés et soutenez vos libraires locaux.
            </p>
            <div className="footer__eco-badge">
              <Leaf size={16} />
              <span>Éco-responsable</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer__nav">
            <div className="footer__section">
              <h4 className="footer__section-title">Découvrir</h4>
              <ul className="footer__links">
                <li><a href="#" className="footer__link">Catalogue</a></li>
                <li><a href="#" className="footer__link">Nouveautés</a></li>
                <li><a href="#" className="footer__link">Coups de Cœur</a></li>
                <li><a href="#" className="footer__link">Libraires</a></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4 className="footer__section-title">Vendre & Louer</h4>
              <ul className="footer__links">
                <li><a href="#" className="footer__link">Vendre un livre</a></li>
                <li><a href="#" className="footer__link">Mettre en location</a></li>
                <li><a href="#" className="footer__link">Guide du vendeur</a></li>
                <li><a href="#" className="footer__link">Devenir libraire</a></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4 className="footer__section-title">Support</h4>
              <ul className="footer__links">
                <li><a href="#" className="footer__link">Centre d'aide</a></li>
                <li><a href="#" className="footer__link">FAQ</a></li>
                <li><a href="#" className="footer__link">Contact</a></li>
                <li><a href="#" className="footer__link">Signaler un problème</a></li>
              </ul>
            </div>

            <div className="footer__section">
              <h4 className="footer__section-title">À propos</h4>
              <ul className="footer__links">
                <li><a href="#" className="footer__link">Notre mission</a></li>
                <li><a href="#" className="footer__link">Impact écologique</a></li>
                <li><a href="#" className="footer__link">Presse</a></li>
                <li><a href="#" className="footer__link">Carrières</a></li>
              </ul>
            </div>
          </div>

          {/* Contact et réseaux sociaux */}
          <div className="footer__contact">
            <h4 className="footer__section-title">Nous contacter</h4>
            <div className="footer__contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>hello@lectio.fr</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>01 23 45 67 89</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Paris, France</span>
              </div>
            </div>
            
            <div className="footer__social">
              <h5 className="footer__social-title">Suivez-nous</h5>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <Twitter size={20} />
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="footer__bottom">
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">Conditions générales</a>
            <a href="#" className="footer__legal-link">Politique de confidentialité</a>
            <a href="#" className="footer__legal-link">Mentions légales</a>
            <a href="#" className="footer__legal-link">RGPD</a>
          </div>
          <div className="footer__copyright">
            <Heart size={14} fill="var(--color-green-primary)" />
            <span>© 2024 Lectio. Fait avec passion pour les livres.</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background-color: var(--color-gray-warm-dark);
          color: var(--color-beige-paper);
          padding: var(--spacing-2xl) 0 var(--spacing-lg);
        }

        .footer__content {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--spacing-xl);
          margin-bottom: var(--spacing-xl);
        }

        @media (min-width: 768px) {
          .footer__content {
            grid-template-columns: 1fr 2fr 1fr;
          }
        }

        .footer__brand {
          max-width: 300px;
        }

        .footer__logo {
          margin-bottom: var(--spacing-md);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          color: var(--color-beige-paper);
        }

        .logo__icon {
          color: var(--color-green-primary);
        }

        .logo__text {
          font-family: var(--font-editorial);
          font-size: 24px;
          font-weight: 600;
        }

        .footer__description {
          line-height: 1.6;
          margin-bottom: var(--spacing-md);
          color: var(--color-gray-warm-medium);
        }

        .footer__eco-badge {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-xs);
          padding: var(--spacing-xs) var(--spacing-sm);
          background-color: var(--color-green-primary);
          color: white;
          border-radius: var(--radius-xl);
          font-size: 14px;
          font-weight: 500;
        }

        .footer__nav {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--spacing-lg);
        }

        .footer__section-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: var(--spacing-md);
          color: var(--color-beige-paper);
        }

        .footer__links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer__links li {
          margin-bottom: var(--spacing-sm);
        }

        .footer__link {
          color: var(--color-gray-warm-medium);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .footer__link:hover {
          color: var(--color-green-primary);
        }

        .footer__contact-info {
          margin-bottom: var(--spacing-lg);
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
          color: var(--color-gray-warm-medium);
        }

        .contact-item svg {
          color: var(--color-green-primary);
        }

        .footer__social-title {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: var(--spacing-sm);
          color: var(--color-beige-paper);
        }

        .social-links {
          display: flex;
          gap: var(--spacing-sm);
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: var(--color-gray-warm-medium);
          color: var(--color-gray-warm-dark);
          border-radius: 50%;
          text-decoration: none;
          transition: all var(--transition-fast);
        }

        .social-link:hover {
          background-color: var(--color-green-primary);
          color: white;
          transform: translateY(-2px);
        }

        .footer__bottom {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--color-gray-warm-medium);
        }

        @media (min-width: 768px) {
          .footer__bottom {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .footer__legal {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-md);
        }

        .footer__legal-link {
          color: var(--color-gray-warm-medium);
          text-decoration: none;
          font-size: 14px;
          transition: color var(--transition-fast);
        }

        .footer__legal-link:hover {
          color: var(--color-green-primary);
        }

        .footer__copyright {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }

        @media (max-width: 767px) {
          .footer__content {
            text-align: center;
          }

          .footer__nav {
            grid-template-columns: repeat(2, 1fr);
          }

          .footer__legal {
            justify-content: center;
          }

          .footer__copyright {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;

