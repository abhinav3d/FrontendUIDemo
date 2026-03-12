import { CustomerService } from "./customer.service";
import { CustomerInfrastructure } from "./customer.infrastructure";
import { MockCustomerInfrastructure } from "./customer.mock.infrastructure";

export class CustomerDomainFactory {
  private static instance: CustomerService;

  public static getInstance(env: any, useMock: boolean = false): CustomerService {
    if (!this.instance) {
      const infrastructure = useMock 
        ? new MockCustomerInfrastructure() 
        : new CustomerInfrastructure(env.FASTAPI_BASE_URL);
        
      this.instance = new CustomerService(infrastructure);
    }
    return this.instance;
  }

  public static reset(): void {
    // @ts-ignore
    this.instance = undefined;
  }
}
