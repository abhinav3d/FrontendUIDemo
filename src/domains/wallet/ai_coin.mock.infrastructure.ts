import type { IAICoinInfrastructure } from "./ai_coin.infrastructure";
import { 
  AICoinDirection, 
  type AddCoinsPayload,
  type AICoinTransaction, 
  type AICoinWallet 
} from "./ai_coin.types";
import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";

export class MockAICoinInfrastructure implements IAICoinInfrastructure {
  private wallets: Map<string, AICoinWallet> = new Map();
  private transactions: Map<string, AICoinTransaction[]> = new Map();

  public async getWallet(userId: string): Promise<AICoinWallet> {
    if (!this.wallets.has(userId)) {
      this.wallets.set(userId, { userId, balance: 100 }); // Start with some coins for testing
    }
    return this.wallets.get(userId)!;
  }

  public async getTransactions(
    userId: string, 
    limit: number = 20, 
    cursor?: string, 
    orderBy: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<AICoinTransaction>> {
    const userTx = this.transactions.get(userId) || [];
    const sorted = [...userTx].sort((a, b) => 
      orderBy === 'desc' ? b.createdAt - a.createdAt : a.createdAt - b.createdAt
    );
    
    return {
      items: sorted.slice(0, limit),
      hasNext: sorted.length > limit
    };
  }

  public async addCoins(payload: AddCoinsPayload): Promise<AICoinTransaction> {
    const wallet = await this.getWallet(payload.userId);
    
    if (payload.direction === AICoinDirection.CREDIT) {
      wallet.balance += payload.amount;
    } else {
      wallet.balance -= payload.amount;
    }
    
    const transaction: AICoinTransaction = {
      ...payload,
      id: `tx_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now()
    };
    
    const userTx = this.transactions.get(payload.userId) || [];
    userTx.push(transaction);
    this.transactions.set(payload.userId, userTx);
    
    return transaction;
  }
}
