import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  user: { name: string; email: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    if (token) {
      // Placeholder for decoding JWT or fetching user profile
      setUser({
        name: 'Admin User',
        email: 'admin@eduapp.com',
        role: 'admin',
      });
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      const mockToken = 'mock_jwt_token_' + Math.random().toString(36).substring(7);
      localStorage.setItem('admin_token', mockToken);
      setToken(mockToken);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
