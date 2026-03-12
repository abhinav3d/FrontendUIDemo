import { WorkOrderService } from "./work_order.service";
import { WorkOrderInfrastructure } from "./work_order.infrastructure";
import { MockWorkOrderInfrastructure } from "./work_order.mock.infrastructure";

export class WorkOrderDomainFactory {
  private static instance: WorkOrderService;

  /**
   * Returns the singleton instance of the WorkOrderService.
   * * @param fastApiBaseUrl The base URL for the real API (e.g., process.env.FASTAPI_BASE_URL)
   * @param useMock If true, injects the local memory-based infrastructure
   */
  public static getInstance(
    fastApiBaseUrl: string, 
    useMock: boolean = false
  ): WorkOrderService {
    if (!this.instance) {
      // 🔌 Wire up the appropriate data source based on the environment
      const infrastructure = useMock 
        ? new MockWorkOrderInfrastructure() 
        : new WorkOrderInfrastructure(fastApiBaseUrl);
        
      // 🧠 Inject the chosen infrastructure into the Service
      this.instance = new WorkOrderService(infrastructure);
    }
    
    return this.instance;
  }

  /**
   * Internal helper for testing. Allows you to wipe the instance 
   * and force the factory to build a new one on the next call.
   */
  public static reset(): void {
    // @ts-ignore - forcefully resetting the singleton
    this.instance = undefined;
  }
}
