import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#f8f9fa', 
          border: '1px solid #dee2e6', 
          borderRadius: '8px',
          margin: '20px',
          fontFamily: 'Arial, sans-serif'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '15px' }}>
            🚨 Erreur de Rendu Détectée
          </h2>
          <details style={{ marginBottom: '15px' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
              Détails de l'erreur
            </summary>
            <div style={{ 
              background: '#f1f3f4', 
              padding: '10px', 
              borderRadius: '4px',
              marginTop: '10px',
              fontSize: '14px',
              fontFamily: 'monospace'
            }}>
              <strong>Erreur:</strong>
              <pre>{this.state.error && this.state.error.toString()}</pre>
              <strong>Stack trace:</strong>
              <pre>{this.state.errorInfo.componentStack}</pre>
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

