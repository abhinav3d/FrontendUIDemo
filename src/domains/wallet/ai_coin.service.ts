import type { IAICoinInfrastructure } from "./ai_coin.infrastructure";
import { 
  AICoinDirection, 
  type AddCoinsPayload,
  type AICoinTransaction, 
  type AICoinWallet 
} from "./ai_coin.types";
import type { PaginatedResult } from "@/src/core/base/base.infrastructure.api";

export class AICoinService {
  constructor(private readonly infra: IAICoinInfrastructure) {}

  // ==================================================================
  // 🔍 Read Operations
  // ==================================================================

  public async getWallet(userId: string): Promise<AICoinWallet> {
    return await this.infra.getWallet(userId);
  }

  public async getTransactionHistory(
    userId: string, 
    limit: number = 20, 
    cursor?: string
  ): Promise<PaginatedResult<AICoinTransaction>> {
    return await this.infra.getTransactions(userId, limit, cursor, 'desc');
  }

  // ==================================================================
  // 🛡️ Balance Protection & Logic
  // ==================================================================

  /**
   * Performs a debit operation with strict balance protection.
   * Uses Omit to remove 'direction' from the payload since the method defines it.
   */
  public async spendCoins(
    params: Omit<AddCoinsPayload, "direction">
  ): Promise<AICoinTransaction> {
    const wallet = await this.getWallet(params.userId);

    // 🛑 GATEKEEPER: Prevent negative balances
    if (wallet.balance < params.amount) {
      throw new Error(
        `[AICoinService] Insufficient balance. Required: ${params.amount}, Available: ${wallet.balance}`
      );
    }

    return await this.infra.addCoins({
      ...params,
      direction: AICoinDirection.DEBIT
    });
  }

  /**
   * Standard credit operation.
   */
  public async creditCoins(
    params: Omit<AddCoinsPayload, "direction">
  ): Promise<AICoinTransaction> {
    return await this.infra.addCoins({
      ...params,
      direction: AICoinDirection.CREDIT
    });
  }
}
