import React, { useState } from 'react';
import { X, Search, Filter, MoreVertical, Mail, Phone, MapPin, Calendar, Shield, Ban, CheckCircle } from 'lucide-react';

const UserManagementModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  if (!isOpen) return null;

  const users = [
    {
      id: 1,
      name: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      phone: '06 12 34 56 78',
      city: 'Paris',
      joinDate: '2023-01-15',
      status: 'active',
      type: 'individual',
      booksCount: 23,
      salesCount: 45,
      rating: 4.8,
      lastActivity: '2024-08-15'
    },
    {
      id: 2,
      name: 'Librairie Mollat',
      email: 'contact@mollat.com',
      phone: '05 56 44 26 05',
      city: 'Bordeaux',
      joinDate: '2022-06-01',
      status: 'verified',
      type: 'bookshop',
      booksCount: 156,
      salesCount: 234,
      rating: 4.9,
      lastActivity: '2024-08-16'
    },
    {
      id: 3,
      name: 'Pierre Martin',
      email: 'p.martin@gmail.com',
      phone: '06 98 76 54 32',
      city: 'Lyon',
      joinDate: '2023-08-20',
      status: 'suspended',
      type: 'individual',
      booksCount: 8,
      salesCount: 12,
      rating: 3.2,
      lastActivity: '2024-07-28'
    },
    {
      id: 4,
      name: 'Sophie Laurent',
      email: 'sophie.laurent@outlook.fr',
      phone: '06 11 22 33 44',
      city: 'Marseille',
      joinDate: '2024-02-10',
      status: 'pending',
      type: 'individual',
      booksCount: 0,
      salesCount: 0,
      rating: null,
      lastActivity: '2024-08-10'
    }
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    const badges = {
      active: { color: 'green', text: 'Actif' },
      verified: { color: 'blue', text: 'Vérifié' },
      suspended: { color: 'red', text: 'Suspendu' },
      pending: { color: 'orange', text: 'En attente' }
    };
    const badge = badges[status];
    return (
      <span className={`status-badge status-badge--${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const handleUserAction = (userId, action) => {
    console.log(`Action ${action} sur utilisateur ${userId}`);
    // Ici on simulerait l'action
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content modal-content--large">
        <div className="modal-header">
          <h2>👥 Gestion des Utilisateurs</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Filtres et recherche */}
          <div className="filters-section">
            <div className="search-box">
              <Search size={16} />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-select">
              <Filter size={16} />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tous les statuts</option>
                <option value="active">Actifs</option>
                <option value="verified">Vérifiés</option>
                <option value="suspended">Suspendus</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="users-table">
            <div className="table-header">
              <div>Utilisateur</div>
              <div>Contact</div>
              <div>Statut</div>
              <div>Activité</div>
              <div>Actions</div>
            </div>
            
            {filteredUsers.map(user => (
              <div key={user.id} className="table-row">
                <div className="user-info">
                  <div className="user-avatar">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-type">
                      {user.type === 'bookshop' ? '🏪 Libraire' : '👤 Particulier'}
                    </div>
                  </div>
                </div>

                <div className="contact-info">
                  <div className="contact-item">
                    <Mail size={14} />
                    {user.email}
                  </div>
                  <div className="contact-item">
                    <MapPin size={14} />
                    {user.city}
                  </div>
                </div>

                <div className="status-info">
                  {getStatusBadge(user.status)}
                  {user.rating && (
                    <div className="rating">⭐ {user.rating}</div>
                  )}
                </div>

                <div className="activity-info">
                  <div>{user.booksCount} livres</div>
                  <div>{user.salesCount} ventes</div>
                  <div className="last-activity">
                    Vu le {new Date(user.lastActivity).toLocaleDateString('fr-FR')}
                  </div>
                </div>

                <div className="actions">
                  <div className="dropdown">
                    <button className="dropdown-trigger">
                      <MoreVertical size={16} />
                    </button>
                    <div className="dropdown-menu">
                      <button onClick={() => handleUserAction(user.id, 'view')}>
                        👁️ Voir le profil
                      </button>
                      <button onClick={() => handleUserAction(user.id, 'message')}>
                        💬 Envoyer un message
                      </button>
                      {user.status === 'active' && (
                        <button onClick={() => handleUserAction(user.id, 'suspend')}>
                          <Ban size={14} />
                          Suspendre
                        </button>
                      )}
                      {user.status === 'suspended' && (
                        <button onClick={() => handleUserAction(user.id, 'activate')}>
                          <CheckCircle size={14} />
                          Réactiver
                        </button>
                      )}
                      {user.status === 'pending' && user.type === 'bookshop' && (
                        <button onClick={() => handleUserAction(user.id, 'verify')}>
                          <Shield size={14} />
                          Vérifier
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="empty-state">
              <Search size={48} />
              <h3>Aucun utilisateur trouvé</h3>
              <p>Essayez de modifier vos critères de recherche</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="users-count">
            {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''} affiché{filteredUsers.length > 1 ? 's' : ''}
          </div>
          <button className="btn btn--secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>

      <style jsx>{`
        .filters-section {
          display: flex;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-md);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-gray-warm-medium);
        }

        .search-box input {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-sm) var(--spacing-sm) 40px;
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          font-size: 14px;
        }

        .filter-select {
          position: relative;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .filter-select select {
          padding: var(--spacing-sm) var(--spacing-md);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          font-size: 14px;
          background: var(--color-white);
        }

        .users-table {
          background: var(--color-white);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1.5fr 80px;
          background: var(--color-gray-warm-lightest);
          padding: var(--spacing-md);
          font-weight: 600;
          color: var(--color-gray-warm-dark);
          border-bottom: 1px solid var(--color-gray-warm-light);
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 2fr 1fr 1.5fr 80px;
          padding: var(--spacing-md);
          border-bottom: 1px solid var(--color-gray-warm-light);
          align-items: center;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: var(--color-gray-warm-lightest);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-green-primary);
          color: var(--color-white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
        }

        .user-name {
          font-weight: 600;
          color: var(--color-gray-warm-dark);
        }

        .user-type {
          font-size: 12px;
          color: var(--color-gray-warm-medium);
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--color-gray-warm-medium);
        }

        .status-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: var(--radius-sm);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          width: fit-content;
        }

        .status-badge--green {
          background: rgba(34, 197, 94, 0.1);
          color: var(--color-green-primary);
        }

        .status-badge--blue {
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
        }

        .status-badge--red {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .status-badge--orange {
          background: rgba(249, 115, 22, 0.1);
          color: #f97316;
        }

        .rating {
          font-size: 12px;
          color: var(--color-gray-warm-medium);
        }

        .activity-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          font-size: 12px;
        }

        .last-activity {
          color: var(--color-gray-warm-medium);
        }

        .actions {
          position: relative;
        }

        .dropdown {
          position: relative;
        }

        .dropdown-trigger {
          padding: 6px;
          border: none;
          background: none;
          border-radius: var(--radius-sm);
          cursor: pointer;
          color: var(--color-gray-warm-medium);
        }

        .dropdown-trigger:hover {
          background: var(--color-gray-warm-light);
        }

        .dropdown-menu {
          position: absolute;
          right: 0;
          top: 100%;
          background: var(--color-white);
          border: 1px solid var(--color-gray-warm-light);
          border-radius: var(--radius-md);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          z-index: 10;
          min-width: 160px;
          display: none;
        }

        .dropdown:hover .dropdown-menu {
          display: block;
        }

        .dropdown-menu button {
          width: 100%;
          padding: var(--spacing-sm) var(--spacing-md);
          border: none;
          background: none;
          text-align: left;
          cursor: pointer;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
        }

        .dropdown-menu button:hover {
          background: var(--color-gray-warm-lightest);
        }

        .empty-state {
          text-align: center;
          padding: var(--spacing-xl);
          color: var(--color-gray-warm-medium);
        }

        .empty-state h3 {
          margin: var(--spacing-md) 0 var(--spacing-sm);
          color: var(--color-gray-warm-dark);
        }

        .users-count {
          font-size: 14px;
          color: var(--color-gray-warm-medium);
        }
      `}</style>
    </div>
  );
};

export default UserManagementModal;

