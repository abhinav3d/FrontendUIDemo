import type { PaginatedResult } from '@/src/core/base/base.infrastructure.api';
import type { PaymentExceptionDTO } from './businessCase.types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockPaymentExceptionInfrastructure {
  private store: Map<string, PaymentExceptionDTO> = new Map();

  public async read(id: string): Promise<PaymentExceptionDTO | null> {
    await delay(100);
    return this.store.get(id) || null;
  }

  public async list(params: Record<string, any> = {}): Promise<PaginatedResult<PaymentExceptionDTO>> {
    await delay(150);
    let items = Array.from(this.store.values());

    if (params.businessCaseId) {
      items = items.filter(item => item.businessCaseId === params.businessCaseId);
    }
    if (params.status) {
      items = items.filter(item => item.status === params.status);
    }

    return { items, hasNext: false };
  }

  public async create(payload: Partial<PaymentExceptionDTO> | Omit<PaymentExceptionDTO, 'id'>): Promise<PaymentExceptionDTO> {
    await delay(200);
    // FIX: Safely extract 'id' if it exists to satisfy the TS compiler
    const payloadId = 'id' in payload ? (payload as any).id : undefined;
    const id = payloadId || `pe_mock_${Date.now()}`;
    
    const newException = { ...payload, id } as PaymentExceptionDTO;
    this.store.set(id, newException);
    
    console.log(`⚠️ [MockExceptionDB] Logged Payment Exception for Case ${newException.businessCaseId}: ${newException.reason}`);
    return newException;
  }

  public async update(id: string, payload: Partial<PaymentExceptionDTO>): Promise<PaymentExceptionDTO> {
    await delay(150);
    const existing = this.store.get(id);
    if (!existing) throw new Error(`Mock 404: Exception ${id} not found`);

    const updated: PaymentExceptionDTO = { 
      ...existing, 
      ...payload, 
      lastUpdated: Date.now(), 
      version: existing.version + 1,
    };
    
    this.store.set(id, updated);
    console.log(`✅ [MockExceptionDB] Exception ${id} resolved as ${updated.status}`);
    return updated;
  }
}
