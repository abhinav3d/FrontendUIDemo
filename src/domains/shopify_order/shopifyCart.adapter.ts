import type { CommercialQuote, LineItem } from "@/src/domains/business_case/businessCase.types";

export class ShopifyCartAdapter {
  /**
   * Translates our Domain Quote into Shopify Cart Lines and hydrates the Hydrogen Cart.
   * Can be called from ANY route (Simulation, Email Link, Dashboard).
   */
  public static async hydrateCartForBusinessCaseQuote(
    cart: any, // The Hydrogen context.cart instance
    businessCaseId: string,
    quote: CommercialQuote
  ): Promise<{ checkoutUrl: string; targetCartUrl: string; headers: Headers }> {
    
    // ==================================================================
    // 1. 🧹 THE CLEAN SLATE PROTOCOL
    // Remove any existing retail items from the user's session cart
    // so they don't accidentally inherit negotiated B2B discounts.
    // ==================================================================
    const existingCart = await cart.get();
    
    if (existingCart && existingCart.lines?.nodes?.length > 0) {
      const lineIdsToRemove = existingCart.lines.nodes.map((line: any) => line.id);
      await cart.removeLines(lineIdsToRemove);
      console.log(`🧹 [ShopifyCartAdapter] Cleared ${lineIdsToRemove.length} existing items from the session cart.`);
    }
    
    // 1. Strictly map our Domain DTO to Shopify's Merchandise requirements
    const cartLines = quote.items.map((item: LineItem) => {
      if (!item.shopifyVariantId) {
        throw new Error(`[ShopifyCartAdapter] LineItem ${item.productId} is missing a shopifyVariantId.`);
      }

      return {
        merchandiseId: item.shopifyVariantId,
        quantity: item.quantity,
        // 🛡️ THE ANCHOR: Attach our domain IDs so the webhook can find them
        attributes: [
          { key: "abhinvabusinessCaseId", value: businessCaseId },
          { key: "quoteId", value: quote.id }
        ]
      };
    });

    // 2. Hydrate the items
    const addResult = await cart.addLines(cartLines);
    let finalCart = addResult.cart;

    // 3. Apply the Negotiated Discount (if it exists)
    if (quote.discountCode && quote.discountCode !== "DIRECT") {
      const discountResult = await cart.updateDiscountCodes([quote.discountCode]);
      finalCart = discountResult.cart;
    }

    if (!finalCart?.id || !finalCart?.checkoutUrl) {
      throw new Error("[ShopifyCartAdapter] Failed to prepare the Shopify Checkout Session.");
    }

    // 4. Generate the Headers to lock the Cart ID into the user's session cookie
    const headers = cart.setCartId(finalCart.id);
    console.log(finalCart.checkoutUrl)
    return {
      checkoutUrl: finalCart.checkoutUrl, // 👈 Direct jump to Shopify Checkout
      targetCartUrl: '/cart',             // 👈 Jump to Hydrogen Cart UI
      headers
    };
  }
}
