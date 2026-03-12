import { type BaseState } from "@/src/core/base.types";
import { type ArtifactType } from "@/src/domains/creation/creation.types";

/* -------------------------------------------------- */
/* Business Case Action */
/* -------------------------------------------------- */

export const BusinessCaseAction = {
  INQUIRY: "INQUIRY",
  DIRECT_ORDER: "DIRECT_ORDER",
} as const;

export type BusinessCaseAction =
  typeof BusinessCaseAction[keyof typeof BusinessCaseAction];

/* -------------------------------------------------- */
/* External Order Reference */
/* -------------------------------------------------- */

export const ReferenceOrderType = {
  SHOPIFY: "SHOPIFY",
  STRIPE: "STRIPE",
  MANUAL: "MANUAL",
} as const;

export type ReferenceOrderType =
  typeof ReferenceOrderType[keyof typeof ReferenceOrderType];

/* -------------------------------------------------- */
/* Business Case Lifecycle Status (NEW) */
/* -------------------------------------------------- */

export const BusinessCaseStatus = {
  OPEN: "OPEN",
  NEGOTIATING: "NEGOTIATING",
  AWAITING_PAYMENT: "AWAITING_PAYMENT",
  PAID: "PAID",
  CANCELLED: "CANCELLED",
  CLOSED: "CLOSED",
} as const;

export type BusinessCaseStatus =
  typeof BusinessCaseStatus[keyof typeof BusinessCaseStatus];

/* -------------------------------------------------- */
/* Quote Lifecycle */
/* -------------------------------------------------- */

export const CommercialQuoteStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  ACTIVE: "ACTIVE", 
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED", 
  EXPIRED: "EXPIRED",
  CANCELLED: "CANCELLED",
} as const;

export type CommercialQuoteStatus =
  typeof CommercialQuoteStatus[keyof typeof CommercialQuoteStatus];

/* -------------------------------------------------- */
/* Digital Assets */
/* -------------------------------------------------- */

export interface DigitalAsset {
  type: ArtifactType;
  url: string;
  label: string;
}

/* -------------------------------------------------- */
/* Line Item */
/* -------------------------------------------------- */

export interface LineItem {
  productId: string;
  productTitle: string;

  quotedPrice: number;
  quotedCurrency: string;

  storePrice: number;
  storeCurrency: string;

  quantity: number;
  discountPercentage: number;

  sku?: string;

  shopifyVariantId?: string;
}

/* -------------------------------------------------- */
/* Commercial Quote */
/* -------------------------------------------------- */

export interface CommercialQuote {
  id: string;
  currency: string;
  totalPrice: number;
  items: LineItem[];
  status: CommercialQuoteStatus;

  // ==================================================================
  // 🔗 Shopify Execution Linkage
  // ==================================================================
  checkoutURL?: string;
  
  // Legacy / Edge-case (B2B)
  shopifyDraftOrderId?: string; 
  
  // The New Discount-First Architecture
  shopifyDiscountId?: string;   // The GraphQL ID used to revoke/expire the discount
  discountCode?: string;        // The actual text code (e.g., BC123-15OFF) used in the URL

  // ==================================================================
  // ⏱️ Timeboxing
  // ==================================================================
  checkoutCreatedAt?: number;
  checkoutExpiresAt?: number;

  // ==================================================================
  // 🛡️ THE PRIMARY LEVER
  // 0 = Full Price (Express Order). 100 = Free (Comped/Zero-dollar quote).
  // ==================================================================
  discountPercentage: number;
}

/* -------------------------------------------------- */
/* Business Case DTO */
/* -------------------------------------------------- */

export interface BusinessCaseDTO extends BaseState {
  id: string;

  userId: string;
  creationId: string;

  action: BusinessCaseAction;
  status: BusinessCaseStatus; 

  activeQuoteId?: string;
  acceptedQuoteId?: string; 

  inputs: DigitalAsset[];
  outputs: DigitalAsset[];

  commercials: CommercialQuote[];

  referenceOrderId?: string;
  referenceOrderType?: ReferenceOrderType;
}

/* -------------------------------------------------- */
/* Snapshot */
/* -------------------------------------------------- */

export interface BusinessCaseSnapshot extends BusinessCaseDTO {}

/* -------------------------------------------------- */
/* Payment Exception Status */
/* -------------------------------------------------- */

export const PaymentExceptionStatus = {
  OPEN: "OPEN",
  UNDER_REVIEW: "UNDER_REVIEW",
  RESOLVED_ACCEPT: "RESOLVED_ACCEPT",
  RESOLVED_REFUND: "RESOLVED_REFUND",
  RESOLVED_IGNORE: "RESOLVED_IGNORE",
} as const;

export type PaymentExceptionStatus =
  typeof PaymentExceptionStatus[keyof typeof PaymentExceptionStatus];

/* -------------------------------------------------- */
/* Payment Exception Reason */
/* -------------------------------------------------- */

export const PaymentExceptionReason = {
  STALE_QUOTE_PAYMENT: "STALE_QUOTE_PAYMENT",
  DUPLICATE_PAYMENT: "DUPLICATE_PAYMENT",
  UNKNOWN_ORDER: "UNKNOWN_ORDER",
  CHECKOUT_MISMATCH: "CHECKOUT_MISMATCH",
} as const;

export type PaymentExceptionReason =
  typeof PaymentExceptionReason[keyof typeof PaymentExceptionReason];

/* -------------------------------------------------- */
/* Payment Exception DTO */
/* -------------------------------------------------- */

export interface PaymentExceptionDTO extends BaseState {
  id: string;

  shopifyOrderGid: string;

  businessCaseId?: string;
  quoteId?: string;

  reason: PaymentExceptionReason;

  status: PaymentExceptionStatus;

  createdAt: number;
  resolvedAt?: number;

  reviewerId?: string;

  notes?: string;
}

/* -------------------------------------------------- */
/* Payment Exception Snapshot */
/* -------------------------------------------------- */

export interface PaymentExceptionSnapshot extends PaymentExceptionDTO {}
