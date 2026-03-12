import { NotificationService } from "./notification.service";
import { NotificationInfrastructure } from "./notification.infrastructure";
import { MockNotificationInfrastructure } from "./notification.mock.infrastructure";

/**
 * NotificationDomainFactory
 * Centralized point of instantiation for the Notification Domain.
 */
export class NotificationDomainFactory {
  private static instance: NotificationService;

  /**
   * Returns a singleton instance of the NotificationService.
   * * @param fastApiBaseUrl The root URL for your FastAPI backend.
   * @param useMock If true, injects the stateful MockInfrastructure (MemoryDB).
   */
  public static getInstance(
    fastApiBaseUrl: string, 
    useMock: boolean = false
  ): NotificationService {
    if (!this.instance) {
      // 🔌 Wire up the appropriate data source
      const infrastructure = useMock 
        ? new MockNotificationInfrastructure() 
        : new NotificationInfrastructure(fastApiBaseUrl);
        
      // 🧠 Inject infrastructure into the Service
      this.instance = new NotificationService(infrastructure);
    }
    return this.instance;
  }

  /**
   * Internal reset for testing or environment switching.
   */
  public static reset(): void {
    // @ts-ignore
    this.instance = undefined;
  }
}
