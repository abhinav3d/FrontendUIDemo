import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { BusinessCaseInfrastructure } from "@/src/domains/business_case/businessCase.infrastructure";
import type { PaymentExceptionInfrastructure } from "@/src/domains/business_case/paymentException.infrastructure";
import { 
  BusinessCaseStatus, 
  CommercialQuoteStatus, 
  BusinessCaseAction,
  PaymentExceptionStatus,
  type PaymentExceptionReason,
  type PaymentExceptionDTO,
  type BusinessCaseDTO, 
  type CommercialQuote,
  type DigitalAsset,
  ReferenceOrderType
} from "@/src/domains/business_case/businessCase.types";

import { 
  ConversationRole, 
  ConversationReferenceType, 
  type ConversationMessage 
} from "@/src/domains/conversation/conversation.types";
import type { IConversationService } from "@/src/domains/conversation/conversation.service";
import type { IShopifyCheckoutService } from "@/src/domains/shopify_order/shopifyCheckout.service";

export class BusinessCaseService {
  constructor(
    private infra: BusinessCaseInfrastructure,
    private shopifyCheckout: IShopifyCheckoutService,
    private conversation: IConversationService,
    private paymentExceptionInfra: PaymentExceptionInfrastructure
  ) {}

  // ==================================================================
  // 1. Discovery & Dashboard (Read Operations)
  // ==================================================================

  public async listCustomerCases(userId: string, limit: number = 20, cursor?: string): Promise<PaginatedResult<BusinessCaseDTO>> {
    if (!userId) throw new Error("[BusinessCaseService] userId is required for customer lookup.");
    return await this.infra.list({ userId, limit, cursor, sortBy: "lastUpdated", sortOrder: "desc" });
  }

  public async listSalesPipeline(statusFilter?: BusinessCaseStatus[], limit: number = 50, cursor?: string): Promise<PaginatedResult<BusinessCaseDTO>> {
    const params: Record<string, any> = { limit, cursor, sortBy: "lastUpdated", sortOrder: "desc" };
    if (statusFilter && statusFilter.length > 0) params.statuses = statusFilter;
    return await this.infra.list(params);
  }

  public async getCaseDetail(businessCaseId: string): Promise<BusinessCaseDTO | null> {
    if (!businessCaseId) return null;
    return await this.infra.read(businessCaseId);
  }

  // ==================================================================
  // 2. Intake (The "Start")
  // ==================================================================

  public async submitNewCase(
    dto: BusinessCaseDTO, 
    locale: string
  ): Promise<BusinessCaseDTO> {
    
    if (!dto.commercials || dto.commercials.length === 0) {
      throw new Error("[BusinessCaseService] Cannot submit a new case without an initial quote.");
    }

    const initialQuote = dto.commercials[0];
    dto.lastUpdated = Date.now();

    if (dto.action === BusinessCaseAction.DIRECT_ORDER) {
      dto.status = BusinessCaseStatus.AWAITING_PAYMENT;
      dto.activeQuoteId = initialQuote.id;
      initialQuote.status = CommercialQuoteStatus.ACTIVE;

      // 🛠️ NEW B2C FLOW: Generate a Storefront Cart link (Discount engine handles the 0% bypass)
      const discountResult = await this.shopifyCheckout.createNegotiatedDiscount({
        businessCaseId: dto.id,
        quoteId: initialQuote.id,
        discountPercentage: initialQuote.discountPercentage || 0
      });

      // Note: "en" is passed here as a default locale. You can pass user locale from headers later.
      const checkoutURL = this.shopifyCheckout.generateStorefrontLink(locale, discountResult.discountCode);

      initialQuote.shopifyDiscountId = discountResult.shopifyDiscountId;
      initialQuote.discountCode = discountResult.discountCode;
      initialQuote.checkoutURL = checkoutURL;

      const savedCase = await this.infra.create({
        ...dto,
        hydrated: true,
        needsServerSnapshot: false,
        isSyncing: false
      });

      await this.conversation.addSystemMessage(
        savedCase.id, ConversationReferenceType.BUSINESS_CASE, 
        `🚀 Direct Order initialized. You can complete your purchase here: ${checkoutURL}`
      );

      return savedCase;
    } else if (dto.action === BusinessCaseAction.INQUIRY) {
      dto.status = BusinessCaseStatus.OPEN;
      dto.activeQuoteId = undefined; 
      initialQuote.status = CommercialQuoteStatus.DRAFT;

      const savedCase = await this.infra.create({
        ...dto,
        hydrated: true,
        needsServerSnapshot: false,
        isSyncing: false
      });

      await this.conversation.addSystemMessage(
        savedCase.id, ConversationReferenceType.BUSINESS_CASE, 
        "📩 New inquiry submitted. Our sales team will review your request shortly.", dto.inputs 
      );

      return savedCase;
    } else {
      throw new Error(`[BusinessCaseService] Unknown BusinessCaseAction: ${dto.action}`);
    }
  }

