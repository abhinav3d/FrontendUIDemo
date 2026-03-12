import { IdentityService } from "./identity.service";
import { IdentityInfrastructure } from "./identity.infrastructure";
import { MockIdentityInfrastructure } from "./identity.mock.infrastructure";

export class IdentityDomainFactory {
  private static instance: IdentityService;

  public static getInstance(env: any, useMock: boolean = false): IdentityService {
    if (!this.instance) {
      const infrastructure = useMock 
        ? new MockIdentityInfrastructure() 
        : new IdentityInfrastructure(env.FASTAPI_BASE_URL);
        
      this.instance = new IdentityService(infrastructure);
    }
    return this.instance;
  }
}
