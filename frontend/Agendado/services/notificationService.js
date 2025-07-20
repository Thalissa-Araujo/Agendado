/*
import * as Notifications from 'expo-notifications';
import api from './api';

/
 * Serviço para gerenciamento de notificações push
 /
const NotificationService = {
  /
   * Configura as notificações
   /
  setup: async () => {
    // Configura o handler de notificações
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    // Solicita permissões
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permissão para notificações não concedida');
      return;
    }

    // Registra o token no backend
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    await api.post('/notifications/register', { token });
  },

  /
   * Agenda uma notificação local
   * @param {Object} options - Opções da notificação
   * @param {string} options.title - Título da notificação
   * @param {string} options.body - Corpo da notificação
   * @param {Date} options.date - Data para exibir a notificação
   /
  schedule: async ({ title, body, date }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: date,
    });
  },

  /
   * Envia uma notificação push para o dispositivo do profissional
   * @param {string} deviceToken - Token do dispositivo
   * @param {Object} notification - Dados da notificação
   /
  sendPush: async (deviceToken, notification) => {
    try {
      await api.post('/notifications/send', {
        to: deviceToken,
        title: notification.title,
        body: notification.body,
        data: notification.data,
      });
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
  },
};

export default NotificationService;
*/