  // ==================================================================
  // 3. Negotiation & "The Offer" (Sales Actions)
  // ==================================================================

 public async createQuoteRevision(
    businessCaseId: string, 
    newQuoteData: Omit<CommercialQuote, "id" | "status" | "checkoutURL" | "shopifyDraftOrderId" | "shopifyDiscountId" | "discountCode" | "totalPrice">
  ): Promise<BusinessCaseDTO> {
    const bCase = await this.requireCase(businessCaseId);

    bCase.commercials = bCase.commercials.map(quote => {
      if (quote.status === CommercialQuoteStatus.DRAFT) {
        return { ...quote, status: CommercialQuoteStatus.REJECTED }; 
      }
      return quote;
    });

    let calculatedTotalPrice = 0;
    
    const recalculatedItems = newQuoteData.items.map(item => {
      const storePrice = item.storePrice;
      const discount = item.discountPercentage || 0; 
      
      const calculatedPrice = storePrice - (storePrice * (discount / 100));
      const finalQuotedPrice = parseFloat(calculatedPrice.toFixed(2));
      
      calculatedTotalPrice += finalQuotedPrice;

      return {
        ...item,
        discountPercentage: discount,
        quotedPrice: finalQuotedPrice,
      };
    });

    const newQuote: CommercialQuote = {
      ...newQuoteData,
      id: crypto.randomUUID(),
      discountPercentage: newQuoteData.discountPercentage || 0, 
      items: recalculatedItems,
      totalPrice: parseFloat(calculatedTotalPrice.toFixed(2)),  
      status: CommercialQuoteStatus.DRAFT,
    };

    bCase.commercials.push(newQuote);
    bCase.status = BusinessCaseStatus.NEGOTIATING;
    bCase.lastUpdated = Date.now();

    await this.conversation.addSystemMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, 
      `🔒 Internal: Sales drafted a new quote with a ${newQuote.discountPercentage}% discount.`
    );

