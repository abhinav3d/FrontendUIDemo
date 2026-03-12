import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api";
import type { 
  TemplateListSnapshotDTO, 
  TemplateGroupDTO,
  TemplateDTO,
  ProductionCategory
} from "./template.types";

/**
 * The strict contract that the Service relies on.
 * Guarantees exactly 4 Storefront operations and 4 Admin operations.
 */
export interface ITemplateInfrastructure {
  // Storefront
  getCatalogSnapshot(): Promise<TemplateListSnapshotDTO>;
  getTemplateDetailBySlug(slug: string): Promise<TemplateListSnapshotDTO | null>;
  getTemplateById(templateId: string): Promise<TemplateDTO | null>;
  searchTemplates(params: { query?: string; category?: ProductionCategory }): Promise<TemplateGroupDTO[]>;
  
  // Admin
  createTemplateGroup(payload: Omit<TemplateGroupDTO, "id" | "version" | "createdAt" | "updatedAt">): Promise<TemplateGroupDTO>;
  updateTemplateGroup(id: string, payload: Partial<TemplateGroupDTO>): Promise<TemplateGroupDTO>;
  createTemplate(payload: Omit<TemplateDTO, "id" | "version" | "createdAt" | "updatedAt">): Promise<TemplateDTO>;
  updateTemplate(id: string, payload: Partial<TemplateDTO>): Promise<TemplateDTO>;
}

export class TemplateInfrastructure 
  extends BaseInfrastructureApi<any> 
  implements ITemplateInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Maps to your FastAPI backend route
    super("Template", `${fastApiBaseUrl}/api/v1/templates`);
  }

  // ==================================================================
  // 🛍️ STOREFRONT OPERATIONS (Read)
  // ==================================================================

  public async getCatalogSnapshot(): Promise<TemplateListSnapshotDTO> {
    return await this.fetchJson<TemplateListSnapshotDTO>(`${this.basePath}/catalog`);
  }

  public async getTemplateDetailBySlug(slug: string): Promise<TemplateListSnapshotDTO | null> {
    try {
      return await this.fetchJson<TemplateListSnapshotDTO>(`${this.basePath}/groups/slug/${slug}`);
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  }

  public async getTemplateById(templateId: string): Promise<TemplateDTO | null> {
    try {
      return await this.fetchJson<TemplateDTO>(`${this.basePath}/variants/${templateId}`);
    } catch (error: any) {
      if (error.message.includes('404')) return null;
      throw error;
    }
  }

  public async searchTemplates(params: { query?: string; category?: ProductionCategory }): Promise<TemplateGroupDTO[]> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append("query", params.query);
    if (params.category) searchParams.append("category", params.category);

    return await this.fetchJson<TemplateGroupDTO[]>(`${this.basePath}/search?${searchParams.toString()}`);
  }

  // ==================================================================
  // ⚙️ ADMIN OPERATIONS (Write)
  // ==================================================================

  public async createTemplateGroup(
    payload: Omit<TemplateGroupDTO, "id" | "version" | "createdAt" | "updatedAt">
  ): Promise<TemplateGroupDTO> {
    return await this.fetchJson<TemplateGroupDTO>(`${this.basePath}/groups`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  public async updateTemplateGroup(id: string, payload: Partial<TemplateGroupDTO>): Promise<TemplateGroupDTO> {
    return await this.fetchJson<TemplateGroupDTO>(`${this.basePath}/groups/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  }

  public async createTemplate(
    payload: Omit<TemplateDTO, "id" | "version" | "createdAt" | "updatedAt">
  ): Promise<TemplateDTO> {
    return await this.fetchJson<TemplateDTO>(`${this.basePath}/variants`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  public async updateTemplate(id: string, payload: Partial<TemplateDTO>): Promise<TemplateDTO> {
    return await this.fetchJson<TemplateDTO>(`${this.basePath}/variants/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload)
    });
  }
}
