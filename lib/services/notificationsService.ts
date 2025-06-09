import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DatabasePlantType } from '@/interfaces/interfaces';
import { calculateDaysLate } from './dateService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permissions
export async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return token;
}

// Schedule watering reminder
export async function scheduleWateringReminder(plant: DatabasePlantType) {
  if (!plant.nextWateringDate) return;

  const nextWatering = new Date(plant.nextWateringDate);
  const identifier = `watering-${plant.plantId}`;

  // Cancel any existing notification for this plant
  await Notifications.cancelScheduledNotificationAsync(identifier);

  // Schedule notification for the next watering date
  await Notifications.scheduleNotificationAsync({
    identifier,
    content: {
      title: "Time to water your plant!",
      body: `${plant.nickname} needs watering today!`,
      data: { plantId: plant.plantId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: nextWatering,
    },
  });
}

// Check for missed waterings
export async function checkMissedWaterings(plants: DatabasePlantType[]) {
  const missedPlants = plants.filter(plant => {
    if (!plant.lastWatered || !plant.wateringFrequency) return false;
    const daysLate = calculateDaysLate(new Date(plant.lastWatered), plant.wateringFrequency);
    return daysLate > 0;
  });

  if (missedPlants.length > 0) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Missed Watering!",
        body: `You have ${missedPlants.length} ${
          missedPlants.length === 1 ? 'plant' : 'plants'
        } that missed their watering schedule!`,
        data: { missedPlants: missedPlants.map(p => p.plantId) },
      },
      trigger: null, // Send immediately
    });
  }
}

// Add this test function
export async function testNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Test Notification",
      body: "This is a test notification!",
      data: { test: true },
    },
    trigger: null, // null trigger means send immediately
  });
}


export async function testScheduledNotification() {
  const testDate = new Date();
  testDate.setMinutes(testDate.getMinutes() + 1); // Schedule for 1 minute from now
  
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Scheduled Test Notification",
      body: "This notification was scheduled for 1 minute later",
      data: { test: true },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: testDate,
    },
  });
}