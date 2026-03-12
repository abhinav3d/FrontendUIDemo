import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api";
import type { ProductDTO, ProductPricingPayload } from "./shopify_pricing.types";

export interface IShopifyPricingInfrastructure {
  getCachedProduct(productId: string): Promise<ProductDTO | null>;
  saveToFastApiCache(productId: string, product: ProductDTO): Promise<void>;
}

export class ShopifyPricingInfrastructure 
  extends BaseInfrastructureApi<ProductPricingPayload> 
  implements IShopifyPricingInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    super("ShopifyPricing", `${fastApiBaseUrl}/api/v1/shopify-pricing`);
  }

  public async getCachedProduct(productId: string): Promise<ProductDTO | null> {
    try {
      return await this.fetchJson<ProductDTO>(`${this.basePath}/products/${encodeURIComponent(productId)}`);
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  }

  public async saveToFastApiCache(productId: string, product: ProductDTO): Promise<void> {
    await this.fetchJson(`${this.basePath}/products/${encodeURIComponent(productId)}`, {
      method: 'POST',
      body: JSON.stringify(product)
    });
  }
}
