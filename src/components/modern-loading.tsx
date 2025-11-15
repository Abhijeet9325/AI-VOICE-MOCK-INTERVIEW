import { useState, useEffect } from 'react';

export const ModernLoading = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 bg-gradient-to-r from-primary to-primary-600 rounded-full animate-pulse"></div>
        </div>
        <div className={`transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="text-lg font-semibold text-foreground mb-2 animate-fade-in-up">Loading Interview AI</h3>
          <p className="text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Preparing your experience...
          </p>
        </div>
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  className = '', 
  ...props 
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  className?: string;
  [key: string]: any;
}) => {
  const baseClasses = 'btn-modern relative inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus-ring hover-lift';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-600 shadow-lg hover:shadow-primary-500/25',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary-600 shadow-md',
    accent: 'bg-accent text-accent-foreground hover:bg-accent-600 shadow-md',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
      disabled={loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <span className={loading ? 'opacity-0' : ''}>
        {children}
      </span>
    </button>
  );
};

export const ModernCard = ({ 
  children, 
  className = '', 
  hover = true, 
  ...props 
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  [key: string]: any;
}) => {
  return (
    <div 
      className={`card-modern ${hover ? 'hover-lift' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const ModernInput = ({ 
  className = '', 
  error = false,
  ...props 
}: {
  className?: string;
  error?: boolean;
  [key: string]: any;
}) => {
  return (
    <input 
      className={`input-modern ${error ? 'border-destructive focus:ring-destructive' : ''} ${className}`}
      {...props}
    />
  );
};