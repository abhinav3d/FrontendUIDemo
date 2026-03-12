import { type UserCoreDTO, isUserCoreDTO } from "./user.types";

/**
 * IdentityDTO
 * The unified authoritative DTO for an authenticated session context.
 */
export interface IdentityDTO {
  user: UserCoreDTO;
  linkedInteractionId: string | null; // 👈 Moved here to represent session state
}

/**
 * Type Guard for IdentityDTO
 */
export function isIdentityDTO(value: unknown): value is IdentityDTO {
  if (typeof value !== "object" || value === null) return false;
  
  const obj = value as Record<string, unknown>;
  
  return (
    isUserCoreDTO(obj.user) &&
    (typeof obj.linkedInteractionId === "string" || obj.linkedInteractionId === null)
  );
}


export interface ShopifySignupPayload {
  shopifyCustomerId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  interactionId?: string | null; 
}
