import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api";
import type { 
  CreationDTO, 
  CreationArtifact, 
  CreationVision, 
  CreationPricingContext,
  CreationType
} from "./creation.types";
import type { BusinessCaseDTO } from "@/src/domains/business_case/businessCase.types";

export interface ICreationInfrastructure {
  // ==================================================================
  // 🔍 Lookup
  // ==================================================================
  getCreation(id: string): Promise<CreationDTO | null>;
  
  // Phase 5 Lookup: Check if user already ordered this (for upselling UI)
  getRelatedBusinessCases(creationId: string): Promise<BusinessCaseDTO[]>;

  // ==================================================================
  // 📥 Phase 1: Genesis & Assets
  // ==================================================================
  initializeCreation(payload: { name: string; type: CreationType }): Promise<CreationDTO>;
  renameCreation(id: string, name: string): Promise<CreationDTO>;
  addInputAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO>;
  replaceInputAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO>;

  // ==================================================================
  // 🤖 Phase 2: AI Vision & Rules
  // ==================================================================
  updateVision(id: string, vision: CreationVision): Promise<CreationDTO>;
  selectTemplate(id: string, groupTemplateId: string, templateId: string): Promise<CreationDTO>;

  // ==================================================================
  // 🎨 Phase 3 & 4: GPU Generation
  // ==================================================================
  triggerImagePreview(id: string, templateId: string): Promise<CreationDTO>;
  
  // NEW: Triggers a material-specific render of the physical 3D print
  trigger3DPrintImagePreview(id: string, templateId: string, print_style: string): Promise<CreationDTO>;
  
  trigger3DGeneration(id: string, templateId: string): Promise<CreationDTO>;
  skipPreview(id: string): Promise<CreationDTO>;

  // ==================================================================
  // 💰 Phase 5: Commerce
  // ==================================================================
  updatePricingContext(id: string, pricing: CreationPricingContext): Promise<CreationDTO>;
}

export class CreationInfrastructure 
  extends BaseInfrastructureApi<CreationDTO> 
  implements ICreationInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Registers with the base class: Domain "Creation", Path "/api/v1/creations"
    super("Creation", `${fastApiBaseUrl}/api/v1/creations`);
  }

  // ==================================================================
  // 🔍 Lookup
  // ==================================================================

  public async getCreation(id: string): Promise<CreationDTO | null> {
    // Leverages the built-in read() method from BaseInfrastructureApi
    return await this.read(id);
  }

  public async getRelatedBusinessCases(creationId: string): Promise<BusinessCaseDTO[]> {
    return await this.fetchJson<BusinessCaseDTO[]>(`${this.basePath}/${creationId}/business-cases`);
  }

  // ==================================================================
  // 📥 Phase 1: Genesis & Assets
  // ==================================================================

  public async initializeCreation(payload: { name: string; type: CreationType }): Promise<CreationDTO> {
    // Leverages the built-in create() method from BaseInfrastructureApi
    return await this.create(payload);
  }

  public async renameCreation(id: string, name: string): Promise<CreationDTO> {
    // Leverages the built-in update() method from BaseInfrastructureApi
    return await this.update(id, { name });
  }

  public async addInputAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/inputs`, {
      method: 'POST',
      body: JSON.stringify({ artifact })
    });
  }

  public async replaceInputAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/inputs`, {
      method: 'PUT',
      body: JSON.stringify({ artifact })
    });
  }

  // ==================================================================
  // 🤖 Phase 2: AI Vision & Rules
  // ==================================================================

  public async updateVision(id: string, vision: CreationVision): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/vision`, {
      method: 'PATCH',
      body: JSON.stringify({ vision })
    });
  }

  public async selectTemplate(id: string, groupTemplateId: string, templateId: string): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/template`, {
      method: 'PATCH',
      body: JSON.stringify({ groupTemplateId, templateId })
    });
  }

  // ==================================================================
  // 🎨 Phase 3 & 4: GPU Generation
  // ==================================================================

  public async triggerImagePreview(id: string, templateId: string): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/generate/image-preview`, {
      method: 'POST',
      body: JSON.stringify({ templateId })
    });
  }

  public async trigger3DPrintImagePreview(id: string, templateId: string, print_style: string): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/generate/3d-print-preview`, {
      method: 'POST',
      body: JSON.stringify({ templateId, print_style })
    });
  }

  public async trigger3DGeneration(id: string, templateId: string): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/generate/3d`, {
      method: 'POST',
      body: JSON.stringify({ templateId })
    });
  }

  public async skipPreview(id: string): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/skip-preview`, {
      method: 'POST'
    });
  }

  // ==================================================================
  // 💰 Phase 5: Commerce
  // ==================================================================

  public async updatePricingContext(id: string, pricing: CreationPricingContext): Promise<CreationDTO> {
    return await this.fetchJson<CreationDTO>(`${this.basePath}/${id}/pricing`, {
      method: 'PATCH',
      body: JSON.stringify({ pricingContext: pricing })
    });
  }
}
