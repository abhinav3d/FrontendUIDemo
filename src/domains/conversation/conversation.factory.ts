import { ConversationService } from "./conversation.service";
import { ConversationInfrastructure } from "./conversation.infrastructure";
import { MockConversationInfrastructure } from "./conversation.mock.infrastructure";

export class ConversationDomainFactory {
  private static instance: ConversationService | null = null;

  /**
   * Retrieves the Singleton instance of the ConversationService.
   * @param env The environment variables (from Remix context or process.env)
   * @param useMocks Set to true for local UI development without FastAPI
   */
  public static getInstance(env: any, useMocks: boolean = true): ConversationService {
    if (!this.instance) {
      console.log(`🏭 [ConversationDomainFactory] Assembling Service (Mocks: ${useMocks})`);

      // 1. Instantiate the Infrastructure
      // We cast through 'unknown' so TypeScript cleanly accepts the Mock in place of the Real class
      const infrastructure = useMocks
        ? (new MockConversationInfrastructure() as unknown as ConversationInfrastructure)
        : new ConversationInfrastructure(); // In production, you might pass env.FASTAPI_URL here

      // 2. Build and cache the Domain Service
      this.instance = new ConversationService(infrastructure);
    }

    return this.instance;
  }

  /**
   * Used strictly for testing suites to force a fresh instance.
   */
  public static resetInstance(): void {
    this.instance = null;
  }
}
