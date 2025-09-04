import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEbooks } from '../../hooks/useEbooks';
import { useAffiliation } from '../../hooks/useAffiliation';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import {
  Star, Download, Heart, Share2, Eye, User, Calendar,
  BookOpen, FileText, Globe, DollarSign, Tag, Clock,
  ArrowLeft, ShoppingCart, ExternalLink, Copy, Link2
} from 'lucide-react';

const EbookDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getEbookById } = useEbooks();
  const { createAffiliateLink, generateAffiliateLink } = useAffiliation();
  const { addToCart } = useCart();
  
  const [ebook, setEbook] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [showAffiliateModal, setShowAffiliateModal] = useState(false);
  const [affiliateLinks, setAffiliateLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const ebookData = getEbookById(id);
    setEbook(ebookData);
    setIsLoading(false);
  }, [id, getEbookById]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const formatFileSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={i < Math.floor(rating) ? 'filled' : 'empty'}
      />
    ));
  };

  const handleAddToCart = () => {
    if (ebook) {
      addToCart({
        id: ebook.id,
        title: ebook.title,
        author: ebook.author,
        price: ebook.price,
        cover: ebook.cover,
        type: 'ebook'
      });
    }
  };

  const handleCreateAffiliateLink = async (platform) => {
    try {
      const link = await createAffiliateLink(ebook.id, platform);
      setAffiliateLinks(prev => [...prev, link]);
    } catch (error) {
      console.error('Erreur lors de la création du lien d\'affiliation:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Afficher une notification de succès
  };

  const shareEbook = () => {
    if (navigator.share) {
      navigator.share({
        title: ebook.title,
        text: `Découvrez "${ebook.title}" par ${ebook.author}`,
        url: window.location.href
      });
    } else {
      copyToClipboard(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="ebook-detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Chargement de l'ebook...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="ebook-detail-page">
        <div className="container">
          <div className="error-state">
            <BookOpen size={64} />
            <h2>Ebook non trouvé</h2>
            <p>L'ebook que vous recherchez n'existe pas ou a été supprimé.</p>
            <button onClick={() => navigate('/ebooks')} className="btn btn-primary">
              Retour aux ebooks
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ebook-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <button onClick={() => navigate('/ebooks')} className="back-button">
            <ArrowLeft size={20} />
            Retour aux ebooks
          </button>
        </div>

        <div className="ebook-header">
          <div className="ebook-cover-section">
            <div className="main-cover">
              <img src={ebook.cover} alt={ebook.title} />
              {ebook.discount > 0 && (
                <div className="discount-badge">-{ebook.discount}%</div>
              )}
            </div>
            
            {ebook.preview && (
              <div className="preview-cover">
                <img src={ebook.preview} alt="Aperçu" />
                <div className="preview-overlay">
                  <Eye size={24} />
                  <span>Aperçu</span>
                </div>
              </div>
            )}
          </div>

          <div className="ebook-info">
            <div className="ebook-category">{ebook.category}</div>
            <h1 className="ebook-title">{ebook.title}</h1>
            <p className="ebook-author">Par {ebook.author}</p>

            <div className="ebook-rating">
              <div className="stars">
                {renderStars(ebook.rating)}
              </div>
              <span className="rating-text">
                {ebook.rating.toFixed(1)} ({ebook.reviews} avis)
              </span>
            </div>

            <div className="ebook-price">
              {ebook.originalPrice && ebook.originalPrice > ebook.price && (
                <span className="original-price">{formatPrice(ebook.originalPrice)}</span>
              )}
              <span className="current-price">{formatPrice(ebook.price)}</span>
              {ebook.discount > 0 && (
                <span className="discount-text">Économisez {formatPrice(ebook.originalPrice - ebook.price)}</span>
              )}
            </div>

            <div className="ebook-details">
              <div className="detail-item">
                <FileText size={16} />
                <span>{ebook.format}</span>
              </div>
              <div className="detail-item">
                <BookOpen size={16} />
                <span>{ebook.pages} pages</span>
              </div>
              <div className="detail-item">
                <Globe size={16} />
                <span>{ebook.language}</span>
              </div>
              <div className="detail-item">
                <Download size={16} />
                <span>{ebook.sales_stats.total_sales} téléchargements</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Publié le {formatDate(ebook.publishDate)}</span>
              </div>
            </div>

            <div className="ebook-tags">
              {ebook.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>

            <div className="action-buttons">
              <button onClick={handleAddToCart} className="btn btn-primary">
                <ShoppingCart size={20} />
                Ajouter au panier
              </button>
              <button className="btn btn-secondary">
                <Download size={20} />
                Télécharger maintenant
              </button>
              <button onClick={() => setShowAffiliateModal(true)} className="btn btn-outline">
                <Link2 size={20} />
                Lien d'affiliation
              </button>
            </div>

            <div className="secondary-actions">
              <button className="action-btn" title="Ajouter aux favoris">
                <Heart size={20} />
              </button>
              <button className="action-btn" onClick={shareEbook} title="Partager">
                <Share2 size={20} />
              </button>
              <button className="action-btn" title="Aperçu">
                <Eye size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="ebook-content">
          <div className="content-tabs">
            <button 
              className={activeTab === 'description' ? 'active' : ''}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={activeTab === 'contents' ? 'active' : ''}
              onClick={() => setActiveTab('contents')}
            >
              Table des matières
            </button>
            <button 
              className={activeTab === 'author' ? 'active' : ''}
              onClick={() => setActiveTab('author')}
            >
              À propos de l'auteur
            </button>
            <button 
              className={activeTab === 'reviews' ? 'active' : ''}
              onClick={() => setActiveTab('reviews')}
            >
              Avis ({ebook.reviews})
            </button>
            <button 
              className={activeTab === 'affiliate' ? 'active' : ''}
              onClick={() => setActiveTab('affiliate')}
            >
              Liens d'affiliation
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <h3>Description</h3>
                <p>{ebook.description}</p>
                
                <div className="technical-details">
                  <h4>Détails techniques</h4>
                  <div className="details-grid">
                    <div className="detail">
                      <strong>ISBN:</strong> {ebook.isbn}
                    </div>
                    <div className="detail">
                      <strong>Taille du fichier:</strong> {formatFileSize(ebook.fileSize)}
                    </div>
                    <div className="detail">
                      <strong>Format:</strong> {ebook.format}
                    </div>
                    <div className="detail">
                      <strong>Langue:</strong> {ebook.language}
                    </div>
                    <div className="detail">
                      <strong>Pages:</strong> {ebook.pages}
                    </div>
                    <div className="detail">
                      <strong>Date de publication:</strong> {formatDate(ebook.publishDate)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contents' && (
              <div className="contents-content">
                <h3>Table des matières</h3>
                {ebook.tableOfContents && ebook.tableOfContents.length > 0 ? (
                  <ol className="table-of-contents">
                    {ebook.tableOfContents.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                ) : (
                  <p>Table des matières non disponible.</p>
                )}
              </div>
            )}

            {activeTab === 'author' && (
              <div className="author-content">
                <div className="author-header">
                  <div className="author-avatar">
                    {ebook.author_info?.avatar ? (
                      <img src={ebook.author_info.avatar} alt={ebook.author_info.name} />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div className="author-info">
                    <h3>{ebook.author_info?.name || ebook.author}</h3>
                    <p>{ebook.author_info?.bio || 'Aucune biographie disponible.'}</p>
                  </div>
                </div>

                {ebook.author_info?.social && (
                  <div className="author-social">
                    <h4>Suivre l'auteur</h4>
                    <div className="social-links">
                      {ebook.author_info.social.linkedin && (
                        <a href={ebook.author_info.social.linkedin} target="_blank" rel="noopener noreferrer">
                          LinkedIn
                        </a>
                      )}
                      {ebook.author_info.social.twitter && (
                        <a href={ebook.author_info.social.twitter} target="_blank" rel="noopener noreferrer">
                          Twitter
                        </a>
                      )}
                      {ebook.author_info.social.website && (
                        <a href={ebook.author_info.social.website} target="_blank" rel="noopener noreferrer">
                          Site web
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <h3>Avis des lecteurs</h3>
                <div className="reviews-summary">
                  <div className="rating-overview">
                    <div className="average-rating">
                      <span className="rating-number">{ebook.rating.toFixed(1)}</span>
                      <div className="stars">
                        {renderStars(ebook.rating)}
                      </div>
                      <span className="reviews-count">{ebook.reviews} avis</span>
                    </div>
                  </div>
                </div>
                
                <div className="reviews-list">
                  <p>Les avis des lecteurs seront affichés ici.</p>
                </div>
              </div>
            )}

            {activeTab === 'affiliate' && (
              <div className="affiliate-content">
                <h3>Liens d'affiliation</h3>
                <p>Gagnez des commissions en recommandant cet ebook.</p>
                
                {ebook.affiliate_links && ebook.affiliate_links.length > 0 && (
                  <div className="affiliate-platforms">
                    <h4>Plateformes disponibles</h4>
                    <div className="platforms-list">
                      {ebook.affiliate_links.map((link, index) => (
                        <div key={index} className="platform-item">
                          <div className="platform-info">
                            <strong>{link.platform}</strong>
                            <span>Commission: {link.commission}%</span>
                            <span>Prix: {formatPrice(link.price)}</span>
                          </div>
                          <div className="platform-actions">
                            <button 
                              onClick={() => handleCreateAffiliateLink(link.platform)}
                              className="btn btn-primary"
                            >
                              Créer un lien
                            </button>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                              <ExternalLink size={16} />
                              Voir sur {link.platform}
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {affiliateLinks.length > 0 && (
                  <div className="my-affiliate-links">
                    <h4>Mes liens d'affiliation</h4>
                    <div className="links-list">
                      {affiliateLinks.map((link, index) => (
                        <div key={index} className="link-item">
                          <div className="link-info">
                            <span className="link-url">{link.short_url}</span>
                            <span className="link-platform">{link.program_id}</span>
                          </div>
                          <button onClick={() => copyToClipboard(link.url)} className="btn btn-outline">
                            <Copy size={16} />
                            Copier
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="related-ebooks">
          <h3>Ebooks similaires</h3>
          <p>Découvrez d'autres ebooks qui pourraient vous intéresser.</p>
        </div>
      </div>

      <style jsx>{`
        .ebook-detail-page {
          min-height: 100vh;
          background: var(--color-background);
          padding: 2rem 0;
        }

        .breadcrumb {
          margin-bottom: 2rem;
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
          transition: color 0.3s ease;
        }

        .back-button:hover {
          color: var(--color-primary);
        }

        .ebook-header {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: var(--shadow-card);
        }

        .ebook-cover-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .main-cover {
          position: relative;
          aspect-ratio: 3/4;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--shadow-card);
        }

        .main-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .discount-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--color-error);
          color: white;
          padding: 0.5rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .preview-cover {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .preview-cover:hover {
          transform: scale(1.02);
        }

        .preview-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .preview-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-cover:hover .preview-overlay {
          opacity: 1;
        }

        .ebook-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .ebook-category {
          color: var(--color-primary);
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ebook-title {
          margin: 0;
          color: var(--color-text);
          font-size: 2rem;
          line-height: 1.2;
        }

        .ebook-author {
          margin: 0;
          color: var(--color-text-secondary);
          font-size: 1.1rem;
        }

        .ebook-rating {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stars {
          display: flex;
          gap: 0.25rem;
        }

        .stars svg.filled {
          color: var(--color-warning);
          fill: currentColor;
        }

        .stars svg.empty {
          color: var(--color-border);
        }

        .rating-text {
          color: var(--color-text-secondary);
        }

        .ebook-price {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1rem 0;
        }

        .original-price {
          text-decoration: line-through;
          color: var(--color-text-secondary);
          font-size: 1.1rem;
        }

        .current-price {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .discount-text {
          color: var(--color-success);
          font-weight: 500;
        }

        .ebook-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .ebook-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          padding: 0.5rem 1rem;
          background: var(--color-primary-light);
          color: var(--color-primary);
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          margin: 2rem 0 1rem 0;
        }

        .secondary-actions {
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: 1px solid var(--color-border);
          background: white;
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .ebook-content {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
          margin-bottom: 3rem;
        }

        .content-tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border);
        }

        .content-tabs button {
          padding: 1rem 2rem;
          border: none;
          background: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .content-tabs button:hover,
        .content-tabs button.active {
          color: var(--color-primary);
          border-bottom-color: var(--color-primary);
        }

        .tab-content {
          padding: 2rem;
        }

        .tab-content h3 {
          margin: 0 0 1.5rem 0;
          color: var(--color-text);
        }

        .tab-content h4 {
          margin: 2rem 0 1rem 0;
          color: var(--color-text);
        }

        .tab-content p {
          line-height: 1.6;
          color: var(--color-text-secondary);
          margin-bottom: 1rem;
        }

        .technical-details {
          margin-top: 2rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .detail {
          padding: 1rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .detail strong {
          color: var(--color-text);
        }

        .table-of-contents {
          padding-left: 2rem;
        }

        .table-of-contents li {
          margin-bottom: 0.5rem;
          color: var(--color-text-secondary);
          line-height: 1.5;
        }

        .author-header {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .author-avatar {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          overflow: hidden;
          background: var(--color-background);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .author-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .author-info h3 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .author-info p {
          margin: 0;
          line-height: 1.6;
        }

        .author-social h4 {
          margin: 0 0 1rem 0;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          padding: 0.5rem 1rem;
          background: var(--color-primary-light);
          color: var(--color-primary);
          text-decoration: none;
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: var(--color-primary);
          color: white;
        }

        .reviews-summary {
          margin-bottom: 2rem;
        }

        .rating-overview {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .average-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-number {
          font-size: 2rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .reviews-count {
          color: var(--color-text-secondary);
        }

        .affiliate-platforms {
          margin-bottom: 2rem;
        }

        .platforms-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .platform-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .platform-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .platform-info strong {
          color: var(--color-text);
        }

        .platform-info span {
          color: var(--color-text-secondary);
          font-size: 0.9rem;
        }

        .platform-actions {
          display: flex;
          gap: 1rem;
        }

        .my-affiliate-links {
          margin-top: 2rem;
        }

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .link-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: var(--color-background);
          border-radius: 8px;
        }

        .link-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .link-url {
          font-weight: 500;
          color: var(--color-text);
        }

        .link-platform {
          color: var(--color-text-secondary);
          font-size: 0.8rem;
        }

        .related-ebooks {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: var(--shadow-card);
        }

        .related-ebooks h3 {
          margin: 0 0 0.5rem 0;
          color: var(--color-text);
        }

        .related-ebooks p {
          margin: 0;
          color: var(--color-text-secondary);
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .btn-primary {
          background: var(--color-primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--color-primary-dark);
        }

        .btn-secondary {
          background: var(--color-secondary);
          color: white;
        }

        .btn-secondary:hover {
          background: var(--color-secondary-dark);
        }

        .btn-outline {
          background: none;
          border: 1px solid var(--color-border);
          color: var(--color-text);
        }

        .btn-outline:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .loading-state,
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          text-align: center;
          color: var(--color-text-secondary);
        }

        .loading-spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid var(--color-border);
          border-top: 3px solid var(--color-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .error-state h2 {
          margin: 1rem 0 0.5rem 0;
          color: var(--color-text);
        }

        .error-state p {
          margin: 0 0 2rem 0;
        }

        @media (max-width: 768px) {
          .ebook-header {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }
          
          .ebook-cover-section {
            align-items: center;
          }
          
          .main-cover {
            width: 200px;
          }
          
          .preview-cover {
            width: 200px;
          }
          
          .ebook-title {
            font-size: 1.5rem;
          }
          
          .current-price {
            font-size: 1.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .content-tabs {
            flex-wrap: wrap;
          }
          
          .content-tabs button {
            flex: 1;
            min-width: 120px;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .author-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .platform-item {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
          
          .platform-actions {
            justify-content: center;
          }
          
          .link-item {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default EbookDetailPage;

