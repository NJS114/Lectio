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
import EbooksPage from './pages/EbooksPage';
import EbookDetailPage from './pages/EbookDetailPage';
import CreateEbookPage from './pages/CreateEbookPage';
import EbooksPageDedicated from './pages/EbooksPageDedicated';
import AffiliationPage from './pages/AffiliationPage';
import PaymentTestPage from './pages/PaymentTestPage';
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
          <Route path="/admin" element={
            <ProtectedRoute requireAuth={true} requireAdmin={true}>
              <AdminDashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/libraires" element={<BookshopsPage />} />
          <Route path="/libraire/:slug" element={<BookshopDetailPage />} />
          <Route path="/ebooks" element={<EbooksPageDedicated />} />
          <Route path="/ebook/:id" element={<EbookDetailPage />} />
          <Route path="/creer-ebook" element={
            <ProtectedRoute requireAuth={true}>
              <CreateEbookPage />
            </ProtectedRoute>
          } />
          <Route path="/creer-ebook-test" element={
            <ProtectedRoute requireAuth={true}>
              <CreateEbookPageFixed />
            </ProtectedRoute>
          } />
          <Route path="/affiliation" element={
            <ProtectedRoute requireAuth={true}>
              <AffiliationPage />
            </ProtectedRoute>
          } />
          <Route path="/test-paiements" element={
            <ProtectedRoute requireAuth={true}>
              <PaymentTestPage />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <LoginModalFixed />
      <CartSidebar />
    </div>
  );
};

export default AppRouter;

