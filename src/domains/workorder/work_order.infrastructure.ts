import { BaseInfrastructureApi, type PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { WorkOrderDTO, WorkOrderStatus } from "./work_order.types";

/**
 * The strict contract that any Work Order database connection must follow.
 */
export interface IWorkOrderInfrastructure {
  // 📥 Intake: Create a new work order (needed for the Webhook)
  create(payload: Partial<WorkOrderDTO> | Omit<WorkOrderDTO, 'id'>): Promise<WorkOrderDTO>;
  
  // 🔍 Lookup: Fetch a specific order
  getWorkOrder(id: string): Promise<WorkOrderDTO | null>;
  
  // 🔄 Update: Change the progress status
  updateStatus(id: string, status: WorkOrderStatus): Promise<WorkOrderDTO>;
  
  // 📋 Query: Get all orders for a specific Business Case
  getWorkOrdersByBusinessCase(businessCaseId: string): Promise<WorkOrderDTO[]>;
  
  // 📊 Query: Paginated list for Admin dashboards
  listWorkOrders(limit: number, cursor?: string): Promise<PaginatedResult<WorkOrderDTO>>;
}

/**
 * WorkOrderInfrastructure
 * The production FastAPI implementation.
 */
export class WorkOrderInfrastructure 
  extends BaseInfrastructureApi<WorkOrderDTO & { id: string }> 
  implements IWorkOrderInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Registers the domain name and FastAPI endpoint for the Base Class logging/fetching
    super("WorkOrder", `${fastApiBaseUrl}/api/v1/work-orders`);
  }

  // 💡 Note: The `create()` method is automatically inherited from BaseInfrastructureApi.
  // We don't need to rewrite it here, but it is fulfilled for the IWorkOrderInfrastructure contract!

  public async getWorkOrder(id: string): Promise<WorkOrderDTO | null> {
    // We use your BaseInfrastructureApi's built-in `read()` method because 
    // it already perfectly handles 404 errors returning `null`.
    return await this.read(id);
  }

  public async updateStatus(id: string, status: WorkOrderStatus): Promise<WorkOrderDTO> {
    // We use a custom sub-route for status updates to trigger specific backend events
    return await this.fetchJson<WorkOrderDTO>(`${this.basePath}/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  public async getWorkOrdersByBusinessCase(businessCaseId: string): Promise<WorkOrderDTO[]> {
    return await this.fetchJson<WorkOrderDTO[]>(`${this.basePath}/business-case/${businessCaseId}`);
  }

  public async listWorkOrders(limit: number = 20, cursor?: string): Promise<PaginatedResult<WorkOrderDTO>> {
    const query = new URLSearchParams({ limit: limit.toString() });
    if (cursor) query.append("cursor", cursor);
    
    return await this.fetchJson<PaginatedResult<WorkOrderDTO>>(`${this.basePath}?${query.toString()}`);
  }
}
