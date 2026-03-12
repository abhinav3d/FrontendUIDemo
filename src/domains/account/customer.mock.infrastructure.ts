import type { Customer, Address } from "./customer.types";
import type { ICustomerInfrastructure } from "./customer.infrastructure";

export class MockCustomerInfrastructure implements ICustomerInfrastructure {
  private customers: Map<string, Customer> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const mockAddress: Address = {
      id: "gid://shopify/MailingAddress/1",
      firstName: "Abhinav",
      lastName: "User",
      company: "My3DMeta",
      address1: "123 Tech Park",
      address2: "Suite 456",
      city: "Bangalore",
      zoneCode: "KA",
      territoryCode: "IN",
      zip: "560001",
      phoneNumber: "+91 9876543210"
    };

    const mockCustomer: Customer = {
      id: "gid://shopify/Customer/123456789",
      firstName: "Abhinav",
      lastName: "User",
      emailAddress: {
        emailAddress: "abhinav@my3dmeta.com"
      },
      defaultAddress: mockAddress,
      addresses: {
        nodes: [mockAddress]
      }
    };

    this.customers.set(mockCustomer.id, mockCustomer);
  }

  public async getCustomer(shopifyCustomerId: string): Promise<Customer | null> {
    console.log(`[MockCustomer] 🔍 Fetching Shopify Customer: ${shopifyCustomerId}`);
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network
    return this.customers.get(shopifyCustomerId) || null;
  }
}
