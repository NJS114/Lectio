import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HeaderWithAuth from './HeaderWithAuth';
import HomePage from './HomePage';
import CatalogPageClean from './pages/CatalogPageClean';
import SellBookPageEcosystem from './pages/SellBookPageEcosystem';
import LibraireDashboardSimple from './pages/LibraireDashboardSimple';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ShippingPage from './pages/ShippingPage';
import TrackingPage from './pages/TrackingPage';
import InvoicesPage from './pages/InvoicesPage';
import SupportPage from './pages/SupportPage';
import EbooksPageDedicated from './pages/EbooksPageDedicated';
import LibrairesPage from './pages/LibrairesPage';
import CommunicationDashboard from './pages/CommunicationDashboard';

function RouterWorking() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeaderWithAuth />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CatalogPageClean />} />
          <Route path="/catalog" element={<CatalogPageClean />} />
          <Route path="/ebooks" element={<EbooksPageDedicated />} />
          <Route path="/libraires" element={<LibrairesPage />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/suivi" element={<TrackingPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/sell" element={<SellBookPageEcosystem />} />
          <Route path="/vendre" element={<SellBookPageEcosystem />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/dashboard" element={<LibraireDashboardSimple />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/factures" element={<InvoicesPage />} />
          <Route path="/communication" element={<CommunicationDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default RouterWorking;

