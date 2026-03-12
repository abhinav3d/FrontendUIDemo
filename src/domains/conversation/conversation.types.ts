import { type BaseState } from '@/src/core/base.types';
import type { DigitalAsset } from '@/src/domains/business_case/businessCase.types';
import type { HasVersion } from '@/src/core/baseServerCache.types';


export const ConversationReferenceType = {
  BUSINESS_CASE: "BUSINESS_CASE",
  WORK_ORDER: "WORK_ORDER",
} as const;

export type ConversationReferenceType =
  typeof ConversationReferenceType[keyof typeof ConversationReferenceType];

export const ConversationRole = {
  USER: "USER",
  SYSTEM: "SYSTEM",
  ARTIST: "ARTIST",
  SALES: "SALES",
} as const;

export type ConversationRole =
  typeof ConversationRole[keyof typeof ConversationRole];

export interface MessageAttachment {
  id: string;
  messageId: string;
  asset: DigitalAsset;
  createdAt: number;
}

/**
 * ConversationMessage
 * The authoritative wire format for a single chat entry.
 */
export interface ConversationMessage extends HasVersion {
  id: string;
  referenceId: string; // The BusinessCase ID or WorkOrder ID 
  referenceType: ConversationReferenceType;
  authorName: string;
  role: ConversationRole;
  content: string;
  attachments: MessageAttachment[];
  createdAt: number;
}

/**
 * ConversationSnapshot
 * LocalMirror state for a specific thread.
 */
export interface ConversationSnapshot extends BaseState {
  id: string; // <-- Required for BaseCollectionCache
  referenceId: string;
  messages: ConversationMessage[];
}
