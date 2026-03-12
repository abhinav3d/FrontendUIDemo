import { BusinessCaseService } from "./businessCase.service";
import { BusinessCaseInfrastructure } from "./businessCase.infrastructure";
import { MockBusinessCaseInfrastructure } from "./businessCase.mock.infrastructure";
import { PaymentExceptionInfrastructure } from "./paymentException.infrastructure";
import { MockPaymentExceptionInfrastructure } from "./paymentException.mock.infrastructure";

import { ShopifyCheckoutDomainFactory } from "@/src/domains/shopify_order/shopifyCheckout.factory";
import { ConversationDomainFactory } from "@/src/domains/conversation/conversation.factory";

export class BusinessCaseDomainFactory {
  private static instance: BusinessCaseService | null = null;

  public static getInstance(env: any, useMocks: boolean = true): BusinessCaseService {
    if (!this.instance) {
      console.log(`🏭 [BusinessCaseDomainFactory] Assembling Service (Mocks: ${useMocks})`);

      // 1. Database Infrastructures
      const businessCaseInfra = useMocks
        ? (new MockBusinessCaseInfrastructure() as unknown as BusinessCaseInfrastructure)
        : new BusinessCaseInfrastructure();

      const paymentExceptionInfra = useMocks
        ? (new MockPaymentExceptionInfrastructure() as unknown as PaymentExceptionInfrastructure)
        : new PaymentExceptionInfrastructure();

      // 2. Cross-Domain Injection
      const shopifyCheckoutService = ShopifyCheckoutDomainFactory.getInstance(env, useMocks);

      // 3. Conversations
      const conversationService = ConversationDomainFactory.getInstance(env, useMocks);

      // 4. Build the Aggregate Root
      this.instance = new BusinessCaseService(
        businessCaseInfra,
        shopifyCheckoutService, 
        conversationService,
        paymentExceptionInfra
      );
    }

    return this.instance;
  }

  public static resetInstance(): void {
    this.instance = null;
  }
}
