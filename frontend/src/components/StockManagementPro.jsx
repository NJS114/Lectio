import React, { useState, useEffect } from 'react';
import { 
  Package, Search, Filter, Upload, Download, Plus, Edit3, 
  Trash2, AlertTriangle, CheckCircle, BarChart3, Scan,
  FileText, Settings, Eye, ShoppingCart, TrendingUp
} from 'lucide-react';

const StockManagementPro = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterAndSortInventory();
  }, [inventory, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const loadInventory = () => {
    // Simulation d'un inventaire complet pour libraire
    const mockInventory = [
      {
        id: 1,
        isbn: '9782070360024',
        title: 'L\'Étranger',
        author: 'Albert Camus',
        category: 'Roman',
        publisher: 'Gallimard',
        price: 8.50,
        cost: 5.10,
        stock: 8,
        minStock: 5,
        maxStock: 20,
        status: 'active',
        condition: 'Très Bon',
        location: 'A-12-3',
        lastSold: new Date('2024-09-01'),
        salesCount: 45,
        views: 234,
        addedDate: new Date('2024-08-15'),
        supplier: 'Gallimard',
        margin: 40.0
      },
      {
        id: 2,
        isbn: '9782070413119',
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        category: 'Essai',
        publisher: 'Albin Michel',
        price: 12.00,
        cost: 7.20,
        stock: 3,
        minStock: 5,
        maxStock: 15,
        status: 'low_stock',
        condition: 'Bon',
        location: 'B-05-1',
        lastSold: new Date('2024-09-02'),
        salesCount: 67,
        views: 456,
        addedDate: new Date('2024-07-20'),
        supplier: 'Albin Michel',
        margin: 40.0
      },
      {
        id: 3,
        isbn: '9782070368228',
        title: 'Le Petit Prince',
        author: 'Antoine de Saint-Exupéry',
        category: 'Jeunesse',
        publisher: 'Gallimard',
        price: 6.90,
        cost: 4.14,
        stock: 22,
        minStock: 10,
        maxStock: 30,
        status: 'active',
        condition: 'Neuf',
        location: 'C-08-2',
        lastSold: new Date('2024-08-30'),
        salesCount: 89,
        views: 678,
        addedDate: new Date('2024-08-01'),
        supplier: 'Gallimard',
        margin: 40.0
      },
      {
        id: 4,
        isbn: '9782070368457',
        title: '1984',
        author: 'George Orwell',
        category: 'Science-Fiction',
        publisher: 'Gallimard',
        price: 9.50,
        cost: 5.70,
        stock: 0,
        minStock: 3,
        maxStock: 12,
        status: 'out_of_stock',
        condition: 'Bon',
        location: 'D-03-1',
        lastSold: new Date('2024-09-01'),
        salesCount: 34,
        views: 289,
        addedDate: new Date('2024-07-15'),
        supplier: 'Gallimard',
        margin: 40.0
      },
      {
        id: 5,
        isbn: '9782253006329',
        title: 'Les Misérables',
        author: 'Victor Hugo',
        category: 'Roman',
        publisher: 'Le Livre de Poche',
        price: 15.90,
        cost: 9.54,
        stock: 12,
        minStock: 8,
        maxStock: 20,
        status: 'active',
        condition: 'Très Bon',
        location: 'A-15-4',
        lastSold: new Date('2024-08-28'),
        salesCount: 23,
        views: 145,
        addedDate: new Date('2024-08-10'),
        supplier: 'Hachette',
        margin: 40.0
      }
    ];

    setInventory(mockInventory);
  };

  const filterAndSortInventory = () => {
    let filtered = [...inventory];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.isbn.includes(searchTerm)
      );
    }

    // Filtrage par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Filtrage par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredInventory(filtered);
  };

  const getStatusBadge = (status, stock, minStock) => {
    if (status === 'out_of_stock' || stock === 0) {
      return <span className="status-badge out-of-stock">Rupture</span>;
    }
    if (status === 'low_stock' || stock <= minStock) {
      return <span className="status-badge low-stock">Stock faible</span>;
    }
    return <span className="status-badge active">Disponible</span>;
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSelection = prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
      setShowBulkActions(false);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Action en masse: ${action} sur ${selectedItems.length} éléments`);
    // Ici on implémenterait les actions en masse
    setSelectedItems([]);
    setShowBulkActions(false);
  };

  const StockRow = ({ item }) => (
    <tr className={`stock-row ${selectedItems.includes(item.id) ? 'selected' : ''}`}>
      <td>
        <input
          type="checkbox"
          checked={selectedItems.includes(item.id)}
          onChange={() => handleSelectItem(item.id)}
        />
      </td>
      <td>
        <div className="book-info">
          <div className="book-main">
            <strong>{item.title}</strong>
            <span className="author">{item.author}</span>
          </div>
          <div className="book-meta">
            <span className="isbn">ISBN: {item.isbn}</span>
            <span className="location">📍 {item.location}</span>
          </div>
        </div>
      </td>
      <td>
        <span className="category-badge">{item.category}</span>
      </td>
      <td>
        <div className="stock-info">
          <span className={`stock-number ${item.stock <= item.minStock ? 'low' : ''}`}>
            {item.stock}
          </span>
          <span className="stock-range">Min: {item.minStock} | Max: {item.maxStock}</span>
        </div>
      </td>
      <td>{getStatusBadge(item.status, item.stock, item.minStock)}</td>
      <td>
        <div className="price-info">
          <strong>{item.price.toFixed(2)}€</strong>
          <span className="cost">Coût: {item.cost.toFixed(2)}€</span>
          <span className="margin">Marge: {item.margin.toFixed(1)}%</span>
        </div>
      </td>
      <td>
        <div className="performance">
          <span className="sales">🛒 {item.salesCount}</span>
          <span className="views">👁 {item.views}</span>
        </div>
      </td>
      <td>
        <div className="actions">
          <button className="action-btn edit" title="Modifier">
            <Edit3 size={14} />
          </button>
          <button className="action-btn view" title="Voir détails">
            <Eye size={14} />
          </button>
          <button className="action-btn delete" title="Supprimer">
            <Trash2 size={14} />
          </button>
        </div>
      </td>

      <style jsx>{`
        .stock-row {
          border-bottom: 1px solid #e9ecef;
          transition: background-color 0.2s ease;
        }

        .stock-row:hover {
          background-color: #f8f9fa;
        }

        .stock-row.selected {
          background-color: #e3f2fd;
        }

        .stock-row td {
          padding: 12px 8px;
          vertical-align: middle;
        }

        .book-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .book-main strong {
          display: block;
          font-weight: 600;
          color: #2c3e50;
          margin-bottom: 2px;
        }

        .author {
          color: #6c757d;
          font-size: 0.9rem;
        }

        .book-meta {
          display: flex;
          gap: 15px;
          font-size: 0.8rem;
          color: #95a5a6;
        }

        .category-badge {
          padding: 4px 8px;
          background: #e9ecef;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #495057;
        }

        .stock-info {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stock-number {
          font-size: 1.2rem;
          font-weight: 600;
          color: #28a745;
        }

        .stock-number.low {
          color: #dc3545;
        }

        .stock-range {
          font-size: 0.7rem;
          color: #6c757d;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.low-stock {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.out-of-stock {
          background: #f8d7da;
          color: #721c24;
        }

        .price-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .price-info strong {
          font-size: 1.1rem;
          color: #2c3e50;
        }

        .cost, .margin {
          font-size: 0.8rem;
          color: #6c757d;
        }

        .performance {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.8rem;
        }

        .actions {
          display: flex;
          gap: 5px;
        }

        .action-btn {
          padding: 6px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn.edit {
          background: #fff3cd;
          color: #856404;
        }

        .action-btn.view {
          background: #d1ecf1;
          color: #0c5460;
        }

        .action-btn.delete {
          background: #f8d7da;
          color: #721c24;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }
      `}</style>
    </tr>
  );

  return (
    <div className="stock-management">
      <div className="stock-header">
        <div className="header-content">
          <h1>Gestion de Stock</h1>
          <p>{inventory.length} références • {inventory.reduce((sum, item) => sum + item.stock, 0)} exemplaires</p>
        </div>
        
        <div className="header-actions">
          <button className="action-btn primary" onClick={() => setShowAddModal(true)}>
            <Plus size={16} />
            Ajouter
          </button>
          <button className="action-btn secondary" onClick={() => setShowImportModal(true)}>
            <Upload size={16} />
            Importer CSV
          </button>
          <button className="action-btn secondary">
            <Download size={16} />
            Exporter
          </button>
          <button className="action-btn secondary">
            <Scan size={16} />
            Scanner
          </button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="stock-stats">
        <div className="stat-card">
          <div className="stat-icon active">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{inventory.filter(item => item.status === 'active').length}</h3>
            <p>Disponibles</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{inventory.filter(item => item.stock <= item.minStock && item.stock > 0).length}</h3>
            <p>Stock faible</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon danger">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{inventory.filter(item => item.stock === 0).length}</h3>
            <p>Ruptures</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon info">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <h3>{inventory.reduce((sum, item) => sum + item.salesCount, 0)}</h3>
            <p>Ventes totales</p>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Rechercher par titre, auteur ou ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filters">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">Toutes catégories</option>
            <option value="Roman">Roman</option>
            <option value="Essai">Essai</option>
            <option value="Science-Fiction">Science-Fiction</option>
            <option value="Jeunesse">Jeunesse</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">Tous statuts</option>
            <option value="active">Disponible</option>
            <option value="low_stock">Stock faible</option>
            <option value="out_of_stock">Rupture</option>
          </select>
          
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field);
              setSortOrder(order);
            }}
          >
            <option value="title-asc">Titre A-Z</option>
            <option value="title-desc">Titre Z-A</option>
            <option value="stock-asc">Stock croissant</option>
            <option value="stock-desc">Stock décroissant</option>
            <option value="salesCount-desc">Meilleures ventes</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>
      </div>

      {/* Actions en masse */}
      {showBulkActions && (
        <div className="bulk-actions">
          <span>{selectedItems.length} élément(s) sélectionné(s)</span>
          <div className="bulk-buttons">
            <button onClick={() => handleBulkAction('edit-price')}>
              Modifier prix
            </button>
            <button onClick={() => handleBulkAction('update-stock')}>
              Mettre à jour stock
            </button>
            <button onClick={() => handleBulkAction('change-status')}>
              Changer statut
            </button>
            <button onClick={() => handleBulkAction('delete')} className="danger">
              Supprimer
            </button>
          </div>
        </div>
      )}

      {/* Tableau de stock */}
      <div className="stock-table">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Livre</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Statut</th>
              <th>Prix</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <StockRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
        
        {filteredInventory.length === 0 && (
          <div className="empty-state">
            <Package size={48} />
            <h3>Aucun livre trouvé</h3>
            <p>Essayez de modifier vos filtres ou ajoutez de nouveaux livres</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .stock-management {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .stock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .header-content h1 {
          margin: 0 0 5px 0;
          font-size: 2rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .header-content p {
          margin: 0;
          color: #6c757d;
          font-size: 1.1rem;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: #28a745;
          color: white;
        }

        .action-btn.secondary {
          background: white;
          color: #495057;
          border: 1px solid #dee2e6;
        }

        .action-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }

        .stock-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 20px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 15px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stat-icon {
          padding: 12px;
          border-radius: 50%;
        }

        .stat-icon.active {
          background: #d4edda;
          color: #155724;
        }

        .stat-icon.warning {
          background: #fff3cd;
          color: #856404;
        }

        .stat-icon.danger {
          background: #f8d7da;
          color: #721c24;
        }

        .stat-icon.info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .stat-content h3 {
          margin: 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .stat-content p {
          margin: 0;
          color: #6c757d;
          font-size: 0.9rem;
        }

        .filters-bar {
          display: flex;
          gap: 20px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          flex: 1;
          padding: 10px 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 1rem;
        }

        .filters {
          display: flex;
          gap: 10px;
        }

        .filters select {
          padding: 10px 15px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          background: white;
          cursor: pointer;
        }

        .bulk-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #e3f2fd;
          padding: 15px 20px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #2196f3;
        }

        .bulk-buttons {
          display: flex;
          gap: 10px;
        }

        .bulk-buttons button {
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .bulk-buttons button:hover {
          background: #f8f9fa;
        }

        .bulk-buttons button.danger {
          background: #dc3545;
          color: white;
        }

        .stock-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .stock-table table {
          width: 100%;
          border-collapse: collapse;
        }

        .stock-table th {
          background: #f8f9fa;
          padding: 15px 8px;
          text-align: left;
          font-weight: 600;
          color: #495057;
          border-bottom: 2px solid #dee2e6;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6c757d;
        }

        .empty-state h3 {
          margin: 20px 0 10px;
          color: #495057;
        }

        @media (max-width: 768px) {
          .stock-management {
            padding: 10px;
          }

          .stock-header {
            flex-direction: column;
            gap: 20px;
          }

          .filters-bar {
            flex-direction: column;
          }

          .filters {
            flex-direction: column;
          }

          .bulk-actions {
            flex-direction: column;
            gap: 15px;
          }

          .stock-table {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default StockManagementPro;

