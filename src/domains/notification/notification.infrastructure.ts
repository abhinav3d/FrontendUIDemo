import { BaseInfrastructureApi, type PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { NotificationDTO, UserNotificationPreference } from "./notification.types";

export interface INotificationInfrastructure {
  getNotifications(userId: string, limit: number, cursor?: string): Promise<PaginatedResult<NotificationDTO>>;
  markAsRead(userId: string, notificationId: string): Promise<NotificationDTO>;
  markAllAsRead(userId: string): Promise<void>;
  getPreferences(userId: string): Promise<UserNotificationPreference>;
  updatePreferences(userId: string, prefs: Partial<UserNotificationPreference>): Promise<UserNotificationPreference>;
}

export class NotificationInfrastructure 
  extends BaseInfrastructureApi<NotificationDTO & { id: string }> 
  implements INotificationInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Domain: Notification, BasePath: /api/v1/notifications
    super("Notification", `${fastApiBaseUrl}/api/v1/notifications`);
  }

  public async getNotifications(userId: string, limit: number = 20, cursor?: string): Promise<PaginatedResult<NotificationDTO>> {
    const query = new URLSearchParams({ limit: limit.toString() });
    if (cursor) query.append("cursor", cursor);
    
    return await this.fetchJson<PaginatedResult<NotificationDTO>>(
      `${this.basePath}/user/${userId}?${query.toString()}`
    );
  }

  public async markAsRead(userId: string, notificationId: string): Promise<NotificationDTO> {
    return await this.fetchJson<NotificationDTO>(`${this.basePath}/${notificationId}/read`, {
      method: 'PATCH',
      body: JSON.stringify({ readAt: Date.now() })
    });
  }

  public async markAllAsRead(userId: string): Promise<void> {
    await this.fetchJson(`${this.basePath}/user/${userId}/read-all`, { method: 'POST' });
  }

  public async getPreferences(userId: string): Promise<UserNotificationPreference> {
    return await this.fetchJson<UserNotificationPreference>(`${this.basePath}/preferences/${userId}`);
  }

  public async updatePreferences(userId: string, prefs: Partial<UserNotificationPreference>): Promise<UserNotificationPreference> {
    return await this.fetchJson<UserNotificationPreference>(`${this.basePath}/preferences/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(prefs)
    });
  }
}
