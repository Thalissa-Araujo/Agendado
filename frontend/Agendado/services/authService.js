import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Serviço para gerenciamento de autenticação
 */
const AuthService = {
  /**
   * Realiza o login
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise} Promise com os dados do usuário e token
   */
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Armazena token e dados do usuário
      await AsyncStorage.setItem('@Auth:token', response.data.token);
      await AsyncStorage.setItem('@Auth:user', JSON.stringify(response.data.professional));
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Realiza o registro de um novo profissional
   * @param {Object} data - Dados do profissional
   * @returns {Promise} Promise com os dados do usuário e token
   */
  register: async (data) => {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Realiza o logout
   */
  logout: async () => {
    try {
      await AsyncStorage.removeItem('@Auth:token');
      await AsyncStorage.removeItem('@Auth:user');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  /**
   * Verifica se o usuário está autenticado
   * @returns {Promise} Promise com os dados do usuário ou null
   */
  checkAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('@Auth:token');
      const user = await AsyncStorage.getItem('@Auth:user');
      
      if (token && user) {
        return JSON.parse(user);
      }
      return null;
    } catch (error) {
      console.error('Auth check error:', error);
      throw error;
    }
  },
};

export default AuthService;