import type { ICustomerInfrastructure } from "./customer.infrastructure";
import type { Customer } from "./customer.types";

export class CustomerService {
  constructor(private readonly infra: ICustomerInfrastructure) {}

  /**
   * Retrieves the full profile of a customer.
   * This is typically used on the "Account" or "Profile" page.
   */
  public async getProfile(shopifyCustomerId: string): Promise<Customer | null> {
    if (!shopifyCustomerId) return null;
    return await this.infra.getCustomer(shopifyCustomerId);
  }

  /**
   * Formats the customer's full name for display.
   */
  public getFullName(customer: Customer | null): string {
    if (!customer) return "Guest";
    const first = customer.firstName || "";
    const last = customer.lastName || "";
    return `${first} ${last}`.trim() || "Anonymous User";
  }

  /**
   * Helper to get the primary email string.
   */
  public getEmail(customer: Customer | null): string {
    return customer?.emailAddress?.emailAddress || "No email provided";
  }
}
