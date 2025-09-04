import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import RouterFinal from './components/RouterFinal';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <RouterFinal />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

