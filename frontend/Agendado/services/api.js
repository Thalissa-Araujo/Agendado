import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../constants/config';

/**
 * Configuração base da API Axios
 * - Define URL base
 * - Adiciona token de autenticação aos headers
 * - Trata erros globais
 */
const api = axios.create({
  baseURL: 'http://SEU_IP_AQUI/api',
  timeout: 10000,
});

// Interceptor para adicionar token antes das requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@Auth:token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expirado - redireciona para login
    }
    return Promise.reject(error);
  }
);

export default api;