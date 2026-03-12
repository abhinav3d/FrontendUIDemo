import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api";

export interface ShopifyOrderTokenDTO {
  id: string;
  token: string;
  updatedAt: number;
}

export class ShopifyOrderInfrastructure extends BaseInfrastructureApi<ShopifyOrderTokenDTO> {
  constructor(basePath: string = "/api/v1/shopify-orders") {
    super("ShopifyOrder", basePath);
  }

  public async fetchAdminToken(): Promise<string | null> {
    try {
      const result = await this.read("admin_token");
      return result ? result.token : null;
    } catch (error) {
      return null;
    }
  }

  public async saveAdminToken(token: string): Promise<void> {
    await this.create({
      id: "admin_token",
      token,
      updatedAt: Date.now()
    });
  }
}
