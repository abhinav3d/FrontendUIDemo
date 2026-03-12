import type { IShopifyPricingInfrastructure } from "./shopify_pricing.infrastructure";
import type { ProductDTO } from "./shopify_pricing.types";

export class MockShopifyPricingInfrastructure implements IShopifyPricingInfrastructure {
  private cache: Map<string, ProductDTO> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed with the Cyberpunk Dog product from Template Domain
    const mockProduct: ProductDTO = {
      id: "gid://shopify/Product/8934238028004",
      title: "Cyberpunk Dog Statue",
      options: [
        {
          name: "Material",
          optionValues: [
            { name: "Resin", hasVariants: true },
            { name: "Bronze", hasVariants: true }
          ]
        }
      ],
      variants: [
        {
          id: "gid://shopify/ProductVariant/479045746916",
          title: "Resin / Small",
          selectedOptions: [{ name: "Material", value: "Resin" }],
          price: {
            amount: 49.99,
            currencyCode: "USD",
            formatted: "USD 49.99"
          },
          compareAtPrice: null
        }
      ],
      lastFetchedAt: Date.now()
    };

    this.cache.set(mockProduct.id, mockProduct);
  }

  public async getCachedProduct(productId: string): Promise<ProductDTO | null> {
    console.log(`[MockPricing] 🔍 Checking memory cache for: ${productId}`);
    return this.cache.get(productId) || null;
  }

  public async saveToFastApiCache(productId: string, product: ProductDTO): Promise<void> {
    console.log(`[MockPricing] 💾 Saving to memory cache: ${productId}`);
    this.cache.set(productId, product);
  }
}
