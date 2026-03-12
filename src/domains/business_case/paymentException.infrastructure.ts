import { BaseInfrastructureApi } from '@/src/core/base/base.infrastructure.api';
import type { PaymentExceptionDTO } from '@/src/domains/business_case/businessCase.types';

/**
 * PaymentExceptionInfrastructure
 * Handles CRUD operations for payment discrepancies and checkout mismatches.
 */
export class PaymentExceptionInfrastructure extends BaseInfrastructureApi<PaymentExceptionDTO> {
  constructor(basePath: string = "/api/v1/payment-exceptions") {
    super("payment_exception", basePath);
  }
}
