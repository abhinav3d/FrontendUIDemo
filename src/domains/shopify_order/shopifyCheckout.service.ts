import type { IShopifyAdminClient } from "./shopifyAdmin.api";

// ==================================================================
// 1. Interfaces & DTOs
// ==================================================================

export interface NegotiatedDiscountInput {
  businessCaseId: string;
  quoteId: string;
  discountPercentage: number;
  shopifyCustomerId?: string; // Optional: Locks the code to a specific buyer
  expiresAt?: Date;           // Optional: Timeboxes the offer
}

export interface NegotiatedDiscountResult {
  shopifyDiscountId: string; 
  discountCode: string;      
}

export interface WebhookParseResult {
  isValid: boolean;
  shopifyOrderGid: string;
  businessCaseId?: string;
  quoteId?: string;
  discountCodeUsed?: string;
  financialStatus: string;
  isPaid: boolean;
}

export interface OrderVerificationResult {
  hasOrder: boolean;
  shopifyOrderGid?: string;
  financialStatus?: string;
  isPaid: boolean;
}

export interface IShopifyCheckoutService {
  // STAGE 1: Creation & Handoff
  createNegotiatedDiscount(input: NegotiatedDiscountInput): Promise<NegotiatedDiscountResult>;
  generateStorefrontLink(locale: string, discountCode?: string): string;
  
  // STAGE 2: Revocation
  cancelNegotiatedDiscount(shopifyDiscountId: string): Promise<void>;
  
  // STAGE 3: Lifecycle Observers (Belt & Suspenders)
  parseCheckoutWebhook(payload: any): WebhookParseResult;
  verifyOrderForDiscount(discountCode: string): Promise<OrderVerificationResult>;
}

// ==================================================================
// 2. GraphQL Operations
// ==================================================================

