import { type BaseState } from '@/src/core/base.types';

/**
 * NotificationPriority
 * Controls visual emphasis and future delivery channel escalation.
 */
export const NotificationPriority = {
  INFO: "INFO",
  IMPORTANT: "IMPORTANT",
  CRITICAL: "CRITICAL",
} as const;

export type NotificationPriority = typeof NotificationPriority[keyof typeof NotificationPriority];

/**
 * NotificationType
 * Structured types for UI filtering and system-wide analytics.
 */
export const NotificationType = {
  CREATION_COMPLETED: "CREATION_COMPLETED",
  CREATION_FAILED: "CREATION_FAILED",
  COIN_PURCHASED: "COIN_PURCHASED",
  COIN_GRANTED: "COIN_GRANTED",
  WORKORDER_STARTED: "WORKORDER_STARTED",
  WORKORDER_COMPLETED: "WORKORDER_COMPLETED",
  DELIVERY_SHIPPED: "DELIVERY_SHIPPED",
  NEW_MESSAGE: "NEW_MESSAGE",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

/**
 * NotificationDTO
 * The authoritative wire format for a single system alert.
 */
export interface NotificationDTO extends BaseState {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  url: string; // Deep link for navigation 
  
  // Reference Linking 
  referenceType: string; // e.g., 'WORK_ORDER', 'BUSINESS_CASE'
  referenceId: string;
  
  // Aggregation & Deduplication
  aggregationKey?: string; // e.g., 'NEW_MESSAGE:BC-102'
  aggregationCount: number;
  eventId: string; // Idempotency key to prevent duplicates
  
  // Priority & State
  priority: NotificationPriority;
  isRead: boolean;
  readAt?: number;
  expiresAt?: number; // IRRELEVANT after this time
  
  // Actor & Metadata
  actorName?: string;
  actorRole?: string;
  sourceDomain: string;
  
  // Timestamps
  createdAt: number;
  updatedAt: number;
}

/**
 * NotificationSnapshot
 * Disk-ready format for Dexie persistence.
 */
export interface NotificationSnapshot extends NotificationDTO {}

/**
 * NotificationPresence
 * Tracks user activity to suppress specific alerts (e.g., active chat).
 */
export interface NotificationPresence {
  activeReferenceType?: string;
  activeReferenceId?: string;
  lastSeenAt: number;
}

/**
 * NotificationPreference
 * User-controlled delivery settings.
 */
export interface UserNotificationPreference {
  userId: string;
  mutedReferences: string[]; // List of referenceIds (e.g., muted BC-102)
  disabledTypes: NotificationType[];
  deliveryChannels: ("in-app" | "email" | "push" | "sms")[];
}
