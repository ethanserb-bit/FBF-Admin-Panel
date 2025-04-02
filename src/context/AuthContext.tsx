import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  sessionTimeLeft: number | null;
  loginAttempts: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [sessionTimeLeft, setSessionTimeLeft] = useState<number | null>(null);
  const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

  useEffect(() => {
    if (isAuthenticated) {
      const sessionStart = parseInt(localStorage.getItem('sessionStart') || '0');
      const updateTimeLeft = () => {
        const elapsed = Date.now() - sessionStart;
        const remaining = SESSION_DURATION - elapsed;
        if (remaining <= 0) {
          logout();
        } else {
          setSessionTimeLeft(remaining);
        }
      };

      const timer = setInterval(updateTimeLeft, 1000);
      updateTimeLeft();

      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    try {
      // Check if user is locked out
      const lockoutEnd = parseInt(localStorage.getItem('lockoutEnd') || '0');
      if (Date.now() < lockoutEnd) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (email === 'admin@fboyfilter.com' && password === 'admin123') {
        setIsAuthenticated(true);
        setLoginAttempts(0);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('sessionStart', Date.now().toString());
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }
      } else {
        const attempts = loginAttempts + 1;
        setLoginAttempts(attempts);
        
        if (attempts >= MAX_LOGIN_ATTEMPTS) {
          const lockoutEnd = Date.now() + LOCKOUT_DURATION;
          localStorage.setItem('lockoutEnd', lockoutEnd.toString());
          throw new Error(`Too many failed attempts. Account locked for 15 minutes.`);
        }
        
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    const confirmed = await new Promise<boolean>((resolve) => {
      if (window.confirm('Are you sure you want to log out?')) {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    if (confirmed) {
      setIsAuthenticated(false);
      setSessionTimeLeft(null);
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('sessionStart');
      return true;
    }
    return false;
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (email === 'admin@fboyfilter.com') {
        // In a real app, this would send a password reset email
        alert('Password reset link has been sent to your email');
      } else {
        throw new Error('Email not found');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        isLoading, 
        login, 
        logout,
        resetPassword,
        sessionTimeLeft,
        loginAttempts
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (undefined === context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}