const DISCOUNT_CREATE_MUTATION = `
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        id
        codeDiscount {
          ... on DiscountCodeBasic {
            codes(first: 1) {
              nodes {
                code
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const DISCOUNT_UPDATE_MUTATION = `
  mutation discountCodeBasicUpdate($id: ID!, $basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicUpdate(id: $id, basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const FIND_ORDER_BY_DISCOUNT_QUERY = `
  query FindOrderByDiscount($query: String!) {
    orders(first: 1, query: $query) {
      edges {
        node {
          id
          displayFinancialStatus
        }
      }
    }
  }
`;

// ==================================================================
// 3. Service Implementation
// ==================================================================

export class ShopifyCheckoutService implements IShopifyCheckoutService {
  constructor(
    private adminClient: IShopifyAdminClient,
    private storefrontDomain: string // e.g., "my3dselfie.com"
  ) {}

  // ==================================================================
  // STAGE 1: Creation & Handoff
  // ==================================================================

  public async createNegotiatedDiscount(input: NegotiatedDiscountInput): Promise<NegotiatedDiscountResult> {
    // 🛡️ Edge Case: Direct Order (0% Discount)
    // Bypass Shopify Admin API completely, return a dummy code.
    if (input.discountPercentage <= 0) {
      return { 
        shopifyDiscountId: "DIRECT_ORDER_NO_DISCOUNT", 
        discountCode: "DIRECT" 
      };
    }

    // Generate a clean, readable code (e.g., BC123-Q456)
    const shortCaseId = input.businessCaseId.split('-')[0].toUpperCase();
    const shortQuoteId = input.quoteId.split('-')[0].toUpperCase();
    const generatedCode = `${shortCaseId}-${shortQuoteId}`;

    const decimalDiscount = input.discountPercentage / 100;

    const basicCodeDiscount: any = {
      title: `Quote: ${input.businessCaseId}`,
      code: generatedCode,
      startsAt: new Date().toISOString(),
      usageLimit: 1, // 🛡️ Burns after one use
      appliesOncePerCustomer: true,
      customerGets: {
        value: { percentage: decimalDiscount },
        items: { all: true } // Applies to the entire checkout
      }
    };

    if (input.shopifyCustomerId) {
      basicCodeDiscount.customerSelection = { customers: { add: [input.shopifyCustomerId] } };
    } else {
      basicCodeDiscount.customerSelection = { all: true };
    }

    if (input.expiresAt) {
      basicCodeDiscount.endsAt = input.expiresAt.toISOString();
    }

    const response = await this.adminClient.graphql<any>(DISCOUNT_CREATE_MUTATION, { basicCodeDiscount });
    const { codeDiscountNode, userErrors } = response.discountCodeBasicCreate;

    if (userErrors?.length) {
      const errorMsg = userErrors.map((e: any) => `${e.field?.join('.')}: ${e.message}`).join(" | ");
      throw new Error(`[ShopifyCheckoutService] Discount creation failed: ${errorMsg}`);
    }

    if (!codeDiscountNode) {
      throw new Error("[ShopifyCheckoutService] No discount node returned.");
    }

    return {
      shopifyDiscountId: codeDiscountNode.id,
      discountCode: codeDiscountNode.codeDiscount.codes.nodes[0].code
    };
  }

  public generateStorefrontLink(locale: string, discountCode?: string): string {
    const baseUrl = `https://${this.storefrontDomain}/${locale}`;
    
    if (!discountCode || discountCode === "DIRECT") {
      return `${baseUrl}/cart`; 
    }

    return `${baseUrl}/discount/${discountCode}`;
  }

  // ==================================================================
  // STAGE 2: Revocation
  // ==================================================================

  public async cancelNegotiatedDiscount(shopifyDiscountId: string): Promise<void> {
    if (!shopifyDiscountId || shopifyDiscountId === "DIRECT_ORDER_NO_DISCOUNT") {
      return; 
    }

    // Setting endsAt to "now" kills the code immediately
    const basicCodeDiscount = { endsAt: new Date().toISOString() };
    const response = await this.adminClient.graphql<any>(DISCOUNT_UPDATE_MUTATION, { id: shopifyDiscountId, basicCodeDiscount });
    
    const { userErrors } = response.discountCodeBasicUpdate;
    if (userErrors?.length) {
      const errorMsg = userErrors.map((e: any) => `${e.field?.join('.')}: ${e.message}`).join(" | ");
      throw new Error(`[ShopifyCheckoutService] Discount cancel failed: ${errorMsg}`);
    }
  }

  // ==================================================================
  // STAGE 3: Lifecycle Observers (The Belt & Suspenders)
  // ==================================================================

  /**
   * 🛡️ THE BELT: Parses raw webhook JSON from Shopify (orders/create, orders/paid).
   */
  public parseCheckoutWebhook(payload: any): WebhookParseResult {
    if (!payload || !payload.id) {
      return { isValid: false, shopifyOrderGid: "", financialStatus: "UNKNOWN", isPaid: false };
    }

    const shopifyOrderGid = payload.admin_graphql_api_id || `gid://shopify/Order/${payload.id}`;
    const financialStatus = (payload.financial_status || "UNKNOWN").toUpperCase();
    const isPaid = financialStatus === "PAID";

    const discountCodeUsed = payload.discount_codes?.[0]?.code;

    // Extract domain IDs injected into the cart attributes during handoff
    let businessCaseId: string | undefined;
    let quoteId: string | undefined;

    if (Array.isArray(payload.note_attributes)) {
      businessCaseId = payload.note_attributes.find((attr: any) => attr.name === "businessCaseId")?.value;
      quoteId = payload.note_attributes.find((attr: any) => attr.name === "quoteId")?.value;
    }

    return {
      isValid: true,
      shopifyOrderGid,
      businessCaseId,
      quoteId,
      discountCodeUsed,
      financialStatus,
      isPaid
    };
  }

  /**
   * 🛡️ THE SUSPENDERS: Quietly queries Admin API to see if a specific code was used.
   */
  public async verifyOrderForDiscount(discountCode: string): Promise<OrderVerificationResult> {
    if (!discountCode || discountCode === "DIRECT") {
      return { hasOrder: false, isPaid: false };
    }

    const query = `discount_code:"${discountCode}"`;
    const response = await this.adminClient.graphql<any>(FIND_ORDER_BY_DISCOUNT_QUERY, { query });

    const edges = response.orders?.edges || [];
    if (edges.length === 0) {
      return { hasOrder: false, isPaid: false };
    }

    const orderNode = edges[0].node;
    const financialStatus = (orderNode.displayFinancialStatus || "UNKNOWN").toUpperCase();
    
    return {
      hasOrder: true,
      shopifyOrderGid: orderNode.id,
      financialStatus,
      isPaid: financialStatus === "PAID"
    };
  }
}
