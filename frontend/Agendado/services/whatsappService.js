import api from './api';

/**
 * Serviço para integração com WhatsApp
 */
const WhatsAppService = {
  /**
   * Inicia a sessão do WhatsApp
   * @returns {Promise} Promise com o status da conexão
   */
  startSession: async () => {
    try {
      const response = await api.post('/whatsapp/start');
      return response.data;
    } catch (error) {
      console.error('Error starting WhatsApp session:', error);
      throw error;
    }
  },

  /**
   * Envia mensagem via WhatsApp
   * @param {string} phone - Número de telefone
   * @param {string} message - Mensagem a ser enviada
   * @returns {Promise} Promise com o status do envio
   */
  sendMessage: async (phone, message) => {
    try {
      const response = await api.post('/whatsapp/send', { phone, message });
      return response.data;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      throw error;
    }
  },

  /**
   * Verifica o status da conexão WhatsApp
   * @returns {Promise} Promise com o status da conexão
   */
  checkStatus: async () => {
    try {
      const response = await api.get('/whatsapp/status');
      return response.data;
    } catch (error) {
      console.error('Error checking WhatsApp status:', error);
      throw error;
    }
  },
};

export default WhatsAppService;