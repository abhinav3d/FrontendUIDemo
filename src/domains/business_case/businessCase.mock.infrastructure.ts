import type { PaginatedResult } from '@/src/core/base/base.infrastructure.api';
import type { BusinessCaseDTO } from './businessCase.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockBusinessCaseInfrastructure {
  private store: Map<string, BusinessCaseDTO> = new Map();

  public async read(id: string): Promise<BusinessCaseDTO | null> {
    await delay(100);
    return this.store.get(id) || null;
  }

  public async list(params: Record<string, any> = {}): Promise<PaginatedResult<BusinessCaseDTO>> {
    await delay(150);
    let items = Array.from(this.store.values());

    if (params.userId) {
      items = items.filter(item => item.userId === params.userId);
    }
    if (params.statuses) {
      items = items.filter(item => params.statuses.includes(item.status));
    }

    // Sorting
    if (params.sortBy === "lastUpdated") {
      items.sort((a, b) => params.sortOrder === "desc" ? b.lastUpdated - a.lastUpdated : a.lastUpdated - b.lastUpdated);
    }

    return { items, hasNext: false };
  }

  public async create(payload: Partial<BusinessCaseDTO> | Omit<BusinessCaseDTO, 'id'>): Promise<BusinessCaseDTO> {
    await delay(200);
    const id = (payload as any).id || `bc_mock_${Date.now()}`;
    const newCase = { ...payload, id, version: 1, lastUpdated: Date.now() } as BusinessCaseDTO;
    this.store.set(id, newCase);
    return newCase;
  }

  public async update(id: string, payload: Partial<BusinessCaseDTO>): Promise<BusinessCaseDTO> {
    await delay(150);
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Mock 404: BusinessCase ${id} not found`);

    const updated: BusinessCaseDTO = { 
      ...existing, 
      ...payload, 
      lastUpdated: Date.now(), 
      version: existing.version + 1,
    };
    
    this.store.set(id, updated);
    return updated;
  }

  public async delete(id: string): Promise<boolean> {
    await delay(100);
    return this.store.delete(id);
  }
}
