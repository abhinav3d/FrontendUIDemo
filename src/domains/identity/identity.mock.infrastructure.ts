import { db } from "@/src/lib/backend/db/db.server"; 
import { USER_ROLE } from "@/src/domains/app/app.types";
import type { IIdentityInfrastructure} from "./identity.infrastructure";
import type { UserCoreDTO } from "./user.types";
import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { ShopifySignupPayload } from "./identity.types";
import type { InteractionDTO, InteractionResponse } from "./interaction.types";


export class MockIdentityInfrastructure implements IIdentityInfrastructure {
  // 🔒 The guaranteed local dev user ID
  private readonly FIXED_USER_ID = "2c8261b4-5ab3-4df3-b48d-e4b7305716cb";

  constructor() {
    // Seed a mock user
    this.seed();
  }

  private async seed() {
    const mockUser: UserCoreDTO = {
      userId: this.FIXED_USER_ID,
      shopifyCustomerId: "gid://shopify/Customer/123456789",
      email: "abhinav@my3dmeta.com",
      firstName: "Abhinav",
      lastName: "User",
      role: USER_ROLE.ADMIN,
      avatarUrl: "https://picsum.photos/seed/user/200/200",
    };
    await db.user.create({ data: mockUser });
  }

  // 1. Light Route (Secondary Index Lookup)
  public async getUserByShopifyId(shopifyCustomerId: string): Promise<UserCoreDTO | null> {
    console.log(`[MockIdentity] 🔍 Checking memory DB for Shopify ID: ${shopifyCustomerId}`);
    
    const allUsers = await db.user.findMany() as UserCoreDTO[];
    const user = allUsers.find(u => u.shopifyCustomerId === shopifyCustomerId);
    
    return user || null;
  }

  // 2. Heavy Route (Upsert)
  public async createOrGetUserByShopifyId(payload: ShopifySignupPayload): Promise<UserCoreDTO> {
    console.log(`[MockIdentity] 💾 Upserting user in memory DB:`, payload.email);
    
    const existing = await this.getUserByShopifyId(payload.shopifyCustomerId);
    if (existing) return existing;

    const newUser: UserCoreDTO = {
      userId: this.FIXED_USER_ID,
      shopifyCustomerId: payload.shopifyCustomerId,
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      role: USER_ROLE.CUSTOMER, // New signups default to Customer
      avatarUrl: payload.avatarUrl || null,
    };

    await db.user.create({ data: newUser });
    return newUser;
  }

  // 3. Track Anonymous Session
  public async createInteractionRecord(dto: InteractionDTO): Promise<InteractionResponse> {
    console.log(`[MockIdentity] 📡 Tracking Interaction in memory DB: ${dto.interactionId}`);
    
    const interactionId = dto.interactionId || `int_${Math.random().toString(36).substring(2, 9)}`;

    await db.interaction.create({
      data: {
        id: interactionId, 
        ...dto.payload,
        lastUpdated: Date.now()
      }
    });

    return {
      interactionId,
      version: 1,
      lastUpdated: Date.now(),
      originalInteractionId: dto.interactionId,
      isNewId: !dto.interactionId
    };
  }

  // 4. Standard Lookups (Primary Key Lookup)
  public async getUserByUserId(userId: string): Promise<UserCoreDTO | null> {
    console.log(`[MockIdentity] 🔍 Fetching memory User ID: ${userId}`);
    
    const user = await db.user.findUnique({ where: { userId } });
    return (user as UserCoreDTO) || null;
  }

  // 5. Admin / Dashboard Lookups
  public async getAllUsers(limit: number = 50, cursor?: string): Promise<PaginatedResult<UserCoreDTO>> {
    console.log(`[MockIdentity] 📋 Fetching paginated memory users...`);
    
    const users = await db.user.findMany() as UserCoreDTO[];
    return {
      items: users.slice(0, limit),
      hasNext: users.length > limit
    };
  }
}
