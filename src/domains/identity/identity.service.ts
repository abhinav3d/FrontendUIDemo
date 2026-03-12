import type { UserCoreDTO } from "./user.types";
import type { IdentityDTO, ShopifySignupPayload } from "./identity.types";
import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { IIdentityInfrastructure } from "./identity.infrastructure";
import type { InteractionDTO, InteractionResponse } from "./interaction.types";


export class IdentityService {
  constructor(private readonly infra: IIdentityInfrastructure) {}

  // ==================================================================
  // 🏗️ Pure Data Transformation (In-Memory)
  // Responsibility: Stitch a User and an Interaction into a Session
  // ==================================================================
  
  public buildIdentity(user: UserCoreDTO, interactionId: string | null): IdentityDTO {
    return {
      user,
      linkedInteractionId: interactionId
    };
  }

  // ==================================================================
  // 🔍 Fetch Operations (I/O)
  // Responsibility: Retrieve UserCoreDTO from the database
  // ==================================================================

  public async getUserByShopifyId(shopifyCustomerId: string): Promise<UserCoreDTO | null> {
    return await this.infra.getUserByShopifyId(shopifyCustomerId);
  }

  public async getUserByUserId(userId: string): Promise<UserCoreDTO | null> {
    return await this.infra.getUserByUserId(userId);
  }



  // ==================================================================
  // 💾 Write Operations (I/O)
  // Responsibility: Upsert UserCoreDTO to the database
  // ==================================================================

   /**
   * The heavy upsert used IMMEDIATELY after a user completes a Shopify OAuth/Login flow.
   * This permanently stitches their anonymous history to their new account.
   */
  public async processShopifyLogin(
    payload: Omit<ShopifySignupPayload, "interactionId">, 
    currentInteractionId: string | null
  ): Promise<IdentityDTO> {
    
    // We inject the interaction ID here so FastAPI can link the telemetry
    const user = await this.infra.createOrGetUserByShopifyId({
      ...payload,
      interactionId: currentInteractionId
    });

    return this.buildIdentity(user, currentInteractionId);
  }
 

   // ==================================================================
  // 3. Telemetry / Interaction Orchestration
  // ==================================================================

  /**
   * Tracks an anonymous session or heartbeat. 
   * If the payload is flagged as duplicate/stale, the service handles it here.
   */
  public async trackSessionTelemetry(dto: InteractionDTO): Promise<InteractionResponse> {
    // 💡 Business Logic: You could validate device types here before hitting the DB
    if (!dto.payload || !dto.payload.ip) {
      console.warn("[IdentityService] Missing IP in telemetry payload. Proceeding anyway.");
    }

    return await this.infra.createInteractionRecord(dto);
  }

  public async getPaginatedUsers(limit: number = 50, cursor?: string): Promise<PaginatedResult<UserCoreDTO>> {
    return await this.infra.getAllUsers(limit, cursor);
  }
}
