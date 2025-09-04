import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import RouterSimple from './components/RouterSimple';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/design-system.css';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <RouterSimple />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

