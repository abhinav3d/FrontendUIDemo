import { AICoinService } from "./ai_coin.service";
import { AICoinInfrastructure } from "./ai_coin.infrastructure";
import { MockAICoinInfrastructure } from "./ai_coin.mock.infrastructure";

export class AICoinDomainFactory {
  private static instance: AICoinService;

  /**
   * Returns the singleton instance of the AICoinService.
   * @param fastApiBaseUrl The base URL for the real API.
   * @param useMock If true, injects the local memory-based infrastructure.
   */
  public static getInstance(
    fastApiBaseUrl: string, 
    useMock: boolean = false
  ): AICoinService {
    if (!this.instance) {
      const infrastructure = useMock 
        ? new MockAICoinInfrastructure() 
        : new AICoinInfrastructure(fastApiBaseUrl);
        
      this.instance = new AICoinService(infrastructure);
    }
    return this.instance;
  }
}
