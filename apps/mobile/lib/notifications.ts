import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import type { InventoryItem } from './types';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications require a physical device');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('expiration', {
      name: 'Expiration Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

export async function scheduleExpirationReminders(items: InventoryItem[]) {
  // Cancel all existing scheduled notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();

  for (const item of items) {
    if (!item.expiresAt) continue;

    const expiresAt = new Date(item.expiresAt);
    const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / 86400000);

    // Schedule reminders for items expiring in 1-3 days
    if (daysLeft > 0 && daysLeft <= 3) {
      // Remind tomorrow morning at 9am
      const triggerDate = new Date();
      triggerDate.setDate(triggerDate.getDate() + 1);
      triggerDate.setHours(9, 0, 0, 0);

      // Only schedule if trigger is in the future
      if (triggerDate > now) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: daysLeft === 1
              ? `${item.name} expires tomorrow!`
              : `${item.name} expires in ${daysLeft} days`,
            body: `Use it before it goes to waste. Check your meals tab for recipe ideas!`,
            data: { itemId: item.id, type: 'expiration' },
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
            channelId: 'expiration',
          },
        });
      }
    }

    // Schedule day-of expiration alert
    if (daysLeft === 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${item.name} expires today!`,
          body: 'Use it now or it might go to waste.',
          data: { itemId: item.id, type: 'expiration_today' },
          sound: true,
        },
        trigger: null, // Send immediately
      });
    }
  }
}

export async function getScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}
