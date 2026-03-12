import type { BaseState } from '@/src/core/base.types';

export interface ShopifyMoneyDTO {
  amount: number;
  currencyCode: string;
  formatted: string; 
}

export interface ProductVariantDTO {
  id: string; 
  title: string;
  selectedOptions: { name: string; value: string }[];
  price: ShopifyMoneyDTO;
  compareAtPrice: ShopifyMoneyDTO | null;
}

export interface ProductOptionDTO {
  name: string;
  optionValues: { name: string; hasVariants: boolean }[];
}

export interface ProductDTO {
  id: string; 
  title: string;
  options: ProductOptionDTO[];
  variants: ProductVariantDTO[];
  lastFetchedAt: number;
}

// 🎯 This is the 'T' and 'D' payload for the Store/Service
export interface ProductPricingPayload extends BaseState {
  id: string; 
  productCache: Record<string, ProductDTO>;
}
