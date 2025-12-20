import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div 
        className="spinner-border" 
        style={{ 
          width: '8rem', 
          height: '8rem', 
          borderWidth: '0.5rem',
          color: '#212529' // Bootstrap's gray-900 equivalent
        }} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;