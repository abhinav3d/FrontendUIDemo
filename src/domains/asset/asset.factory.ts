import { AssetService } from "./asset.service";
import { AssetInfrastructure } from "./asset.infrastructure";
import { MockAssetInfrastructure } from "./asset.mock.infrastructure";

export class AssetDomainFactory {
  private static instance: AssetService;

  /**
   * Returns the singleton instance of the AssetService.
   * @param fastApiBaseUrl The URL for the real FastAPI backend
   * @param drmSalt The shared secret used to derive AES-GCM keys. MUST match FastAPI.
   * @param useMock If true, injects the in-memory Mock infrastructure for local UI development
   */
  public static getInstance(
    fastApiBaseUrl: string,
    drmSalt: string,
    useMock: boolean = false
  ): AssetService {
    if (!this.instance) {
      // 🔌 1. Build the Data Layer (Real API vs Local Memory Mock)
      const infrastructure = useMock 
        ? new MockAssetInfrastructure() 
        : new AssetInfrastructure(fastApiBaseUrl);
        
      // 🧠 2. Build the Business Layer (The Brain) and inject the cryptographic salt
      this.instance = new AssetService(infrastructure, drmSalt);
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
