import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { WorkOrderDTO, WorkOrderStatus } from "./work_order.types";
import type { IWorkOrderInfrastructure } from "./work_order.infrastructure";

export class MockWorkOrderInfrastructure implements IWorkOrderInfrastructure {
  private store: Map<string, WorkOrderDTO> = new Map();

  public async create(payload: Partial<WorkOrderDTO> | Omit<WorkOrderDTO, 'id'>): Promise<WorkOrderDTO> {
    const id = (payload as any).id || `wo_mock_${Date.now()}`;
    const newOrder = { ...payload, id } as WorkOrderDTO;
    this.store.set(id, newOrder);
    return newOrder;
  }

  public async getWorkOrder(id: string): Promise<WorkOrderDTO | null> {
    return this.store.get(id) || null;
  }

  public async updateStatus(id: string, status: WorkOrderStatus): Promise<WorkOrderDTO> {
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Mock 404: WorkOrder ${id} not found`);
    
    const updated = { ...existing, status, updatedAt: Date.now() };
    this.store.set(id, updated);
    return updated;
  }

  public async getWorkOrdersByBusinessCase(businessCaseId: string): Promise<WorkOrderDTO[]> {
    return Array.from(this.store.values()).filter(wo => wo.businessCaseId === businessCaseId);
  }

  public async listWorkOrders(limit: number = 20, cursor?: string): Promise<PaginatedResult<WorkOrderDTO>> {
    const items = Array.from(this.store.values()).slice(0, limit);
    return { items, hasNext: this.store.size > limit };
  }
}
