import type { DigitalAsset } from '@/src/domains/business_case/businessCase.types';

export const WorkOrderStatus = {
  CREATED: "CREATED",
  QUEUED: "QUEUED",
  IN_PROGRESS: "IN_PROGRESS",
  REVIEW: "REVIEW",
  COMPLETED: "COMPLETED",
  DELIVERED: "DELIVERED",
  FAILED: "FAILED",
} as const;
export type WorkOrderStatus = typeof WorkOrderStatus[keyof typeof WorkOrderStatus];

export const WorkOrderType = {
  MESH_DIGITAL: "MESH_DIGITAL",
  MESH_PRINT: "MESH_PRINT",
  VIDEO: "VIDEO",
  IMAGE: "IMAGE",
} as const;
export type WorkOrderType = typeof WorkOrderType[keyof typeof WorkOrderType];

export const DeliveryType = {
  DIGITAL: "DIGITAL",
  PHYSICAL: "PHYSICAL",
} as const;
export type DeliveryType = typeof DeliveryType[keyof typeof DeliveryType];

export interface DeliveryAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

export interface WorkOrderDelivery {
  type: DeliveryType;
  address?: DeliveryAddress;
  trackingNumber?: string;
  trackingCompany?: string;
  deliveredAt?: number;
}

/**
 * WorkOrderDTO
 * Stripped of BaseState (version, lastUpdated) as caching is delegated to FastAPI.
 */
export interface WorkOrderDTO {
  id: string;
  businessCaseId: string;
  creationId: string;
  type: WorkOrderType;
  status: WorkOrderStatus;
  inputs: DigitalAsset[];
  outputs: DigitalAsset[];
  delivery: WorkOrderDelivery;
  assignedTo?: string;
  createdAt: number;
  updatedAt: number;
}
