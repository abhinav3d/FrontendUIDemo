import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { NotificationDTO, UserNotificationPreference } from "./notification.types";
import type { INotificationInfrastructure } from "./notification.infrastructure";

export class MockNotificationInfrastructure implements INotificationInfrastructure {
  private notifications: Map<string, NotificationDTO[]> = new Map();
  private preferences: Map<string, UserNotificationPreference> = new Map();

  public async getNotifications(userId: string, limit: number = 20, cursor?: string): Promise<PaginatedResult<NotificationDTO>> {
    const userNotifs = this.notifications.get(userId) || [];
    return {
      items: userNotifs.slice(0, limit),
      hasNext: userNotifs.length > limit
    };
  }

  public async markAsRead(userId: string, notificationId: string): Promise<NotificationDTO> {
    const userNotifs = this.notifications.get(userId) || [];
    const notif = userNotifs.find(n => n.id === notificationId);
    if (!notif) throw new Error("Notification not found");
    
    notif.isRead = true;
    notif.readAt = Date.now();
    return notif;
  }

  public async markAllAsRead(userId: string): Promise<void> {
    const userNotifs = this.notifications.get(userId) || [];
    userNotifs.forEach(n => {
      n.isRead = true;
      n.readAt = Date.now();
    });
  }

  public async getPreferences(userId: string): Promise<UserNotificationPreference> {
    if (!this.preferences.has(userId)) {
      this.preferences.set(userId, {
        userId,
        mutedReferences: [],
        disabledTypes: [],
        deliveryChannels: ["in-app"]
      });
    }
    return this.preferences.get(userId)!;
  }

  public async updatePreferences(userId: string, prefs: Partial<UserNotificationPreference>): Promise<UserNotificationPreference> {
    const existing = await this.getPreferences(userId);
    const updated = { ...existing, ...prefs };
    this.preferences.set(userId, updated);
    return updated;
  }
}
