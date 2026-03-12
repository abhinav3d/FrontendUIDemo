import { ShopifyPricingService } from "./shopify_pricing.service";
import { ShopifyPricingInfrastructure } from "./shopify_pricing.infrastructure";
import { MockShopifyPricingInfrastructure } from "./shopify_pricing.mock.infrastructure";

export class ShopifyPricingDomainFactory {
  private static instance: ShopifyPricingService;

  /**
   * Returns the singleton instance of the ShopifyPricingService.
   * * @param fastApiBaseUrl The URL for the central cache (FastAPI)
   * @param storefrontUrl The Shopify GraphQL endpoint
   * @param storefrontAccessToken The Shopify public access token
   * @param useMock If true, injects the local memory database for the L2 cache
   */
  public static getInstance(
    fastApiBaseUrl: string,
    storefrontUrl: string,
    storefrontAccessToken: string,
    useMock: boolean = false
  ): ShopifyPricingService {
    if (!this.instance) {
      // 🔌 1. Build the Data Layer (Only talks to FastAPI or Local DB)
      const infrastructure = useMock 
        ? new MockShopifyPricingInfrastructure() 
        : new ShopifyPricingInfrastructure(fastApiBaseUrl);
        
      // 🧠 2. Build the Business Layer (Handles Cache Logic + Shopify Fallback)
      this.instance = new ShopifyPricingService(
        infrastructure,
        storefrontUrl,
        storefrontAccessToken
      );
    }
    
    return this.instance;
  }

  /**
   * Internal helper for testing or resetting environment state.
   */
  public static reset(): void {
    // @ts-ignore
    this.instance = undefined;
  }
}
