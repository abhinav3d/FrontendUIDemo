import type { CreationDTO } from "./creation.types";
import { 
  type BusinessCaseDTO, 
  BusinessCaseAction, 
  BusinessCaseStatus, 
  CommercialQuoteStatus,
  type DigitalAsset
} from "@/src/domains/business_case/businessCase.types";

/**
 * THE HANDOFF: Converts the finalized Creation into a Shopify-ready Business Case.
 * This bridges the gap between the Creation domain and Commerce domain.
 */
export function creationToBusinessCase(
  creation: CreationDTO,
  action: BusinessCaseAction,
  discountPercentage: number = 0,
  options: {
    productId: string;
    variantId: string;
    productTitle: string;
    price: number;
    currency: string;
    sku?: string;
  }
): BusinessCaseDTO {
  const quoteId = crypto.randomUUID();
  
  const inputs: DigitalAsset[] = creation.inputs.map(input => ({
    type: input.type,
    url: input.path,
    label: input.label
  }));

  const outputs: DigitalAsset[] = creation.outputs.map(output => ({
    type: output.type,
    url: output.path,
    label: output.label
  }));

  return {
    id: crypto.randomUUID(),
    userId: creation.userId,
    creationId: creation.id,
    action,
    status: BusinessCaseStatus.OPEN,
    inputs,
    outputs,
    commercials: [
      {
        id: quoteId,
        currency: options.currency,
        totalPrice: options.price * (1 - discountPercentage / 100),
        discountPercentage,
        status: CommercialQuoteStatus.DRAFT,
        items: [
          {
            productId: options.productId,
            productTitle: options.productTitle,
            quotedPrice: options.price * (1 - discountPercentage / 100),
            quotedCurrency: options.currency,
            storePrice: options.price,
            storeCurrency: options.currency,
            quantity: 1,
            discountPercentage,
            sku: options.sku,
            shopifyVariantId: options.variantId
          }
        ]
      }
    ],
    version: 1,
    lastUpdated: Date.now(),
    hydrated: true,
    needsServerSnapshot: false,
    isSyncing: false
  };
}
