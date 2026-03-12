import { BaseInfrastructureApi } from '@/src/core/base/base.infrastructure.api';
import type { BusinessCaseDTO } from './businessCase.types';

/**
 * BusinessCaseInfrastructure
 * STRICT BOUNDARY: Pure CRUD pipe to FastAPI.
 * It knows nothing about state machines, quotes, or Shopify. 
 * It simply persists and retrieves the BusinessCaseDTO aggregate root.
 */
export class BusinessCaseInfrastructure extends BaseInfrastructureApi<BusinessCaseDTO> {
  constructor(basePath: string = "/api/v1/business-cases") {
    // Passes the cache domain name "business_case" and FastAPI base path to the Base Class
    super("business_case", basePath);
  }
}
