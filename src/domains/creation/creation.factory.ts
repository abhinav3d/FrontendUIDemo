import { CreationService } from "./creation.service";
import { CreationInfrastructure } from "./creation.infrastructure";
import { MockCreationInfrastructure } from "./creation.mock.infrastructure";

export class CreationDomainFactory {
  private static instance: CreationService;

  /**
   * Returns the singleton instance of the CreationService.
   * * @param fastApiBaseUrl The URL for the real FastAPI backend
   * @param useMock If true, injects the in-memory Mock infrastructure for local UI development
   */
  public static getInstance(
    fastApiBaseUrl: string,
    useMock: boolean = false
  ): CreationService {
    if (!this.instance) {
      // 🔌 1. Build the Data Layer (Real API vs Local Memory)
      const infrastructure = useMock 
        ? new MockCreationInfrastructure() 
        : new CreationInfrastructure(fastApiBaseUrl);
        
      // 🧠 2. Build the Business Layer (The Brain)
      this.instance = new CreationService(infrastructure);
    }
    
    return this.instance;
  }

  /**
   * Internal helper to reset the singleton. 
   * Useful for unit testing or when environment variables change.
   */
  public static reset(): void {
    // @ts-ignore
    this.instance = undefined;
  }
}
