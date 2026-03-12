import { ShopifyCheckoutService } from "./shopifyCheckout.service";
import { ShopifyAdminClient } from "./shopifyAdmin.api";
import { MockShopifyOrderInfrastructure } from "./shopifyOrder.mock.infrastructure";
import { ShopifyOrderInfrastructure } from "./shopifyOrder.infrastructure";

export class ShopifyCheckoutDomainFactory {
  private static instance: ShopifyCheckoutService | null = null;

  public static getInstance(env: any, useMocks: boolean = true): ShopifyCheckoutService {
    if (!this.instance) {
      console.log(`🏭 [ShopifyCheckoutDomainFactory] Assembling Service (Mocks: ${useMocks})`);

      // 1. Initialize the Infrastructure (The Token Vault)
      // Mocking the database layer allows local dev to test real Shopify API calls 
      // without needing the actual FastAPI backend running to store the tokens.
      const dbInfra = useMocks 
        ? (new MockShopifyOrderInfrastructure() as unknown as ShopifyOrderInfrastructure)
        : new ShopifyOrderInfrastructure(`${env.FASTAPI_BASE_URL}/api/v1/shopify-orders`);

      // 2. Initialize the Admin Client (The generic GraphQL engine)
      const shopifyAdminClient = new ShopifyAdminClient(
        env.SHOPIFY_STORE_DOMAIN,
        env.SHOPIFY_ADMIN_API_CLIENT_ID,
        env.SHOPIFY_ADMIN_API_CLIENT_SECRET,
        env.SHOPIFY_ADMIN_API_VERSION,        
        dbInfra 
      );

      // 3. Initialize the Checkout Service (The B2C Engine)
      this.instance = new ShopifyCheckoutService(
        shopifyAdminClient,
        env.PUBLIC_STOREFRONT_URL
      );
    }

    return this.instance;
  }

  public static resetInstance(): void {
    this.instance = null;
  }
}
