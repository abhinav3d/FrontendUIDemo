import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api";
import type { Customer } from "./customer.types";

/**
 * The strict contract for fetching Shopify customer data.
 */
export interface ICustomerInfrastructure {
  /**
   * 🔍 Retrieves customer details from Shopify via FastAPI.
   * @param shopifyCustomerId The GID of the customer (e.g., gid://shopify/Customer/12345)
   */
  getCustomer(shopifyCustomerId: string): Promise<Customer | null>;
}

export class CustomerInfrastructure 
  extends BaseInfrastructureApi<Customer & { id: string }> 
  implements ICustomerInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Maps to your FastAPI backend route: /api/v1/customers
    super("Customer", `${fastApiBaseUrl}/api/v1/customers`);
  }

  public async getCustomer(shopifyCustomerId: string): Promise<Customer | null> {
    try {
      // We use encodeURIComponent because Shopify IDs are GIDs (contain slashes)
      return await this.fetchJson<Customer>(
        `${this.basePath}/${encodeURIComponent(shopifyCustomerId)}`
      );
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      throw error;
    }
  }
}
