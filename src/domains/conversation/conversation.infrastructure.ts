import { BaseInfrastructureApi } from '@/src/core/base/base.infrastructure.api';
import type { ConversationMessage } from './conversation.types';

export class ConversationInfrastructure extends BaseInfrastructureApi<ConversationMessage> {
  constructor(basePath: string = "/api/v1/conversations/messages") {
    super("conversation_message", basePath);
  }
}
