import React from 'react';
import { User, ShoppingCart, Book } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="avatar">
            <User size={48} />
          </div>
          <div className="user-info">
            <h1>{user?.firstName} {user?.lastName}</h1>
            <p>{user?.email}</p>
            <p>{user?.city}</p>
          </div>
        </div>

        <div className="profile-sections">
          <div className="section">
            <h3><ShoppingCart size={20} /> Mes Commandes</h3>
            <p>Aucune commande pour le moment</p>
          </div>

          <div className="section">
            <h3><Book size={20} /> Mes Ventes</h3>
            <p>Aucun livre en vente pour le moment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

