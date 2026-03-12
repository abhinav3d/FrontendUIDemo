import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { ConversationInfrastructure } from "./conversation.infrastructure";
import { 
  type ConversationMessage, 
  ConversationRole, 
  ConversationReferenceType
} from "./conversation.types";

export class MockConversationInfrastructure {
  private messages: Map<string, ConversationMessage[]> = new Map();

  public async create(payload: ConversationMessage): Promise<ConversationMessage> {
    const thread = this.messages.get(payload.referenceId) || [];
    thread.push(payload);
    this.messages.set(payload.referenceId, thread);
    return payload;
  }

  public async list(params: { referenceId: string; sortOrder?: "asc" | "desc" }): Promise<PaginatedResult<ConversationMessage>> {
    let thread = [...(this.messages.get(params.referenceId) || [])];
    
    if (params.sortOrder === "desc") {
      thread.reverse();
    }

    return {
      items: thread,
      hasNext: false
    };
  }
}
