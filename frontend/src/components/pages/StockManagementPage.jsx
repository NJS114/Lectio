import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const StockManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // État pour les livres en stock
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "L'Étranger",
      author: "Albert Camus",
      isbn: "9782070360024",
      category: "Roman",
      stock: 15,
      price: 8.50,
      cost: 5.20,
      status: "active",
      lastRestocked: "2024-01-15"
    },
    {
      id: 2,
      title: "1984",
      author: "George Orwell",
      isbn: "9782070368228",
      category: "Science-Fiction",
      stock: 3,
      price: 9.20,
      cost: 6.10,
      status: "low_stock",
      lastRestocked: "2024-01-10"
    },
    {
      id: 3,
      title: "Le Petit Prince",
      author: "Antoine de Saint-Exupéry",
      isbn: "9782070408504",
      category: "Jeunesse",
      stock: 22,
      price: 7.90,
      cost: 4.80,
      status: "active",
      lastRestocked: "2024-01-20"
    },
    {
      id: 4,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "9782226257017",
      category: "Essai",
      stock: 0,
      price: 22.90,
      cost: 15.20,
      status: "out_of_stock",
      lastRestocked: "2023-12-15"
    }
  ]);

  // État pour le formulaire d'ajout/modification
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Roman',
    stock: '',
    price: '',
    cost: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fonction pour ajouter ou modifier un livre
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.stock || !formData.price) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const bookData = {
      ...formData,
      stock: parseInt(formData.stock),
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost) || 0,
      status: parseInt(formData.stock) === 0 ? 'out_of_stock' : 
              parseInt(formData.stock) < 5 ? 'low_stock' : 'active',
      lastRestocked: new Date().toISOString().split('T')[0]
    };

    if (editingId) {
      setBooks(books.map(book => 
        book.id === editingId ? { ...book, ...bookData } : book
      ));
      setEditingId(null);
    } else {
      const newBook = {
        id: Math.max(...books.map(b => b.id)) + 1,
        ...bookData
      };
      setBooks([...books, newBook]);
    }

    setFormData({
      title: '',
      author: '',
      isbn: '',
      category: 'Roman',
      stock: '',
      price: '',
      cost: ''
    });
  };

  // Fonction pour éditer un livre
  const handleEdit = (book) => {
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      stock: book.stock.toString(),
      price: book.price.toString(),
      cost: book.cost.toString()
    });
    setEditingId(book.id);
  };

  // Fonction pour supprimer un livre
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      setBooks(books.filter(book => book.id !== id));
    }
  };

  // Fonction pour réapprovisionner
  const handleRestock = (id, quantity) => {
    const newQuantity = prompt('Quantité à ajouter:', '10');
    if (newQuantity && !isNaN(newQuantity)) {
      setBooks(books.map(book => 
        book.id === id 
          ? { 
              ...book, 
              stock: book.stock + parseInt(newQuantity),
              status: (book.stock + parseInt(newQuantity)) < 5 ? 'low_stock' : 'active',
              lastRestocked: new Date().toISOString().split('T')[0]
            }
          : book
      ));
    }
  };

  // Filtrage des livres
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Statistiques
  const stats = {
    total: books.length,
    lowStock: books.filter(b => b.status === 'low_stock').length,
    outOfStock: books.filter(b => b.status === 'out_of_stock').length,
    totalValue: books.reduce((sum, b) => sum + (b.stock * b.cost), 0)
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#047857';
      case 'low_stock': return '#f59e0b';
      case 'out_of_stock': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'En stock';
      case 'low_stock': return 'Stock faible';
      case 'out_of_stock': return 'Rupture';
      default: return 'Inconnu';
    }
  };

  return (
    <div style={{ 
      padding: '2rem', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#ffffff',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', color: 'white' }}>
              Gestion du Stock
            </h1>
            <p style={{ margin: 0, opacity: 0.9, color: 'white' }}>
              Gérez votre inventaire et approvisionnements - {user?.display_name || 'Libraire'}
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard-pro')}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Retour Dashboard
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Total Livres</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {stats.total}
          </p>
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #fef3c7',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>Stock Faible</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
            {stats.lowStock}
          </p>
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #fecaca',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b' }}>Ruptures</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#dc2626' }}>
            {stats.outOfStock}
          </p>
        </div>
        
        <div style={{ 
          background: '#ffffff', 
          padding: '1.5rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#065f46' }}>Valeur Stock</h3>
          <p style={{ margin: '0', fontSize: '2rem', fontWeight: 'bold', color: '#047857' }}>
            {stats.totalValue.toFixed(0)}€
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        {/* Formulaire d'ajout/modification */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5',
          height: 'fit-content'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#065f46' }}>
            {editingId ? 'Modifier le Livre' : 'Ajouter un Livre'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Titre du livre *"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px'
              }}
              required
            />
            
            <input
              type="text"
              placeholder="Auteur *"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px'
              }}
              required
            />
            
            <input
              type="text"
              placeholder="ISBN"
              value={formData.isbn}
              onChange={(e) => setFormData({...formData, isbn: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px'
              }}
            />
            
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px'
              }}
            >
              <option value="Roman">Roman</option>
              <option value="Essai">Essai</option>
              <option value="Science-Fiction">Science-Fiction</option>
              <option value="Jeunesse">Jeunesse</option>
              <option value="Autre">Autre</option>
            </select>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="number"
                placeholder="Stock *"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1fae5',
                  borderRadius: '6px'
                }}
                required
              />
              
              <input
                type="number"
                step="0.01"
                placeholder="Prix vente *"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #d1fae5',
                  borderRadius: '6px'
                }}
                required
              />
            </div>
            
            <input
              type="number"
              step="0.01"
              placeholder="Prix d'achat"
              value={formData.cost}
              onChange={(e) => setFormData({...formData, cost: e.target.value})}
              style={{
                width: '100%',
                padding: '0.75rem',
                marginBottom: '1.5rem',
                border: '1px solid #d1fae5',
                borderRadius: '6px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  background: '#047857',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      title: '',
                      author: '',
                      isbn: '',
                      category: 'Roman',
                      stock: '',
                      price: '',
                      cost: ''
                    });
                  }}
                  style={{
                    background: '#6b7280',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Liste des livres */}
        <div style={{ 
          background: '#ffffff', 
          padding: '2rem', 
          borderRadius: '12px', 
          border: '2px solid #d1fae5'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ margin: 0, color: '#065f46' }}>Inventaire</h2>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1fae5',
                  borderRadius: '6px',
                  width: '200px'
                }}
              />
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1fae5',
                  borderRadius: '6px'
                }}
              >
                <option value="all">Tous</option>
                <option value="active">En stock</option>
                <option value="low_stock">Stock faible</option>
                <option value="out_of_stock">Rupture</option>
              </select>
            </div>
          </div>
          
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {filteredBooks.map(book => (
              <div key={book.id} style={{
                padding: '1rem',
                border: '1px solid #d1fae5',
                borderRadius: '8px',
                marginBottom: '0.5rem',
                background: book.status === 'out_of_stock' ? '#fef2f2' : 
                           book.status === 'low_stock' ? '#fffbeb' : '#f0fdf4'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0', color: '#065f46' }}>
                      {book.title}
                    </h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
                      {book.author} • {book.category}
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                      <span style={{ color: getStatusColor(book.status), fontWeight: 'bold' }}>
                        {getStatusText(book.status)} ({book.stock})
                      </span>
                      <span style={{ color: '#047857' }}>
                        Prix: {book.price}€
                      </span>
                      {book.cost > 0 && (
                        <span style={{ color: '#6b7280' }}>
                          Coût: {book.cost}€
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleRestock(book.id)}
                      style={{
                        background: '#10b981',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Réappro
                    </button>
                    <button
                      onClick={() => handleEdit(book)}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredBooks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
              Aucun livre trouvé
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockManagementPage;

