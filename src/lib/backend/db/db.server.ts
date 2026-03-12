/**
 * 🧪 Simple In-Memory Mock Database
 */
class MockDb {
  private collections: Record<string, Map<string, any>> = {
    user: new Map(),
    interaction: new Map(),
    wallet: new Map(),
    template: new Map(),
    asset: new Map(),
    creation: new Map(),
    commerce: new Map(),
    business_case: new Map(),
    shopify_order: new Map(),
    workorder: new Map(),
    conversation: new Map(),
    notification: new Map(),
  };

  private createCollection(name: string, idKey: string = "id") {
    return {
      findMany: async () => Array.from(this.collections[name].values()),
      findUnique: async ({ where }: { where: any }) => {
        const id = where[idKey];
        return this.collections[name].get(id);
      },
      create: async ({ data }: { data: any }) => {
        const id = data[idKey];
        this.collections[name].set(id, data);
        return data;
      },
      update: async ({ where, data }: { where: any, data: any }) => {
        const id = where[idKey];
        const existing = this.collections[name].get(id);
        const updated = { ...existing, ...data };
        this.collections[name].set(id, updated);
        return updated;
      },
      delete: async ({ where }: { where: any }) => {
        const id = where[idKey];
        return this.collections[name].delete(id);
      }
    };
  }

  public user = this.createCollection("user", "userId");
  public interaction = this.createCollection("interaction", "id");
  public wallet = this.createCollection("wallet", "userId");
  public template = this.createCollection("template", "id");
  public asset = this.createCollection("asset", "id");
  public creation = this.createCollection("creation", "id");
  public commerce = this.createCollection("commerce", "variantId");
  public business_case = this.createCollection("business_case", "id");
  public shopify_order = this.createCollection("shopify_order", "id");
  public workorder = this.createCollection("workorder", "id");
  public conversation = this.createCollection("conversation", "id");
  public notification = this.createCollection("notification", "id");
}

export const db = new MockDb();
