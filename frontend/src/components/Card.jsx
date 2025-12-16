import React from 'react';

const Card = ({ children, className = '' }) => {
  const baseClasses = 'bg-white rounded-lg shadow-md';

  return (
    <div className={`${baseClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
