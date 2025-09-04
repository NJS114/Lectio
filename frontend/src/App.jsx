import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { BooksProvider } from './hooks/useBooks';
import { CartProvider } from './hooks/useCart';
import { PaymentProvider } from './hooks/usePayment';
import { ShippingProvider } from './hooks/useShipping';
import { EbooksProvider } from './hooks/useEbooks';
import AppRouter from './components/RouterFixed';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/design-system.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <BooksProvider>
            <EbooksProvider>
              <CartProvider>
                <PaymentProvider>
                  <ShippingProvider>
                    <AppRouter />
                  </ShippingProvider>
                </PaymentProvider>
              </CartProvider>
            </EbooksProvider>
          </BooksProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

