import type { ITemplateInfrastructure } from "./template.infrastructure";
import { 
  type TemplateListSnapshotDTO, 
  type TemplateGroupDTO,
  type TemplateDTO,
  type ProductionCategory,
  InputType
} from "./template.types";

export class TemplateService {
  constructor(private readonly infra: ITemplateInfrastructure) {}

  // ==================================================================
  // 🛍️ STOREFRONT OPERATIONS (Data Fetching)
  // ==================================================================

  public async getStorefrontCatalog(): Promise<TemplateListSnapshotDTO> {
    return await this.infra.getCatalogSnapshot();
  }

  public async getProductPageData(slug: string): Promise<TemplateListSnapshotDTO | null> {
    return await this.infra.getTemplateDetailBySlug(slug);
  }

  public async getTemplateVariant(templateId: string): Promise<TemplateDTO | null> {
    return await this.infra.getTemplateById(templateId);
  }

  public async searchCatalog(query?: string, category?: ProductionCategory): Promise<TemplateGroupDTO[]> {
    return await this.infra.searchTemplates({ query, category });
  }

  // ==================================================================
  // 🧠 BUSINESS LOGIC & VALIDATION (The "Brain")
  // ==================================================================

  /**
   * The Gatekeeper: Validates user-uploaded files against the Template Group's strict requirements.
   * This runs before you ever let the user click "Checkout" or spend AI Coins.
   */
  public validateInputRequirements(
    requirements: TemplateGroupDTO['inputRequirements'],
    uploadedFiles: Array<{ mimeType: string; sizeMB: number }>
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const req of requirements) {
      // Find files matching the required input type (Image, Video, etc.)
      const matchingFiles = uploadedFiles.filter(f => this.isMimeTypeMatchingInput(f.mimeType, req.type));
      
      // 1. Check Required Status
      if (req.required && matchingFiles.length === 0) {
        errors.push(`Missing required input: ${req.type}`);
        continue;
      }

      // 2. Check Constraints
      if (matchingFiles.length > 0 && req.constraints) {
        const { minCount, maxCount, maxFileSizeMB } = req.constraints;

        if (minCount && matchingFiles.length < minCount) {
          errors.push(`Not enough files for ${req.type}. Minimum required: ${minCount}`);
        }
        
        if (!req.multipleAllowed && matchingFiles.length > 1) {
          errors.push(`Multiple files not allowed for ${req.type}`);
        }
        
        if (maxCount && matchingFiles.length > maxCount) {
          errors.push(`Too many files for ${req.type}. Maximum allowed: ${maxCount}`);
        }
        
        if (maxFileSizeMB && matchingFiles.some(f => f.sizeMB > maxFileSizeMB)) {
          errors.push(`One or more files exceed the maximum size of ${maxFileSizeMB}MB for ${req.type}`);
        }
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Helper to map raw browser mime-types to your clean Domain InputTypes.
   */
  private isMimeTypeMatchingInput(mimeType: string, inputType: string): boolean {
    if (inputType === InputType.IMAGE) return mimeType.startsWith('image/');
    if (inputType === InputType.VIDEO) return mimeType.startsWith('video/');
    if (inputType === InputType.AUDIO) return mimeType.startsWith('audio/');
    if (inputType === InputType.MESH) return mimeType.includes('model') || mimeType.includes('octet-stream'); 
    return false;
  }

  // ==================================================================
  // ⚙️ ADMIN OPERATIONS (Mutations)
  // ==================================================================

  public async createGroup(payload: Omit<TemplateGroupDTO, "id" | "version" | "createdAt" | "updatedAt">) {
    if (!payload.name || !payload.slug) {
      throw new Error("[TemplateService] Validation Failed: Group name and slug are strictly required.");
    }
    return await this.infra.createTemplateGroup(payload);
  }

  public async updateGroup(id: string, payload: Partial<TemplateGroupDTO>) {
    return await this.infra.updateTemplateGroup(id, payload);
  }

  public async createVariant(payload: Omit<TemplateDTO, "id" | "version" | "createdAt" | "updatedAt">) {
    if (payload.aiCoinCost < 0) {
      throw new Error("[TemplateService] Validation Failed: AI Coin cost cannot be a negative number.");
    }
    return await this.infra.createTemplate(payload);
  }

  public async updateVariant(id: string, payload: Partial<TemplateDTO>) {
    return await this.infra.updateTemplate(id, payload);
  }
}
