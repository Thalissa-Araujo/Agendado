const { Expo } = require('expo-server-sdk');
const expo = new Expo();

const sendNotification = async ({ to, title, body, data = {} }) => {
  if (!Expo.isExpoPushToken(to)) {
    console.error(`Push token ${to} is not a valid Expo push token`);
    return;
  }

  const message = {
    to,
    sound: 'default',
    title,
    body,
    data
  };

  try {
    const ticket = await expo.sendPushNotificationsAsync([message]);
    console.log('Notification sent:', ticket);
    return ticket;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

const setupNotifications = () => {
  console.log('Notification service initialized');
};

module.exports = { sendNotification, setupNotifications };