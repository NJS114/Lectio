import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HeaderWithAuth from './HeaderWithAuth';
import Footer from './Footer';
import HomePage from './HomePage';
import CatalogPageClean from './pages/CatalogPageClean';
import BookDetailPage from './pages/BookDetailPage';
import SellBookPageEcosystem from './pages/SellBookPageEcosystem';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPageFixed from './pages/DashboardPageFixed';
import AdminDashboardPage from './pages/AdminDashboardPage';
import BookshopsPage from './pages/BookshopsPage';
import BookshopDetailPage from './pages/BookshopDetailPage';
import EbooksPageDedicated from './pages/EbooksPageDedicated';
import EbookDetailPage from './pages/EbookDetailPage';
import CreateEbookPage from './pages/CreateEbookPage';
import AffiliationPage from './pages/AffiliationPage';
import PaymentTestPage from './pages/PaymentTestPage';
import LibraireDashboardSimple from './pages/LibraireDashboardSimple';
import MarketingToolsPage from './pages/MarketingToolsPage';
import AnalyticsProPage from './pages/AnalyticsProPage';
import StockManagementPage from './pages/StockManagementPage';
import LibrairesPage from './pages/LibrairesPage';
import EventsPage from './pages/EventsPage';
import EventsManagementPage from './pages/EventsManagementPage';
import ShippingPage from './pages/ShippingPage';
import TrackingPage from './pages/TrackingPage';
import InvoicesPage from './pages/InvoicesPage';
import CommunicationDashboard from './pages/CommunicationDashboard';
import SupportPage from './pages/SupportPage';
import LoginModalFixed from './modals/LoginModalFixed';
import CartSidebar from './CartSidebar';
import ProtectedRoute from './ProtectedRoute';

const AppRouter = () => {
  const location = useLocation();
  
  // Déterminer si on est sur la page catalogue pour masquer le header normal
  const isCatalogPage = location.pathname === '/catalogue';
  
  return (
    <div className="App">
      {/* Header conditionnel - masqué sur la page catalogue car elle a son propre header */}
      {!isCatalogPage && <HeaderWithAuth />}
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CatalogPageClean />} />
          <Route path="/livre/:id" element={<BookDetailPage />} />
          <Route path="/vendre" element={
            <ProtectedRoute requireAuth={true}>
              <SellBookPageEcosystem />
            </ProtectedRoute>
          } />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/commande" element={<CheckoutPage />} />
          <Route path="/suivi/:orderId" element={<OrderTrackingPage />} />
          <Route path="/profil" element={
            <ProtectedRoute requireAuth={true}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requireAuth={true}>
              <DashboardPageFixed />
            </ProtectedRoute>
          } />
          <Route path="/dashboard-pro" element={
            <ProtectedRoute requireAuth={true} requireBookstore={true}>
              <LibraireDashboardSimple />
            </ProtectedRoute>
          } />
          <Route path="/stock-management" element={
            <ProtectedRoute requireAuth={true} requireBookstore={true}>
              <StockManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/marketing-tools" element={
            <ProtectedRoute requireAuth={true} requireBookstore={true}>
              <MarketingToolsPage />
            </ProtectedRoute>
          } />
          <Route path="/analytics-pro" element={
            <ProtectedRoute requireAuth={true} requireBookstore={true}>
              <AnalyticsProPage />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute requireAuth={true} requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/libraires" element={<LibrairesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events-management" element={
            <ProtectedRoute requireAuth={true} requireBookstore={true}>
              <EventsManagementPage />
            </ProtectedRoute>
          } />
          <Route path="/shipping" element={
            <ProtectedRoute requireAuth={true} requireBookstore={true}>
              <ShippingPage />
            </ProtectedRoute>
          } />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/invoices" element={
            <ProtectedRoute requireAuth={true} requireAdmin={true}>
              <InvoicesPage />
            </ProtectedRoute>
          } />
          <Route path="/communication" element={
            <ProtectedRoute requireAuth={true} requireAdmin={true}>
              <CommunicationDashboard />
            </ProtectedRoute>
          } />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/libraire/:id" element={<BookshopDetailPage />} />
          <Route path="/ebooks" element={<EbooksPageDedicated />} />
          <Route path="/ebook/:id" element={<EbookDetailPage />} />
          <Route path="/creer-ebook" element={
            <ProtectedRoute requireAuth={true}>
              <CreateEbookPage />
            </ProtectedRoute>
          } />
          <Route path="/affiliation" element={
            <ProtectedRoute requireAuth={true}>
              <AffiliationPage />
            </ProtectedRoute>
          } />
          <Route path="/test-paiement" element={<PaymentTestPage />} />
        </Routes>
      </main>

      {!isCatalogPage && <Footer />}
      
      {/* Modals et sidebars globaux */}
      <LoginModalFixed />
      <CartSidebar />
    </div>
  );
};

export default AppRouter;

