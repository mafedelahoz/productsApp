import * as Calendar from 'expo-calendar';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface CalendarEvent {
  title: string;
  startDate: Date;
  endDate: Date;
  notes?: string;
  location?: string;
}

class CalendarService {
  private static instance: CalendarService;
  private isInitialized = false;

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Calendar permission not granted');
      }

      // Request notification permissions
      const { status: notificationStatus } = await Notifications.requestPermissionsAsync();
      if (notificationStatus !== 'granted') {
        throw new Error('Notification permission not granted');
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize calendar service:', error);
      throw error;
    }
  }

  async addPurchaseReminder(
    productTitle: string,
    reminderDate: Date = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
  ): Promise<string> {
    try {
      await this.initialize();

      // Create calendar event
      const event: CalendarEvent = {
        title: `Purchase Reminder: ${productTitle}`,
        startDate: reminderDate,
        endDate: new Date(reminderDate.getTime() + 60 * 60 * 1000), // 1 hour duration
        notes: `Don't forget to purchase: ${productTitle}`,
        location: 'Products App',
      };

      // Get default calendar
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        throw new Error('No calendar found');
      }

      // Create the event
      const eventId = await Calendar.createEventAsync(defaultCalendar.id, event);

      // Schedule notification
      await this.scheduleNotification(productTitle, reminderDate);

      return eventId;
    } catch (error) {
      console.error('Failed to add purchase reminder:', error);
      throw error;
    }
  }

  private async scheduleNotification(productTitle: string, reminderDate: Date): Promise<void> {
    try {
      // Configure notification behavior
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        }),
      });

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Purchase Reminder',
          body: `Don't forget to purchase: ${productTitle}`,
          data: { productTitle },
        },
        trigger: {
          date: reminderDate,
        },
      });
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      // Don't throw here as the calendar event was already created
    }
  }

  async getUpcomingReminders(): Promise<CalendarEvent[]> {
    try {
      await this.initialize();

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

      if (!defaultCalendar) {
        return [];
      }

      const now = new Date();
      const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from now

      const events = await Calendar.getEventsAsync(
        [defaultCalendar.id],
        now,
        future
      );

      return events
        .filter(event => event.title?.includes('Purchase Reminder'))
        .map(event => ({
          title: event.title || '',
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
          notes: event.notes,
          location: event.location,
        }));
    } catch (error) {
      console.error('Failed to get upcoming reminders:', error);
      return [];
    }
  }

  async removeReminder(eventId: string): Promise<void> {
    try {
      await Calendar.deleteEventAsync(eventId);
    } catch (error) {
      console.error('Failed to remove reminder:', error);
      throw error;
    }
  }
}

export default CalendarService.getInstance();
