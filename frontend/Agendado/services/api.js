import axios from 'axios';
import { BASE_URL } from '../constants/config';

/**
 * Configuração base da API Axios
 * - Define URL base
 * - Adiciona token de autenticação aos headers
 * - Trata erros globais
 */
const api = axios.create({
  baseURL: BASE_URL,
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

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Token expirado - redireciona para login
      // Você pode adicionar sua lógica de logout aqui
    }
    return Promise.reject(error);
  }
);

export default api;