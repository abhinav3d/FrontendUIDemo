export interface PaginatedResult<T> {
  items: T[];
  hasNext: boolean;
}

/**
 * BaseInfrastructureApi
 * A pure HTTP client for interacting with FastAPI.
 * Caching and database synchronization are entirely delegated to the FastAPI backend.
 */
export abstract class BaseInfrastructureApi<T extends { id: string }> {
  constructor(
    protected domain: string,
    protected basePath: string
  ) {}

  // --- Network Helper --- //

  protected async fetchJson<R>(url: string, options?: RequestInit): Promise<R> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[${this.domain}] API Error ${response.status}: ${errorText}`);
    }

    return (await response.json()) as R;
  }

  // ==================================================================
  // Public Contract (Pure Network Calls)
  // ==================================================================

  public async read(id: string): Promise<T | null> {
    try {
      return await this.fetchJson<T>(`${this.basePath}/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) return null;
      throw error;
    }
  }

  public async list(params: Record<string, any> = {}): Promise<PaginatedResult<T>> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;
    
    return await this.fetchJson<PaginatedResult<T>>(url);
  }

  public async create(payload: Partial<T> | Omit<T, 'id'>): Promise<T> {
    return await this.fetchJson<T>(this.basePath, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  public async update(id: string, payload: Partial<T>): Promise<T> {
    return await this.fetchJson<T>(`${this.basePath}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }

  public async delete(id: string): Promise<boolean> {
    await this.fetchJson(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
    return true;
  }
}
