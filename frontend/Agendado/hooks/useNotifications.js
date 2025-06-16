import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import api from '../services/api';

/**
 * Hook personalizado para gerenciar notificações push
 * @param {Function} handleNotification - Callback para notificações recebidas
 */
const useNotifications = (handleNotification) => {
  const notificationListener = useRef();
  const responseListener = useRef();

  // Configura as notificações ao iniciar
  useEffect(() => {
    async function setupNotifications() {
      // Solicita permissões
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // Configura o handler de notificações
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });

      // Registra o token no backend
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      await api.post('/notifications/register', { token });

      // Listeners para notificações
      notificationListener.current = Notifications.addNotificationReceivedListener(
        handleNotification
      );

      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log('Notificação clicada:', response);
        }
      );

      // Limpa os listeners ao desmontar
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }

    setupNotifications();
  }, [handleNotification]);

  /**
   * Agenda uma notificação local
   * @param {Object} options - Opções da notificação
   * @param {string} options.title - Título da notificação
   * @param {string} options.body - Corpo da notificação
   * @param {Date} options.date - Data para exibir a notificação
   */
  const scheduleNotification = async ({ title, body, date }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: 'default',
      },
      trigger: date,
    });
  };

  return { scheduleNotification };
};

export default useNotifications;