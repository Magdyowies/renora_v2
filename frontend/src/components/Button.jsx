import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold text-center transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses = {
    primary:
      'bg-[#FF5F00] text-white hover:bg-[#D45000] focus:ring-[#FF5F00] disabled:bg-neutral-300',
    secondary:
      'bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus:ring-neutral-400 disabled:bg-neutral-100 disabled:text-neutral-400',
    ghost:
      'bg-transparent text-neutral-800 hover:bg-neutral-100 focus:ring-neutral-400 disabled:text-neutral-400',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
