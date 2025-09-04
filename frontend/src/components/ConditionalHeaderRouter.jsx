import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HeaderWithAuth from './HeaderWithAuth';
import HeaderCatalog from './HeaderCatalog';
import Footer from './Footer';
import HomePage from './HomePage';
import CatalogPageModern from './pages/CatalogPageModern';
import BookDetailPage from './pages/BookDetailPage';
import SellBookPageOptimized from './pages/SellBookPageOptimized';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPageFixed from './pages/DashboardPageFixed';
import CreateEbookPageFixed from './pages/CreateEbookPageFixed';
import AffiliationPage from './pages/AffiliationPage';
import PaymentTestPage from './pages/PaymentTestPage';
import LoginModalFixed from './modals/LoginModalFixed';
import CartSidebar from './CartSidebar';
import ProtectedRoute from './ProtectedRoute';

const ConditionalHeaderRouter = () => {
  const location = useLocation();
  
  // Déterminer quel header utiliser selon la route
  const isCatalogPage = location.pathname === '/catalogue';
  
  return (
    <div className="App">
      {/* Header conditionnel */}
      {isCatalogPage ? <HeaderCatalog /> : <HeaderWithAuth />}
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CatalogPageModern />} />
          <Route path="/livre/:id" element={<BookDetailPage />} />
          <Route path="/vendre" element={
            <ProtectedRoute requireAuth={true}>
              <SellBookPageOptimized />
            </ProtectedRoute>
          } />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/checkout" element={
            <ProtectedRoute requireAuth={true}>
              <CheckoutPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireAuth={true}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute requireAuth={true}>
              <DashboardPageFixed />
            </ProtectedRoute>
          } />
          <Route path="/ebooks" element={<CreateEbookPageFixed />} />
          <Route path="/creer-ebook" element={
            <ProtectedRoute requireAuth={true}>
              <CreateEbookPageFixed />
            </ProtectedRoute>
          } />
          <Route path="/creer-ebook-test" element={<CreateEbookPageFixed />} />
          <Route path="/affiliation" element={
            <ProtectedRoute requireAuth={true}>
              <AffiliationPage />
            </ProtectedRoute>
          } />
          <Route path="/test-paiement" element={<PaymentTestPage />} />
        </Routes>
      </main>
      
      <Footer />
      <LoginModalFixed />
      <CartSidebar />
    </div>
  );
};

export default ConditionalHeaderRouter;

