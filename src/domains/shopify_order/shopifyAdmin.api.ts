import type { ShopifyOrderInfrastructure } from './shopifyOrder.infrastructure';
import type { CommercialQuote } from '@/src/domains/business_case/businessCase.types';

// ==================================================================
// 1. Interfaces & Domain Types
// ==================================================================

export interface CreateDraftOrderFromQuoteInput {
  businessCaseId: string;
  quote: CommercialQuote;
  userId: string;
  customerEmail: string;
  customerFirstName?: string;
  customerLastName?: string;
  shopifyCustomerId?: string; 
  note?: string;
  tags?: string[];
}

export interface ShopifyAdminOrder {
  id: string;
  name: string;
  number: number;
  currentTotalPriceSet: {
    shopMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  displayFinancialStatus: string;
  displayFulfillmentStatus: string;
  processedAt: string;
  tags: string[];
}

export interface DraftOrderCompleteResult {
  orderId: string;
}

export interface SimpleRefundInput {
  orderId: string;    
  lineItemId: string; 
  quantity: number;
}

export interface SimpleRefundResult {
  refundId: string;
  amount: string;
  currencyCode: string;
}

export interface IShopifyAdminClient {
  createDraftOrderFromQuote(input: CreateDraftOrderFromQuoteInput): Promise<{ shopifyDraftOrderGid: string; checkoutURL: string }>;
  cancelDraftOrder(shopifyDraftOrderGid: string): Promise<void>;
  getOrderByGid(shopifyOrderGid: string): Promise<ShopifyAdminOrder>;
  completeDraftOrder(draftOrderGid: string): Promise<DraftOrderCompleteResult>;
  closeOrder(orderGid: string): Promise<{ closedAt: string }>;
  refundSingleLineItem(input: SimpleRefundInput): Promise<SimpleRefundResult>;
  exchangeCodeForToken(shop: string, code: string): Promise<string>;
  graphql<T = any>(query: string, variables?: Record<string, any>): Promise<T>;
}

// ==================================================================
// 2. Strict GraphQL Response Types & Payload Definitions
// ==================================================================

interface GraphqlEnvelope<TData> {
  data?: TData;
  errors?: unknown;
}

type DraftOrderCreateResponse = {
  draftOrderCreate: {
    draftOrder: { 
      id: string; 
      invoiceUrl: string;
      currencyCode: string;             // 🇺🇸 Store Base (e.g., USD)
      presentmentCurrencyCode: string;  // 🇮🇳 Buyer Local (e.g., INR)
    } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

type DraftOrderCompleteResponse = {
  draftOrderComplete: {
    draftOrder: { id: string; order?: { id: string } | null } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

type OrderCloseResponse = {
  orderClose: {
    order: { id: string; closedAt: string | null } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

type RefundLineItemResponse = {
  refundCreate: {
    refund: { id: string; totalRefundedSet: { presentmentMoney: { amount: string; currencyCode: string } } } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

const DRAFT_ORDER_UPDATE_MUTATION = `
  mutation draftOrderUpdate($id: ID!, $input: DraftOrderInput!) {
    draftOrderUpdate(id: $id, input: $input) {
      draftOrder { id }
      userErrors { field message }
    }
  }
`;

const DRAFT_ORDER_CREATE_MUTATION = `
  mutation draftOrderCreate($input: DraftOrderInput!) {
    draftOrderCreate(input: $input) {
      draftOrder {
        id
        invoiceUrl
        currencyCode
        presentmentCurrencyCode
      }
      userErrors {
        field
        message
      }
    }
  }
`;


const GET_ORDER_BY_ID_QUERY = `
  query GetOrderById($id: ID!) {
    order(id: $id) {
      id name number
      currentTotalPriceSet { shopMoney { amount currencyCode } }
      displayFinancialStatus displayFulfillmentStatus processedAt tags
    }
  }
`;

const DRAFT_ORDER_COMPLETE_MUTATION = `
  mutation DraftOrderComplete($id: ID!) {
    draftOrderComplete(id: $id) {
      draftOrder { id order { id } }
      userErrors { field message }
    }
  }
`;

const ORDER_CLOSE_MUTATION = `
  mutation OrderClose($input: OrderCloseInput!) {
    orderClose(input: $input) {
      order { id closedAt }
      userErrors { field message }
    }
  }
`;

const REFUND_LINE_ITEM_MUTATION = `
  mutation RefundLineItem($input: RefundInput!) {
    refundCreate(input: $input) {
      refund { id totalRefundedSet { presentmentMoney { amount currencyCode } } }
      userErrors { field message }
    }
  }
`;

// ==================================================================
// 3. The Client Implementation
// ==================================================================

export class ShopifyAdminClient implements IShopifyAdminClient {
  constructor(
    private storeDomain: string,
    private clientId: string,        
    private clientSecret: string,    
    private apiVersion: string,      
    private infra: ShopifyOrderInfrastructure
  ) {
    if (!storeDomain || !clientId || !clientSecret || !apiVersion) {
      throw new Error("[ShopifyAdminClient] Missing required Shopify API credentials or configuration.");
    }
  }

  private getBaseUrl(): string {
    return `https://${this.storeDomain}/admin/api/${this.apiVersion}`;
  }

  /// ==================================================================
  // Static Authentication Core
  // ==================================================================

  /**
   * Retrieves the permanent access token saved during the initial OAuth flow.
   */
  /**
   * 🛡️ Resilient Token Resolver
   * 1. Checks the FastAPI vault first.
   * 2. If missing, generates a new token via client_credentials.
   * 3. Persists the new token back to the vault.
   */
  private async getValidToken(): Promise<string> {
    try {
      // 1. Check if we already have a token in the infra vault
      let token = await this.infra.fetchAdminToken().catch(() => null);

      if (token) {
        return token;
      }

      console.log("🗝️ Token missing from vault. Generating new Shopify Admin token...");

      // 2. Generate new token if vault is empty
      // Note: We use the credentials passed into the constructor
      const response = await fetch(
        `https://${this.storeDomain}/admin/oauth/access_token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: this.clientId,
            client_secret: this.clientSecret,
            grant_type: "client_credentials",
          }),
        }
      );

      const data = (await response.json()) as { access_token?: string; error?: string };

      if (!response.ok || !data.access_token) {
        throw new Error(`Shopify Auth Failed: ${data.error || response.statusText}`);
      }

      const accessToken = data.access_token;

      // 3. Save it back to the vault so the next request is fast
      await this.infra.saveAdminToken(accessToken).catch((e) => 
        console.warn("[ShopifyAdminClient] Token generated but failed to save to vault:", e)
      );

      return accessToken;
    } catch (error: any) {
      console.error("🚨 [ShopifyAdminClient] Auth Orchestration Error:", error.message);
      throw new Error(`[ShopifyAdminClient] Authentication failed: ${error.message}`);
    }
  }
  // ==================================================================
  // Resilient Network Core
  // ==================================================================

  private async withAuthRetry<T>(doRequest: (token: string) => Promise<Response>): Promise<T> {
    const token = await this.getValidToken();
    const response = await doRequest(token);

    // 🛠️ THE FIX: If we get a 401, we cannot auto-refresh. The merchant revoked the app.
    if (response.status === 401 || response.status === 403) {
      throw new Error("[ShopifyAdminClient] Shopify Admin token expired or revoked (401/403). Merchant must re-authenticate.");
    }

    const text = await response.text();
    let json: any;
    try { 
      json = text ? JSON.parse(text) : {}; 
    } catch { 
      throw new Error(`[ShopifyAdminClient] Non-JSON response: ${response.status} - ${text}`); 
    }

    if (!response.ok) {
      throw new Error(`[ShopifyAdminClient] HTTP error: ${response.status} - ${JSON.stringify(json)}`);
    }

    return json as T;
  }

  public async graphql<TData>(query: string, variables?: Record<string, unknown>): Promise<TData> {
    const envelope = await this.withAuthRetry<GraphqlEnvelope<TData>>(async (token) => {
      return fetch(`${this.getBaseUrl()}/graphql.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": token,
        },
        body: JSON.stringify({ query, variables }),
      });
    });

    if (envelope.errors) {
      throw new Error(`[ShopifyAdminClient] GraphQL errors: ${JSON.stringify(envelope.errors)}`);
    }

    if (!("data" in envelope) || envelope.data == null) {
      throw new Error("[ShopifyAdminClient] GraphQL response missing data field.");
    }

    return envelope.data;
  }

  private async rest<TData>(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: any): Promise<TData> {
    return this.withAuthRetry<TData>(async (token) => {
      return fetch(`${this.getBaseUrl()}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": token },
        body: body ? JSON.stringify(body) : undefined,
      });
    });
  }

  // ==================================================================
  // Mapper: The Shield Protecting Our Domain Math
  // ==================================================================

  private mapQuoteToGraphQLInput(input: CreateDraftOrderFromQuoteInput) {
    const { quote, businessCaseId, customerEmail, customerFirstName, customerLastName, shopifyCustomerId, note, tags } = input;

    const lineItems = quote.items.map((item) => {
      const lineItem: any = {
        variantId: item.shopifyVariantId, // Full GID
        quantity: item.quantity,
        customAttributes: []
      };

      if (item.discountPercentage && item.discountPercentage > 0) {
        lineItem.appliedDiscount = {
          description: "Custom Quote Override",
          value: item.discountPercentage,
          valueType: "PERCENTAGE", 
        };
      }

      return lineItem;
    });

    
    const hasName = customerFirstName || customerLastName;

    const graphqlInput: any = {
      presentmentCurrencyCode: quote.currency, 
      email: customerEmail,
      tags: [
        `B:${businessCaseId}`,
        `Q:${quote.id}`, 
        `U:${input.userId}`, 
        ...(tags ?? [])
      ],
      lineItems,
      // 🛠️ THE FIX: Correctly nest the names inside Address inputs
      billingAddress: hasName ? { firstName: customerFirstName, lastName: customerLastName } : undefined,
      shippingAddress: hasName ? { firstName: customerFirstName, lastName: customerLastName } : undefined,
    };

    // 🛠️ THE FIX: Use customerId directly, no 'purchasingEntity' wrapper
    if (shopifyCustomerId) {
      graphqlInput.customerId = shopifyCustomerId; 
      graphqlInput.useCustomerDefaultAddress = true;
    }

    return graphqlInput;
  }
  // ==================================================================
  // Lifecycle Operations
  // ==================================================================

  public async createDraftOrderFromQuote(input: CreateDraftOrderFromQuoteInput): Promise<{ shopifyDraftOrderGid: string; checkoutURL: string }> {
      const variables = { input: this.mapQuoteToGraphQLInput(input) };
      
      // 1. Create the Draft Order
      const data = await this.graphql<DraftOrderCreateResponse>(DRAFT_ORDER_CREATE_MUTATION, variables);
      const { draftOrder, userErrors } = data.draftOrderCreate;

      if (userErrors?.length || !draftOrder) {
        const errorMsg = userErrors?.map(e => `${e.field?.join('.') || 'Root'}: ${e.message}`).join(" | ");
        throw new Error(`[ShopifyAdminClient] GraphQL Error during creation: ${errorMsg || 'No data'}`);
      }

      // 2. THE FX DECISION: Compare Shopify's calculated currency codes
      const isMismatched = draftOrder.currencyCode !== draftOrder.presentmentCurrencyCode;

      if (isMismatched) {
        // Construct the warning using the domain's quoted price and Shopify's currency codes
        const approxWarning = `Note: Final charge processed in ${draftOrder.currencyCode}. Approx local value: ${input.quote.totalPrice} ${draftOrder.presentmentCurrencyCode}`;
        
        const finalNote = input.note ? `${input.note}\n\n${approxWarning}` : approxWarning;

        // 3. Silent Update: Inject the warning note only for international buyers
        const updateResult = await this.graphql<{ draftOrderUpdate: { userErrors: any[] } }>(
          DRAFT_ORDER_UPDATE_MUTATION, 
          {
            id: draftOrder.id,
            input: { note: finalNote }
          }
        );

        if (updateResult.draftOrderUpdate.userErrors.length > 0) {
          console.warn("[ShopifyAdminClient] FX Warning note failed to attach:", updateResult.draftOrderUpdate.userErrors);
        }
      }

      return {
        shopifyDraftOrderGid: draftOrder.id,
        checkoutURL: draftOrder.invoiceUrl,
      };
    }
  // Note: Keeping REST for cancelation for now, as it still works beautifully 
  // via numeric ID extraction and minimizes scope creep.
  public async cancelDraftOrder(shopifyDraftOrderGid: string): Promise<void> {
    const numericIdMatch = shopifyDraftOrderGid.match(/\d+$/);
    if (!numericIdMatch) throw new Error(`[ShopifyAdminClient] Invalid Draft Order GID format: ${shopifyDraftOrderGid}`);
    await this.rest<unknown>(`/draft_orders/${numericIdMatch[0]}.json`, "DELETE");
  }

  public async getOrderByGid(shopifyOrderGid: string): Promise<ShopifyAdminOrder> {
    const data = await this.graphql<{ order: ShopifyAdminOrder | null }>(GET_ORDER_BY_ID_QUERY, { id: shopifyOrderGid });
    if (!data.order) throw new Error(`[ShopifyAdminClient] Order not found for GID: ${shopifyOrderGid}`);
    return data.order;
  }

  public async completeDraftOrder(draftOrderGid: string): Promise<DraftOrderCompleteResult> {
    const data = await this.graphql<DraftOrderCompleteResponse>(DRAFT_ORDER_COMPLETE_MUTATION, { id: draftOrderGid });
    const { draftOrder, userErrors } = data.draftOrderComplete;
    
    if (userErrors?.length) throw new Error(`[ShopifyAdminClient] draftOrderComplete errors: ${JSON.stringify(userErrors)}`);
    if (!draftOrder?.order) throw new Error(`[ShopifyAdminClient] draftOrderComplete: no resulting order for draft order ${draftOrderGid}`);
    
    return { orderId: draftOrder.order.id };
  }

  public async closeOrder(orderGid: string): Promise<{ closedAt: string }> {
    const data = await this.graphql<OrderCloseResponse>(ORDER_CLOSE_MUTATION, { input: { id: orderGid } });
    const { order, userErrors } = data.orderClose;

    if (userErrors?.length) throw new Error(`[ShopifyAdminClient] orderClose errors: ${JSON.stringify(userErrors)}`);
    if (!order?.closedAt) throw new Error(`[ShopifyAdminClient] orderClose: order not closed for ${orderGid}`);

    return { closedAt: order.closedAt };
  }

  public async refundSingleLineItem(input: SimpleRefundInput): Promise<SimpleRefundResult> {
    const variables = {
      input: {
        orderId: input.orderId,
        refundLineItems: [{ lineItemId: input.lineItemId, quantity: input.quantity }],
        transactions: [], 
      },
    };

    const data = await this.graphql<RefundLineItemResponse>(REFUND_LINE_ITEM_MUTATION, variables);
    const { refund, userErrors } = data.refundCreate;

    if (userErrors?.length) throw new Error(`[ShopifyAdminClient] refundCreate errors: ${JSON.stringify(userErrors)}`);
    if (!refund) throw new Error(`[ShopifyAdminClient] refundCreate failed for order ${input.orderId}`);

    const pm = refund.totalRefundedSet.presentmentMoney;
    return {
      refundId: refund.id,
      amount: pm.amount,
      currencyCode: pm.currencyCode
    };
  }

  public async exchangeCodeForToken(shop: string, code: string): Promise<string> {
    const clientId = (globalThis as any).ENV?.SHOPIFY_API_KEY;
    const clientSecret = (globalThis as any).ENV?.SHOPIFY_API_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("[ShopifyAdminClient] Missing SHOPIFY_API_KEY or SHOPIFY_API_SECRET in environment.");
    }

    const url = `https://${shop}/admin/oauth/access_token`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const json = await response.json() as { access_token?: string; error?: string; error_description?: string };

    if (!response.ok || !json.access_token) {
      throw new Error(
        `[ShopifyAdminClient] OAuth exchange failed: ${json.error_description || json.error || response.statusText}`
      );
    }

    await this.infra.saveAdminToken(json.access_token);
    return json.access_token;
  }
}
