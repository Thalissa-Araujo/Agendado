/**
 * Configurações globais da aplicação
 * 
 * Observações importantes:
 * 1. Use EXPO_PUBLIC_ para variáveis acessíveis no cliente
 * 2. Variáveis sem EXPO_PUBLIC_ só funcionam em processos Node (servidor)
 * 3. Sempre forneça valores padrão para evitar erros
 */

export default {
  // URL base da API (backend)
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://SEU_IP_AQUI:5000/api',
  
  GOOGLE_API_KEY: process.env.EXPO_PUBLIC_GOOGLE_API_KEY || 'AIzaSyBtpbF_Pk-WKLw45cidiYYDFCC_Ekt-Vf0',

  // Configurações de notificação
  NOTIFICATION: {
    CHANNEL_ID: 'agendado-notifications',
    CHANNEL_NAME: 'Agendado Notifications',
    COLOR: '#116677' // Cor primária do app
  },

  // Configurações de timeout
  TIMEOUTS: {
    API_REQUEST: 15000, // 15 segundos
    CONNECTION: 10000   // 10 segundos
  },

  // Controle de versão
  VERSION: {
    APP: '1.0.0',
    MINIMUM_OS: '11.0' // Versão mínima do sistema operacional
  },

  // Configurações de UI
  UI: {
    DEFAULT_THEME: 'light',
    PRIMARY_COLOR: '#116677',
    SECONDARY_COLOR: '#ff7e5f'
  }
};