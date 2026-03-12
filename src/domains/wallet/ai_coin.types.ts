export const AICoinReferenceType = {
  CREATION: "CREATION",
  CREATION_FAILED: "CREATION_FAILED",
  WELCOME_BONUS: "WELCOME_BONUS",
  SALES_GRANT: "SALES_GRANT",
  COIN_PURCHASE: "COIN_PURCHASE",
} as const;

export type AICoinReferenceType = typeof AICoinReferenceType[keyof typeof AICoinReferenceType];

export const AICoinDirection = {
  CREDIT: "CREDIT",
  DEBIT: "DEBIT",
} as const;

export type AICoinDirection = typeof AICoinDirection[keyof typeof AICoinDirection];

export interface AICoinTransaction {
  id: string;
  userId: string;
  amount: number;
  direction: AICoinDirection;
  referenceType: AICoinReferenceType;
  referenceId?: string;
  description?: string;
  createdAt: number;
}


/**
 * AddCoinsPayload
 * Structure for granting or deducting coins via the API.
 */
export interface AddCoinsPayload {
  userId: string;
  amount: number;
  direction: AICoinDirection;
  referenceType: AICoinReferenceType;
  referenceId?: string;
  description?: string;
}

/**
 * AICoinWallet
 * The derived projection stored in Dexie for blocking checks.
 */
export interface AICoinWallet  {
  userId: string;
  balance: number;
}
