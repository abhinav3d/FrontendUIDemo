import { TemplateService } from "./template.service";
import { TemplateInfrastructure } from "./template.infrastructure";
import { MockTemplateInfrastructure } from "./template.mock.infrastructure";

export class TemplateDomainFactory {
  private static instance: TemplateService;

  /**
   * Returns the singleton instance of the TemplateService.
   * * @param fastApiBaseUrl The URL for the real FastAPI backend
   * @param useMock If true, injects the JSON-registry based Mock infrastructure
   */
  public static getInstance(
    fastApiBaseUrl: string,
    useMock: boolean = false
  ): TemplateService {
    if (!this.instance) {
      // 🔌 Wire up the appropriate data source
      // If useMock is true, we use the registry-backed MockInfrastructure
      const infrastructure = useMock 
        ? new MockTemplateInfrastructure() 
        : new TemplateInfrastructure(fastApiBaseUrl);
        
      // 🧠 Inject the infrastructure into the Service (The Brain)
      this.instance = new TemplateService(infrastructure);
    }
    
    return this.instance;
  }

  /**
   * Internal helper to reset the singleton. 
   * Useful for testing or when environment variables change.
   */
  public static reset(): void {
    // @ts-ignore
    this.instance = undefined;
  }
}
