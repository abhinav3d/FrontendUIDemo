import { 
  type WorkOrderDTO, 
  WorkOrderStatus, 
  type WorkOrderType, 
  type WorkOrderDelivery,
  DeliveryType
} from "./work_order.types";
import type { DigitalAsset } from "@/src/domains/business_case/businessCase.types";
import type { IWorkOrderInfrastructure } from "./work_order.infrastructure";

export interface CreateWorkOrderPayload {
  businessCaseId: string;
  creationId: string;
  type: WorkOrderType;
  inputs: DigitalAsset[];
  delivery?: WorkOrderDelivery; 
}

export class WorkOrderService {
  constructor(private readonly infra: IWorkOrderInfrastructure) {}

  // ==================================================================
  // 📥 Intake (The Missing Piece)
  // ==================================================================

  /**
   * The Intake Desk: Called immediately after Shopify confirms payment.
   * Transforms a paid Business Case into an actionable Work Order.
   */
  public async createWorkOrderFromPayment(payload: CreateWorkOrderPayload): Promise<WorkOrderDTO> {
    
    // Default to digital delivery if no physical address is provided
    const defaultDelivery: WorkOrderDelivery = {
      type: DeliveryType.DIGITAL
    };

    // Construct the pristine starting state of a Work Order
    const newOrderData = {
      businessCaseId: payload.businessCaseId,
      creationId: payload.creationId,
      type: payload.type,
      status: WorkOrderStatus.CREATED, // Always starts at CREATED
      inputs: payload.inputs,
      outputs: [], // Starts empty
      delivery: payload.delivery || defaultDelivery,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    return await this.infra.create(newOrderData);
  }

  // ==================================================================
  // 🔍 Internal / System Methods
  // ==================================================================

  public async getRawOrder(id: string): Promise<WorkOrderDTO | null> {
    return await this.infra.getWorkOrder(id);
  }

  public async advanceStatus(id: string, newStatus: WorkOrderStatus): Promise<WorkOrderDTO> {
    if (newStatus === WorkOrderStatus.COMPLETED) {
       const order = await this.infra.getWorkOrder(id);
       if (order && order.outputs.length === 0) {
         throw new Error("[WorkOrderService] Blocked: Cannot complete order without attached output files.");
       }
    }
    return await this.infra.updateStatus(id, newStatus);
  }

  // ==================================================================
  // 🎨 Customer-Facing Methods (The "Pizza Tracker")
  // ==================================================================

  public async getCustomerProgressTracker(workOrderId: string) {
    const order = await this.infra.getWorkOrder(workOrderId);
    if (!order) return null;

    const progressionPath: WorkOrderStatus[] = [
      WorkOrderStatus.CREATED,
      WorkOrderStatus.QUEUED,
      WorkOrderStatus.IN_PROGRESS,
      WorkOrderStatus.REVIEW,
      WorkOrderStatus.COMPLETED,
      WorkOrderStatus.DELIVERED
    ];

    const currentIndex = progressionPath.indexOf(order.status);

    const timeline = progressionPath.map((step, index) => ({
      stepCode: step,
      uiLabel: this.getFriendlyLabel(step),
      isCompleted: index < currentIndex,
      isCurrent: index === currentIndex,
      isWaiting: index > currentIndex,
    }));

    return {
      orderId: order.id,
      orderType: order.type,
      timeline,
      deliverables: order.status === WorkOrderStatus.DELIVERED ? order.outputs : [],
      shippingDetails: order.delivery
    };
  }

  private getFriendlyLabel(status: WorkOrderStatus): string {
    const labels: Record<WorkOrderStatus, string> = {
      CREATED: "Order Received",
      QUEUED: "In Queue",
      IN_PROGRESS: "In Production",
      REVIEW: "Quality Check",
      COMPLETED: "Packaging",
      DELIVERED: "Delivered",
      FAILED: "Action Required"
    };
    return labels[status];
  }
}
