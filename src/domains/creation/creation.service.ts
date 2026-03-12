import type { ICreationInfrastructure } from "./creation.infrastructure";
import type { 
  CreationDTO, 
  CreationArtifact, 
  CreationVision, 
  CreationPricingContext,
  CreationType
} from "./creation.types";
import { ArtifactType } from "./creation.types";

// Handoff imports
import { creationToBusinessCase } from "./creation.business.mapper";
import { type BusinessCaseDTO, BusinessCaseAction } from "@/src/domains/business_case/businessCase.types";

export class CreationService {
  constructor(private readonly infra: ICreationInfrastructure) {}

  // ==================================================================
  // 🔍 Lookup & State Helpers
  // ==================================================================

  public async getCreation(id: string): Promise<CreationDTO | null> {
    return await this.infra.getCreation(id);
  }

  public async getRelatedOrders(creationId: string): Promise<BusinessCaseDTO[]> {
    return await this.infra.getRelatedBusinessCases(creationId);
  }

  /**
   * Helper for the UI: Checks if the AI vision has finished analyzing the image.
   * Your Remix UI can poll `getCreation` and check this boolean to stop the loading spinner.
   */
  public isVisionReady(creation: CreationDTO): boolean {
    return creation.vision !== null && creation.vision.subject !== "unknown";
  }

  /**
   * Helper for the UI: Checks if the GPU has returned a generated preview.
   */
  public hasGeneratedPreview(creation: CreationDTO): boolean {
    return creation.outputs.some(out => out.type === ArtifactType.IMAGE && out.label.includes("Preview"));
  }

  // ==================================================================
  // 📥 Phase 1: Genesis & Assets
  // ==================================================================

  public async startNewCreation(name: string, type: CreationType): Promise<CreationDTO> {
    return await this.infra.initializeCreation({ name, type });
  }

  public async rename(id: string, name: string): Promise<CreationDTO> {
    if (!name.trim()) throw new Error("Creation name cannot be empty.");
    return await this.infra.renameCreation(id, name);
  }

  public async addAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO> {
    return await this.infra.addInputAsset(id, artifact);
  }

  public async replaceAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO> {
    return await this.infra.replaceInputAsset(id, artifact);
  }

  // ==================================================================
  // 🤖 Phase 2: AI Vision & Rules
  // ==================================================================

  public async updateVision(id: string, vision: CreationVision): Promise<CreationDTO> {
    return await this.infra.updateVision(id, vision);
  }

  public async assignTemplate(id: string, groupTemplateId: string, templateId: string): Promise<CreationDTO> {
    return await this.infra.selectTemplate(id, groupTemplateId, templateId);
  }

  // ==================================================================
  // 🎨 Phase 3 & 4: GPU Generation triggers
  // ==================================================================

  public async generateImagePreview(id: string, templateId: string): Promise<CreationDTO> {
    return await this.infra.triggerImagePreview(id, templateId);
  }

  public async generate3DPrintPreview(id: string, templateId: string, printStyle: string): Promise<CreationDTO> {
    return await this.infra.trigger3DPrintImagePreview(id, templateId, printStyle);
  }

  public async generate3DMesh(id: string, templateId: string): Promise<CreationDTO> {
    return await this.infra.trigger3DGeneration(id, templateId);
  }

  public async skipPreview(id: string): Promise<CreationDTO> {
    return await this.infra.skipPreview(id);
  }

  // ==================================================================
  // 💰 Phase 5: Commerce & Handoff
  // ==================================================================

  public async lockPricing(id: string, pricing: CreationPricingContext): Promise<CreationDTO> {
    return await this.infra.updatePricingContext(id, pricing);
  }

  /**
   * THE HANDOFF: Converts the finalized Creation into a Shopify-ready Business Case.
   * This bridges the gap between the Creation domain and Commerce domain.
   */
  public async finalizeToBusinessCase(
    creationId: string, 
    action: BusinessCaseAction, 
    discountPercentage: number = 0,
    productTitleOverride?: string
  ): Promise<BusinessCaseDTO> {
    
    // 1. Fetch the latest authoritative state from FastAPI
    const creation = await this.getCreation(creationId);
    if (!creation) throw new Error(`Creation ${creationId} not found.`);

    // 2. Validate that pricing was locked in during Phase 5
    if (!creation.pricingContext) {
      throw new Error(`Cannot finalize Creation ${creationId}: Missing pricing context. User must select a product variant first.`);
    }

    // 3. Map the Context to the options expected by your business mapper
    const mapperOptions = {
      productId: creation.pricingContext.productId,
      variantId: creation.pricingContext.variantId,
      productTitle: productTitleOverride || creation.name,
      price: creation.pricingContext.storePrice,
      currency: creation.pricingContext.storeCurrency
    };

    // 4. Execute your exact mathematical mapper
    return creationToBusinessCase(creation, action, discountPercentage, mapperOptions);
  }
}
