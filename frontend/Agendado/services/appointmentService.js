import api from './api';

/**
 * Serviço para gerenciamento de agendamentos
 */
const AppointmentService = {
  /**
   * Busca agendamentos por data
   * @param {string} date - Data no formato YYYY-MM-DD
   * @returns {Promise} Promise com a lista de agendamentos
   */
  getByDate: async (date) => {
    try {
      const response = await api.get('/appointments', { params: { date } });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  /**
   * Cria um novo agendamento
   * @param {Object} data - Dados do agendamento
   * @returns {Promise} Promise com o agendamento criado
   */
  create: async (data) => {
    try {
      const response = await api.post('/appointments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  /**
   * Cancela um agendamento
   * @param {number} id - ID do agendamento
   * @returns {Promise} Promise vazia em caso de sucesso
   */
  cancel: async (id) => {
    try {
      await api.patch(`/appointments/${id}/cancel`);
    } catch (error) {
      console.error('Error canceling appointment:', error);
      throw error;
    }
  },

  /**
   * Busca os próximos agendamentos
   * @param {number} limit - Quantidade máxima de agendamentos
   * @returns {Promise} Promise com a lista de agendamentos
   */
  getUpcoming: async (limit = 5) => {
    try {
      const response = await api.get('/appointments/upcoming', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error);
      throw error;
    }
  },
};

export default AppointmentService;