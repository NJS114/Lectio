import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, FileText, User, Calendar } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const EbookModerationSystem = () => {
  const { user } = useAuth();
  const [moderationQueue, setModerationQueue] = useState([]);
  const [moderationStats, setModerationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    totalSubmissions: 0
  });

  // Configuration de limitation des ebooks
  const EBOOK_LIMITS = {
    FREE_USER: {
      maxEbooksPerMonth: 2,
      maxEbooksTotal: 10,
      requiresApproval: true
    },
    PREMIUM_USER: {
      maxEbooksPerMonth: 5,
      maxEbooksTotal: 50,
      requiresApproval: true
    },
    VERIFIED_PUBLISHER: {
      maxEbooksPerMonth: 20,
      maxEbooksTotal: 200,
      requiresApproval: false // Auto-approval pour les éditeurs vérifiés
    },
    ADMIN: {
      maxEbooksPerMonth: Infinity,
      maxEbooksTotal: Infinity,
      requiresApproval: false
    }
  };

  // Critères de modération automatique
  const MODERATION_CRITERIA = {
    AUTO_REJECT: [
      'contenu inapproprié',
      'violation copyright',
      'spam',
      'contenu illégal'
    ],
    AUTO_APPROVE: [
      'éditeur vérifié',
      'auteur reconnu',
      'contenu éducatif'
    ],
    MANUAL_REVIEW: [
      'nouveau utilisateur',
      'contenu sensible',
      'prix inhabituel',
      'format non standard'
    ]
  };

  useEffect(() => {
    // Simuler le chargement des données de modération
    loadModerationData();
  }, []);

  const loadModerationData = () => {
    // Simulation des données de modération
    const mockQueue = [
      {
        id: 'ebook-001',
        title: 'Guide Complet Python 2024',
        author: 'Jean Dupont',
        submittedBy: 'user123',
        submittedAt: new Date('2024-01-15'),
        status: 'pending',
        category: 'Informatique',
        price: 19.99,
        format: ['PDF', 'EPUB'],
        fileSize: '15.2 MB',
        flags: ['nouveau utilisateur'],
        priority: 'normal'
      },
      {
        id: 'ebook-002',
        title: 'Marketing Digital Avancé',
        author: 'Marie Martin',
        submittedBy: 'publisher456',
        submittedAt: new Date('2024-01-14'),
        status: 'approved',
        category: 'Business',
        price: 24.99,
        format: ['PDF'],
        fileSize: '8.7 MB',
        flags: ['éditeur vérifié'],
        priority: 'low',
        approvedAt: new Date('2024-01-14'),
        approvedBy: 'admin'
      },
      {
        id: 'ebook-003',
        title: 'Contenu Suspect',
        author: 'Auteur Inconnu',
        submittedBy: 'spammer789',
        submittedAt: new Date('2024-01-13'),
        status: 'rejected',
        category: 'Autre',
        price: 99.99,
        format: ['PDF'],
        fileSize: '1.2 MB',
        flags: ['prix inhabituel', 'contenu suspect'],
        priority: 'high',
        rejectedAt: new Date('2024-01-13'),
        rejectedBy: 'admin',
        rejectionReason: 'Contenu inapproprié et prix abusif'
      }
    ];

    setModerationQueue(mockQueue);
    
    // Calculer les statistiques
    const stats = mockQueue.reduce((acc, ebook) => {
      acc.totalSubmissions++;
      acc[ebook.status]++;
      return acc;
    }, { pending: 0, approved: 0, rejected: 0, totalSubmissions: 0 });
    
    setModerationStats(stats);
  };

  const getUserLimits = (userType) => {
    return EBOOK_LIMITS[userType] || EBOOK_LIMITS.FREE_USER;
  };

  const checkUserEbookLimits = (userId, userType) => {
    const limits = getUserLimits(userType);
    
    // Simuler la vérification des limites
    const userEbooks = moderationQueue.filter(ebook => ebook.submittedBy === userId);
    const thisMonthEbooks = userEbooks.filter(ebook => {
      const submissionDate = new Date(ebook.submittedAt);
      const now = new Date();
      return submissionDate.getMonth() === now.getMonth() && 
             submissionDate.getFullYear() === now.getFullYear();
    });

    return {
      canSubmit: thisMonthEbooks.length < limits.maxEbooksPerMonth && 
                 userEbooks.length < limits.maxEbooksTotal,
      monthlyUsed: thisMonthEbooks.length,
      monthlyLimit: limits.maxEbooksPerMonth,
      totalUsed: userEbooks.length,
      totalLimit: limits.maxEbooksTotal,
      requiresApproval: limits.requiresApproval
    };
  };

  const moderateEbook = (ebookId, action, reason = '') => {
    setModerationQueue(prev => prev.map(ebook => {
      if (ebook.id === ebookId) {
        const now = new Date();
        const updates = {
          status: action,
          [`${action}At`]: now,
          [`${action}By`]: user.id
        };
        
        if (action === 'rejected' && reason) {
          updates.rejectionReason = reason;
        }
        
        return { ...ebook, ...updates };
      }
      return ebook;
    }));

    // Mettre à jour les statistiques
    setModerationStats(prev => ({
      ...prev,
      pending: prev.pending + (action === 'pending' ? 1 : -1),
      [action]: prev[action] + 1
    }));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#e74c3c';
      case 'normal': return '#f39c12';
      case 'low': return '#27ae60';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} color="#f39c12" />;
      case 'approved': return <CheckCircle size={16} color="#27ae60" />;
      case 'rejected': return <XCircle size={16} color="#e74c3c" />;
      default: return <AlertTriangle size={16} color="#6c757d" />;
    }
  };

  const EbookCard = ({ ebook }) => (
    <div className="ebook-card">
      <div className="ebook-header">
        <div className="ebook-info">
          <h3>{ebook.title}</h3>
          <p>par {ebook.author}</p>
          <div className="ebook-meta">
            <span className="category">{ebook.category}</span>
            <span className="price">{ebook.price}€</span>
            <span className="size">{ebook.fileSize}</span>
          </div>
        </div>
        <div className="ebook-status">
          {getStatusIcon(ebook.status)}
          <span className={`status-text ${ebook.status}`}>
            {ebook.status === 'pending' ? 'En attente' :
             ebook.status === 'approved' ? 'Approuvé' : 'Rejeté'}
          </span>
        </div>
      </div>

      <div className="ebook-details">
        <div className="detail-row">
          <User size={14} />
          <span>Soumis par: {ebook.submittedBy}</span>
        </div>
        <div className="detail-row">
          <Calendar size={14} />
          <span>Le: {ebook.submittedAt.toLocaleDateString()}</span>
        </div>
        <div className="detail-row">
          <FileText size={14} />
          <span>Formats: {ebook.format.join(', ')}</span>
        </div>
      </div>

      {ebook.flags && ebook.flags.length > 0 && (
        <div className="ebook-flags">
          <strong>Signalements:</strong>
          {ebook.flags.map(flag => (
            <span key={flag} className="flag">{flag}</span>
          ))}
        </div>
      )}

      {ebook.status === 'pending' && user && (user.role === 'admin' || user.role === 'moderator') && (
        <div className="moderation-actions">
          <button 
            onClick={() => moderateEbook(ebook.id, 'approved')}
            className="approve-btn"
          >
            <CheckCircle size={16} />
            Approuver
          </button>
          <button 
            onClick={() => {
              const reason = prompt('Raison du rejet:');
              if (reason) moderateEbook(ebook.id, 'rejected', reason);
            }}
            className="reject-btn"
          >
            <XCircle size={16} />
            Rejeter
          </button>
        </div>
      )}

      {ebook.status === 'rejected' && ebook.rejectionReason && (
        <div className="rejection-reason">
          <strong>Raison du rejet:</strong> {ebook.rejectionReason}
        </div>
      )}

      <style jsx>{`
        .ebook-card {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 15px;
          border-left: 4px solid ${getPriorityColor(ebook.priority)};
        }

        .ebook-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .ebook-info h3 {
          margin: 0 0 5px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .ebook-info p {
          margin: 0 0 10px 0;
          color: #6c757d;
          font-style: italic;
        }

        .ebook-meta {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .ebook-meta span {
          font-size: 0.85rem;
          padding: 3px 8px;
          border-radius: 12px;
          font-weight: 500;
        }

        .category {
          background: #e3f2fd;
          color: #1976d2;
        }

        .price {
          background: #e8f5e8;
          color: #2d5a2d;
        }

        .size {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .ebook-status {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-text {
          font-weight: 600;
          font-size: 0.9rem;
        }

        .status-text.pending { color: #f39c12; }
        .status-text.approved { color: #27ae60; }
        .status-text.rejected { color: #e74c3c; }

        .ebook-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }

        .detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .ebook-flags {
          margin-bottom: 15px;
          font-size: 0.9rem;
        }

        .ebook-flags strong {
          color: #e74c3c;
          margin-right: 10px;
        }

        .flag {
          display: inline-block;
          background: #fff3cd;
          color: #856404;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
          margin-right: 5px;
          margin-top: 5px;
        }

        .moderation-actions {
          display: flex;
          gap: 10px;
        }

        .approve-btn, .reject-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .approve-btn {
          background: #d4edda;
          color: #155724;
        }

        .approve-btn:hover {
          background: #c3e6cb;
        }

        .reject-btn {
          background: #f8d7da;
          color: #721c24;
        }

        .reject-btn:hover {
          background: #f5c6cb;
        }

        .rejection-reason {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 6px;
          font-size: 0.9rem;
          margin-top: 10px;
        }

        @media (max-width: 768px) {
          .ebook-header {
            flex-direction: column;
            gap: 15px;
          }

          .ebook-meta {
            flex-direction: column;
            gap: 8px;
          }

          .moderation-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );

  if (!user || (user.role !== 'admin' && user.role !== 'moderator')) {
    return (
      <div className="access-denied">
        <Shield size={48} />
        <h2>Accès restreint</h2>
        <p>Vous n'avez pas les permissions nécessaires pour accéder au système de modération.</p>
      </div>
    );
  }

  return (
    <div className="moderation-system">
      <div className="system-header">
        <div className="header-content">
          <Shield size={24} />
          <div>
            <h1>Système de Modération Ebooks</h1>
            <p>Gestion et contrôle qualité des soumissions d'ebooks</p>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card pending">
          <Clock size={20} />
          <div>
            <h3>{moderationStats.pending}</h3>
            <p>En attente</p>
          </div>
        </div>
        <div className="stat-card approved">
          <CheckCircle size={20} />
          <div>
            <h3>{moderationStats.approved}</h3>
            <p>Approuvés</p>
          </div>
        </div>
        <div className="stat-card rejected">
          <XCircle size={20} />
          <div>
            <h3>{moderationStats.rejected}</h3>
            <p>Rejetés</p>
          </div>
        </div>
        <div className="stat-card total">
          <FileText size={20} />
          <div>
            <h3>{moderationStats.totalSubmissions}</h3>
            <p>Total soumissions</p>
          </div>
        </div>
      </div>

      {/* Limites utilisateur */}
      <div className="limits-info">
        <h2>Limites par Type d'Utilisateur</h2>
        <div className="limits-grid">
          {Object.entries(EBOOK_LIMITS).map(([userType, limits]) => (
            <div key={userType} className="limit-card">
              <h3>{userType.replace('_', ' ')}</h3>
              <div className="limit-details">
                <div>Par mois: {limits.maxEbooksPerMonth === Infinity ? '∞' : limits.maxEbooksPerMonth}</div>
                <div>Total: {limits.maxEbooksTotal === Infinity ? '∞' : limits.maxEbooksTotal}</div>
                <div>Approbation: {limits.requiresApproval ? 'Requise' : 'Automatique'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* File de modération */}
      <div className="moderation-queue">
        <h2>File de Modération</h2>
        <div className="queue-filters">
          <button className="filter-btn active">Tous</button>
          <button className="filter-btn">En attente</button>
          <button className="filter-btn">Approuvés</button>
          <button className="filter-btn">Rejetés</button>
        </div>
        
        <div className="queue-list">
          {moderationQueue.map(ebook => (
            <EbookCard key={ebook.id} ebook={ebook} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .moderation-system {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .access-denied {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .access-denied h2 {
          margin: 20px 0 10px;
          color: #495057;
        }

        .system-header {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .header-content h1 {
          margin: 0 0 5px 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .header-content p {
          margin: 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 10px;
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stat-card.pending { border-left: 4px solid #f39c12; }
        .stat-card.approved { border-left: 4px solid #27ae60; }
        .stat-card.rejected { border-left: 4px solid #e74c3c; }
        .stat-card.total { border-left: 4px solid #3498db; }

        .stat-card h3 {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-card p {
          margin: 0;
          color: #6c757d;
          font-weight: 500;
        }

        .limits-info {
          background: white;
          border-radius: 10px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .limits-info h2 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .limits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .limit-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
        }

        .limit-card h3 {
          margin: 0 0 10px 0;
          font-size: 1rem;
          font-weight: 600;
          color: #495057;
          text-transform: capitalize;
        }

        .limit-details {
          display: flex;
          flex-direction: column;
          gap: 5px;
          font-size: 0.9rem;
          color: #6c757d;
        }

        .moderation-queue {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .moderation-queue h2 {
          margin: 0 0 20px 0;
          font-size: 1.4rem;
          font-weight: 600;
          color: #2c3e50;
        }

        .queue-filters {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid #dee2e6;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 500;
          color: #495057;
          transition: all 0.3s ease;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .queue-list {
          max-height: 600px;
          overflow-y: auto;
        }

        @media (max-width: 768px) {
          .moderation-system {
            padding: 10px;
          }

          .system-header {
            padding: 20px;
          }

          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .limits-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default EbookModerationSystem;

