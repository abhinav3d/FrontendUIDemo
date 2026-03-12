import type { INotificationInfrastructure } from "./notification.infrastructure";
import type { 
  NotificationDTO, 
  UserNotificationPreference, 
  NotificationPresence 
} from "./notification.types";

export class NotificationService {
  constructor(private readonly infra: INotificationInfrastructure) {}

  /**
   * Fetch current notifications, excluding muted references from the user's preferences.
   */
  public async getFilteredNotifications(userId: string): Promise<NotificationDTO[]> {
    const [notifications, prefs] = await Promise.all([
      this.infra.getNotifications(userId, 50),
      this.infra.getPreferences(userId)
    ]);

    return notifications.items.filter(n => 
      !prefs.mutedReferences.includes(n.referenceId) &&
      !prefs.disabledTypes.includes(n.type)
    );
  }

  /**
   * Handles the "Mark as Read" logic.
   */
  public async markRead(userId: string, notificationId: string): Promise<NotificationDTO> {
    return await this.infra.markAsRead(userId, notificationId);
  }

  /**
   * Utility for the UI to determine if a notification should be suppressed
   * based on the user's current "Presence" (what page they are on).
   */
  public shouldSuppress(notification: NotificationDTO, presence: NotificationPresence): boolean {
    return (
      notification.referenceType === presence.activeReferenceType &&
      notification.referenceId === presence.activeReferenceId
    );
  }

  public async updateSettings(userId: string, settings: Partial<UserNotificationPreference>) {
    return await this.infra.updatePreferences(userId, settings);
  }
}
