import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all active:scale-95 rounded-xl disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-secondary hover:bg-yellow-300 shadow-sm",
    secondary: "bg-secondary text-white hover:bg-gray-800 shadow-md",
    outline: "border-2 border-gray-200 hover:border-gray-900 text-secondary hover:bg-gray-50",
    danger: "bg-red-500 text-white hover:bg-red-600"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};