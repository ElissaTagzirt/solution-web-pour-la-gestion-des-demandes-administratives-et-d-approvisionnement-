import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Ajoutez isAdmin
  const [connected , setConnected]= useState(false);



  const login = (accessToken) => {
    setToken(accessToken);
    setConnected(true);
  };

  const logout = () => {
    setToken('');
    setConnected(false);
    setIsAdmin(false); // Déconnectez-vous également l'utilisateur administrateur
  };

  return (
    <AuthContext.Provider value={{ token, isAdmin,connected , login, logout ,setIsAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
