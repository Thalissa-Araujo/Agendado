import { useState, useContext, createContext } from 'react';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria o contexto de autenticação
const AuthContext = createContext();

/**
 * Provedor de autenticação que envolve a aplicação
 * Gerencia o estado de autenticação do usuário
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Realiza o login do usuário
   * @param {String} email 
   * @param {String} password 
   * @returns {Promise} Promise com o resultado do login
   */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      
      await AsyncStorage.setItem('@Auth:token', response.data.token);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.data.professional));
      
      setUser(response.data.professional);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.error || 'Erro ao fazer login' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Realiza o logout do usuário
   */
  const logout = async () => {
    await AsyncStorage.removeItem('@Auth:token');
    await AsyncStorage.removeItem('@Auth:user');
    setUser(null);
  };

  /**
   * Verifica se o usuário está autenticado ao iniciar o app
   */
  const checkAuth = async () => {
    const token = await AsyncStorage.getItem('@Auth:token');
    const userData = await AsyncStorage.getItem('@Auth:user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para usar o contexto de autenticação
 * @returns {Object} Objeto com funções e estado de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};