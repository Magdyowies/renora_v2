import React from 'react';

const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  icon: Icon,
}) => {
  const baseClasses =
    'w-full px-4 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-light focus:border-primary transition-shadow text-sm text-gray-900 placeholder-neutral-400';

  return (
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${baseClasses} ${Icon ? 'pl-10' : ''} ${className}`}
      />
    </div>
  );
};

export default Input;
