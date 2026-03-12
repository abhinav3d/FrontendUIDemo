import { BaseInfrastructureApi, type PaginatedResult } from "@/src/core/base/base.infrastructure.api";
import type { 
  AICoinTransaction, 
  AICoinWallet, 
  AddCoinsPayload
} from "./ai_coin.types";


export interface IAICoinInfrastructure {
  getWallet(userId: string): Promise<AICoinWallet>;
  
  getTransactions(
    userId: string, 
    limit: number, 
    cursor?: string, 
    orderBy?: 'asc' | 'desc'
  ): Promise<PaginatedResult<AICoinTransaction>>;

  addCoins(payload: AddCoinsPayload): Promise<AICoinTransaction>;
}

/**
 * AICoinInfrastructure
 * Handles the I/O for the AI Coin Ledger and Wallet projections.
 */
export class AICoinInfrastructure 
  extends BaseInfrastructureApi<AICoinTransaction & { id: string }> 
  implements IAICoinInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Domain: AICoin, BasePath: /api/v1/ai-coin
    super("AICoin", `${fastApiBaseUrl}/api/v1/ai-coin`);
  }

  /**
   * 1. getWallet
   * Retrieves the current balance projection for a user.
   */
  public async getWallet(userId: string): Promise<AICoinWallet> {
    return await this.fetchJson<AICoinWallet>(`${this.basePath}/wallets/${userId}`);
  }

  /**
   * 2. getTransactions
   * Retrieves a paginated list of ledger entries.
   * Defaults to descending order (newest first).
   */
  public async getTransactions(
    userId: string, 
    limit: number = 20, 
    cursor?: string,
    orderBy: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<AICoinTransaction>> {
    const query = new URLSearchParams({ 
      limit: limit.toString(),
      order_by: orderBy 
    });
    
    if (cursor) query.append("cursor", cursor);
    
    return await this.fetchJson<PaginatedResult<AICoinTransaction>>(
      `${this.basePath}/ledgers/${userId}?${query.toString()}`
    );
  }

  /**
   * 3. addCoins
   * Appends a new transaction to the ledger (Credit or Debit).
   */
  public async addCoins(payload: AddCoinsPayload): Promise<AICoinTransaction> {
    return await this.fetchJson<AICoinTransaction>(`${this.basePath}/ledgers`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}