    return await this.infra.update(bCase.id, bCase);
  }

  public async updateQuoteDraft(
    businessCaseId: string, 
    quoteId: string, 
    updates: Partial<Omit<CommercialQuote, "id" | "status">>
  ): Promise<BusinessCaseDTO> {
    const bCase = await this.requireCase(businessCaseId);
    const quoteIndex = bCase.commercials.findIndex(q => q.id === quoteId);
    if (quoteIndex === -1) throw new Error(`Quote ${quoteId} not found.`);
    
    const quote = bCase.commercials[quoteIndex];
    if (quote.status !== CommercialQuoteStatus.DRAFT) {
      throw new Error(`[BusinessCaseService] Cannot edit quote ${quoteId} because its status is ${quote.status}.`);
    }

    bCase.commercials[quoteIndex] = { ...quote, ...updates };
    bCase.lastUpdated = Date.now();
    return await this.infra.update(bCase.id, bCase);
  }

  public async approveQuote(
    businessCaseId: string, 
    quoteId: string,
    locale:string,
    shopifyCustomerId?: string 
  ): Promise<BusinessCaseDTO> {
    const bCase = await this.requireCase(businessCaseId);
    const quote = this.requireQuote(bCase, quoteId);

    if (quote.status !== CommercialQuoteStatus.DRAFT) {
      throw new Error(`[BusinessCaseService] Only DRAFT quotes can be approved. Current: ${quote.status}`);
    }
    if (bCase.activeQuoteId) {
      throw new Error("[BusinessCaseService] This case already has an ACTIVE quote. Cancel it before approving a new one.");
    }

    // 🛠️ NEW B2C FLOW: Create the single-use discount and generate the storefront link
    const discountResult = await this.shopifyCheckout.createNegotiatedDiscount({
      businessCaseId: bCase.id,
      quoteId: quote.id,
      discountPercentage: quote.discountPercentage,
      shopifyCustomerId: shopifyCustomerId
    });

    const checkoutURL = this.shopifyCheckout.generateStorefrontLink(locale, discountResult.discountCode);

    quote.status = CommercialQuoteStatus.ACTIVE;
    quote.shopifyDiscountId = discountResult.shopifyDiscountId;
    quote.discountCode = discountResult.discountCode;
    quote.checkoutURL = checkoutURL;

    bCase.activeQuoteId = quote.id;
    bCase.status = BusinessCaseStatus.AWAITING_PAYMENT;
    bCase.lastUpdated = Date.now();

    await this.conversation.addSystemMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, 
      `🎉 Good news! We've prepared a new offer for you. You can securely checkout here: ${checkoutURL}`
    );

    return await this.infra.update(bCase.id, bCase);
  }

  public async cancelActiveQuote(businessCaseId: string, quoteId: string): Promise<BusinessCaseDTO> {
    const bCase = await this.requireCase(businessCaseId);
    const quote = this.requireQuote(bCase, quoteId);

    if (quote.status !== CommercialQuoteStatus.ACTIVE || bCase.activeQuoteId !== quote.id) {
      throw new Error(`[BusinessCaseService] Can only cancel the currently ACTIVE quote.`);
    }

    // 🛠️ NEW B2C FLOW: Fire the Kill Switch to expire the discount code
    if (quote.shopifyDiscountId) {
      await this.shopifyCheckout.cancelNegotiatedDiscount(quote.shopifyDiscountId);
    }

    quote.status = CommercialQuoteStatus.CANCELLED;
    bCase.activeQuoteId = undefined;
    bCase.status = BusinessCaseStatus.NEGOTIATING; 
    bCase.lastUpdated = Date.now();

    await this.conversation.addSystemMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, 
      "🛑 The previous checkout offer has been revoked or expired."
    );

    return await this.infra.update(bCase.id, bCase);
  }

  // ==================================================================
  // 4. The Unified Timeline
  // ==================================================================

  public async addCustomerMessage(businessCaseId: string, authorName: string, content: string, assets: DigitalAsset[] = []): Promise<ConversationMessage> {
    const bCase = await this.requireCase(businessCaseId);
    const msg = await this.conversation.addMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, authorName, ConversationRole.USER, content, assets
    );
    bCase.lastUpdated = Date.now();
    await this.infra.update(bCase.id, bCase);
    return msg;
  }

  public async addSalesMessage(businessCaseId: string, authorName: string, content: string, assets: DigitalAsset[] = []): Promise<ConversationMessage> {
    const bCase = await this.requireCase(businessCaseId);
    if (bCase.status === BusinessCaseStatus.OPEN) {
      bCase.status = BusinessCaseStatus.NEGOTIATING;
      bCase.lastUpdated = Date.now();
      await this.infra.update(bCase.id, bCase);
    }
    return await this.conversation.addMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, authorName, ConversationRole.SALES, content, assets
    );
  }

  public async addArtistMessage(businessCaseId: string, authorName: string, content: string, assets: DigitalAsset[] = []): Promise<ConversationMessage> {
    return await this.conversation.addMessage(
      businessCaseId, ConversationReferenceType.BUSINESS_CASE, authorName, ConversationRole.ARTIST, content, assets
    );
  }

  public async getTimeline(businessCaseId: string, limit: number = 50, cursor?: string): Promise<PaginatedResult<ConversationMessage>> {
    await this.requireCase(businessCaseId);
    return await this.conversation.listMessages(businessCaseId, limit, cursor);
  }

  // ==================================================================
  // 5. Reconciliation & Exceptions (Edge Logic)
  // ==================================================================

  public async markAsPaid(businessCaseId: string, shopifyOrderGid: string): Promise<BusinessCaseDTO> {
    const bCase = await this.requireCase(businessCaseId);

    if (!bCase.activeQuoteId) {
      throw new Error(`[BusinessCaseService] Cannot mark Case ${businessCaseId} as paid. No active quote.`);
    }

    const activeQuote = this.requireQuote(bCase, bCase.activeQuoteId);

    bCase.status = BusinessCaseStatus.PAID;
    bCase.acceptedQuoteId = bCase.activeQuoteId;
    bCase.referenceOrderId = shopifyOrderGid;
    bCase.referenceOrderType = ReferenceOrderType.SHOPIFY;
    bCase.lastUpdated = Date.now();

    activeQuote.status = CommercialQuoteStatus.ACCEPTED;

    await this.conversation.addSystemMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, 
      `🎉 Payment confirmed! Your order (Ref: ${shopifyOrderGid}) is now locked in. We will begin production shortly.`
    );

    return await this.infra.update(bCase.id, bCase);
  }

  public async handlePaymentException(
    businessCaseId: string, 
    shopifyOrderGid: string,
    reason: PaymentExceptionReason,
    notes: string,
    quoteId?: string
  ): Promise<void> {
    const bCase = await this.requireCase(businessCaseId);

    const exceptionData: PaymentExceptionDTO = {
      id: crypto.randomUUID(),
      shopifyOrderGid,
      businessCaseId: bCase.id,
      quoteId: quoteId,
      reason: reason,
      status: PaymentExceptionStatus.OPEN,
      createdAt: Date.now(),
      notes: notes,
      version: 1,
      lastUpdated: Date.now(),
      hydrated: true,
      needsServerSnapshot: false,
      isSyncing: false
    };

    await this.paymentExceptionInfra.create(exceptionData);

    await this.conversation.addSystemMessage(
      bCase.id, ConversationReferenceType.BUSINESS_CASE, 
      `⚠️ INTERNAL ALERT: A payment exception (${reason}) occurred for Order ${shopifyOrderGid}. Review immediately.`
    );
  }

  public async resolvePaymentException(
    businessCaseId: string,
    exceptionId: string,
    resolutionStatus: PaymentExceptionStatus, 
    reviewerId: string
  ): Promise<BusinessCaseDTO> {
    const bCase = await this.requireCase(businessCaseId);

    const exception = await this.paymentExceptionInfra.read(exceptionId);
    if (!exception) throw new Error(`[BusinessCaseService] Payment Exception ${exceptionId} not found.`);

    exception.status = resolutionStatus;
    exception.resolvedAt = Date.now();
    exception.reviewerId = reviewerId;
    await this.paymentExceptionInfra.update(exceptionId, exception);

    if (resolutionStatus === PaymentExceptionStatus.RESOLVED_ACCEPT) {
      bCase.status = BusinessCaseStatus.PAID;
      bCase.lastUpdated = Date.now();
      
      await this.conversation.addSystemMessage(
        bCase.id, ConversationReferenceType.BUSINESS_CASE, 
        "✅ The payment discrepancy has been manually approved by the Sales team. Order is confirmed."
      );
      
      return await this.infra.update(bCase.id, bCase);
    }

    if (resolutionStatus === PaymentExceptionStatus.RESOLVED_REFUND) {
      bCase.status = BusinessCaseStatus.NEGOTIATING; 
      bCase.activeQuoteId = undefined; 
      bCase.lastUpdated = Date.now();

      await this.conversation.addSystemMessage(
        bCase.id, ConversationReferenceType.BUSINESS_CASE, 
        "🛑 Your recent payment was refunded due to a discrepancy. A new checkout link will be provided."
      );

      return await this.infra.update(bCase.id, bCase);
    }

    return bCase;
  }

  // ==================================================================
  // Internal Helpers
  // ==================================================================

  private async requireCase(id: string): Promise<BusinessCaseDTO> {
    const bCase = await this.infra.read(id);
    if (!bCase) throw new Error(`BusinessCase ${id} not found.`);
    return bCase;
  }

  private requireQuote(bCase: BusinessCaseDTO, quoteId: string): CommercialQuote {
    const quote = bCase.commercials.find(q => q.id === quoteId);
    if (!quote) throw new Error(`Quote ${quoteId} not found in Case ${bCase.id}.`);
    return quote;
  }
}
