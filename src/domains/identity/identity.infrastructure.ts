import type { UserCoreDTO } from "./user.types";
import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api"; 
import type { InteractionDTO, InteractionResponse } from "./interaction.types";
import type { ShopifySignupPayload } from "./identity.types";


export interface IIdentityInfrastructure {
  getUserByShopifyId(shopifyCustomerId: string): Promise<UserCoreDTO | null>;
  createOrGetUserByShopifyId(payload: ShopifySignupPayload): Promise<UserCoreDTO>;
  getUserByUserId(userId: string): Promise<UserCoreDTO | null>;
  createInteractionRecord(dto: InteractionDTO): Promise<InteractionResponse>;
  getAllUsers(limit: number, cursor?: string): Promise<PaginatedResult<UserCoreDTO>>;
}

// 🚀 Satisfy the { id: string } constraint with an intersection type
export class IdentityInfrastructure extends BaseInfrastructureApi<UserCoreDTO & { id: string }> implements IIdentityInfrastructure {
  
  constructor(fastApiBaseUrl: string) {
    // Initialize the base class with the domain name and the root path for Identity
    super("Identity", `${fastApiBaseUrl}/api/v1/identity`); 
  }

  // 1. Light Route: Check if user exists via Shopify ID
  public async getUserByShopifyId(shopifyCustomerId: string): Promise<UserCoreDTO | null> {
    try {
      // Use the protected fetchJson from your base class
      return await this.fetchJson<UserCoreDTO>(
        `${this.basePath}/shopify/${encodeURIComponent(shopifyCustomerId)}`
      );
    } catch (error) {
      // Match the 404 handling logic from your base class's `read` method
      if (error instanceof Error && error.message.includes('404')) return null;
      throw error;
    }
  }

  // 2. Heavy Route: Upsert user and link anonymous session
  public async createOrGetUserByShopifyId(payload: ShopifySignupPayload): Promise<UserCoreDTO> {
    return await this.fetchJson<UserCoreDTO>(`${this.basePath}/shopify/upsert`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  // 3. Track Anonymous Session
  public async createInteractionRecord(dto: InteractionDTO): Promise<InteractionResponse> {
    return await this.fetchJson<InteractionResponse>(`${this.basePath}/interactions`, {
      method: 'POST',
      body: JSON.stringify(dto)
    });
  }

  // 4. Standard Lookups
  public async getUserByUserId(userId: string): Promise<UserCoreDTO | null> {
    try {
      return await this.fetchJson<UserCoreDTO>(`${this.basePath}/users/${userId}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      throw error;
    }
  }

  // 5. Admin / Dashboard Lookups
  public async getAllUsers(limit: number = 50, cursor?: string): Promise<PaginatedResult<UserCoreDTO>> {
    const query = new URLSearchParams({ limit: limit.toString() });
    if (cursor) query.append("cursor", cursor);

    return await this.fetchJson<PaginatedResult<UserCoreDTO>>(`${this.basePath}/users?${query.toString()}`);
  }
}
