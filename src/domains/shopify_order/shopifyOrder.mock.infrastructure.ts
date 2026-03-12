export class MockShopifyOrderInfrastructure {
  private vault: Map<string, string> = new Map();

  public async fetchAdminToken(): Promise<string | null> {
    console.log("🏭 [MockShopifyOrderInfrastructure] Fetching token from memory vault...");
    return this.vault.get("admin_token") || null;
  }

  public async saveAdminToken(token: string): Promise<void> {
    console.log("🏭 [MockShopifyOrderInfrastructure] Saving token to memory vault...");
    this.vault.set("admin_token", token);
  }
}
