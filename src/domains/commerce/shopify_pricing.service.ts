import type { IShopifyPricingInfrastructure } from "./shopify_pricing.infrastructure";
import type { ProductDTO } from "./shopify_pricing.types";

export class ShopifyPricingService {
  constructor(
    private readonly infra: IShopifyPricingInfrastructure,
    private readonly storefrontUrl: string,
    private readonly storefrontToken: string
  ) {}

  public async getProductPricing(productId: string): Promise<ProductDTO | null> {
    // 1. Check Centralized Cache (FastAPI) via Infrastructure
    console.log(`[PricingService] 🔍 Checking FastAPI Cache for: ${productId}`);
    const cachedProduct = await this.infra.getCachedProduct(productId);
    
    if (cachedProduct) {
      console.log(`[PricingService] 🟢 Cache HIT: ${productId}`);
      return cachedProduct;
    }

    // 2. Cache MISS: Service takes over and fetches from Shopify directly
    console.log(`[PricingService] 🔴 Cache MISS. Fetching from Shopify Storefront: ${productId}`);
    const freshProduct = await this.fetchFromShopify(productId);

    if (freshProduct) {
      console.log(`[PricingService] 💾 Saving fresh Shopify data back to FastAPI cache...`);
      // 3. Delegate the save operation back to the Infrastructure
      this.infra.saveToFastApiCache(productId, freshProduct).catch(e => 
        console.error("[PricingService] Failed to save to Central Cache:", e)
      );
    }

    return freshProduct;
  }

  // ==================================================================
  // 🛒 External API Logic (Owned by the Service)
  // ==================================================================

  private async fetchFromShopify(productId: string): Promise<ProductDTO | null> {
    const query = `
      query getProductPricing($id: ID!) {
        product(id: $id) {
          id
          title
          options { name optionValues { name hasVariants } }
          variants(first: 50) {
            edges {
              node {
                id title selectedOptions { name value }
                price { amount currencyCode }
                compareAtPrice { amount currencyCode }
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(this.storefrontUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": this.storefrontToken,
        },
        body: JSON.stringify({ query, variables: { id: productId } }),
      });

      if (!response.ok) {
        throw new Error(`[ShopifyPricing] Storefront API Error: ${response.statusText}`);
      }

      const { data } = (await response.json()) as { data?: { product?: any } };
      if (!data?.product) return null;

      return this.mapShopifyResponseToDTO(data.product);
    } catch (error) {
      console.error("[ShopifyPricing] Fetch failed:", error);
      return null;
    }
  }

  private mapShopifyResponseToDTO(rawProduct: any): ProductDTO {
    const variants = rawProduct.variants.edges.map(({ node }: any) => ({
      id: node.id,
      title: node.title,
      selectedOptions: node.selectedOptions,
      price: {
        amount: parseFloat(node.price.amount),
        currencyCode: node.price.currencyCode,
        formatted: `${node.price.currencyCode} ${node.price.amount}`
      },
      compareAtPrice: node.compareAtPrice ? {
        amount: parseFloat(node.compareAtPrice.amount),
        currencyCode: node.compareAtPrice.currencyCode,
        formatted: `${node.compareAtPrice.currencyCode} ${node.compareAtPrice.amount}`
      } : null
    }));

    return {
      id: rawProduct.id,
      title: rawProduct.title,
      options: rawProduct.options,
      variants,
      lastFetchedAt: Date.now()
    };
  }
}
