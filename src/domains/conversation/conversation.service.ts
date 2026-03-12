import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { ConversationInfrastructure } from "./conversation.infrastructure";
import { 
  type ConversationMessage, 
  ConversationRole, 
  type ConversationReferenceType,
  type MessageAttachment
} from "./conversation.types";
import type { DigitalAsset } from "@/src/domains/business_case/businessCase.types";

export interface IConversationService {
  addMessage(
    referenceId: string, 
    referenceType: ConversationReferenceType, 
    authorName: string, 
    role: ConversationRole, 
    content: string, 
    assets?: DigitalAsset[]
  ): Promise<ConversationMessage>;
  
  addSystemMessage(
    referenceId: string, 
    referenceType: ConversationReferenceType, 
    content: string, 
    assets?: DigitalAsset[]
  ): Promise<ConversationMessage>;
  
  listMessages(
    referenceId: string, 
    limit?: number, 
    cursor?: string
  ): Promise<PaginatedResult<ConversationMessage>>;
  
  getLatestMessage(referenceId: string): Promise<ConversationMessage | null>;
}

export class ConversationService implements IConversationService {
  constructor(private infra: ConversationInfrastructure) {}

  /**
   * Adds a new human-authored message to the timeline.
   * Assumes any provided assets have already been uploaded and converted to DigitalAsset URLs.
   */
  public async addMessage(
    referenceId: string, 
    referenceType: ConversationReferenceType, 
    authorName: string,
    role: ConversationRole,
    content: string, 
    assets: DigitalAsset[] = []
  ): Promise<ConversationMessage> {
    
    const messageId = crypto.randomUUID();
    
    // Transform the raw DigitalAssets into timeline Attachments
    const attachments: MessageAttachment[] = assets.map(asset => ({
      id: crypto.randomUUID(),
      messageId: messageId,
      asset: asset,
      createdAt: Date.now()
    }));

    const message: ConversationMessage = {
      id: messageId,
      referenceId,
      referenceType,
      authorName,
      role,
      content,
      attachments,
      createdAt: Date.now(),
      version: 1,
    };

    return await this.infra.create(message);
  }

  /**
   * Helper to quickly log system events (e.g., "Payment Received", "Link Generated")
   */
  public async addSystemMessage(
    referenceId: string, 
    referenceType: ConversationReferenceType, 
    content: string, 
    assets: DigitalAsset[] = []
  ): Promise<ConversationMessage> {
    return this.addMessage(
      referenceId, 
      referenceType, 
      "System", 
      ConversationRole.SYSTEM, 
      content, 
      assets
    );
  }

  /**
   * Fetches the conversation history. 
   * Defaults to ascending order (oldest first) so standard chat UIs render correctly top-to-bottom.
   */
  public async listMessages(
    referenceId: string, 
    limit: number = 50, 
    cursor?: string
  ): Promise<PaginatedResult<ConversationMessage>> {
    return await this.infra.list({
      referenceId,
      sortBy: "createdAt",
      sortOrder: "asc", 
      limit,
      cursor
    });
  }

  /**
   * Fetches only the single most recent message (useful for previewing the last reply in a list view).
   */
  public async getLatestMessage(referenceId: string): Promise<ConversationMessage | null> {
    const result = await this.infra.list({
      referenceId,
      sortBy: "createdAt",
      sortOrder: "desc", // Flips to descending to grab the newest
      limit: 1
    });
    
    return result.items.length > 0 ? result.items[0] : null;
  }
}
