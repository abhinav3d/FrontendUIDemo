import type { ITemplateInfrastructure } from "./template.infrastructure";
import { 
  type TemplateListSnapshotDTO, 
  type TemplateGroupDTO,
  type TemplateDTO,
  type ProductionCategory,
  ExecutionMode,
  ExpectedOutput,
  InputType,
  GenerationPattern,
  ValidationStep,
  GenerationStepType
} from "./template.types";

// 📂 Direct import of the authoritative registry
import registry from "@/src/lib/backend/dummy/template-registry.json";

export class MockTemplateInfrastructure implements ITemplateInfrastructure {
  // In-memory state so Admin mutations work locally
  private groups: TemplateGroupDTO[];
  private templates: TemplateDTO[];

  constructor() {
    // Initialize state by parsing the JSON registry safely on startup
    this.groups = registry.groups.map(this.mapGroupDto);
    this.templates = registry.templates.map(this.mapTemplateDto);
  }

  // ==================================================================
  // 🛍️ STOREFRONT OPERATIONS (Read)
  // ==================================================================

  public async getCatalogSnapshot(): Promise<TemplateListSnapshotDTO> {
    await this.simulateLatency();
    return {
      groups: this.groups,
      templates: this.templates,
    };
  }

  public async getTemplateDetailBySlug(slug: string): Promise<TemplateListSnapshotDTO | null> {
    await this.simulateLatency();
    
    const slug_group = this.groups.find(g => g.slug === slug);
    if (!slug_group) return null;

    const groupTemplates = this.templates.filter(t => t.groupId === slug_group.id && t.isActive);

    return {
      groups:[slug_group],
      templates: groupTemplates
    };
  }

  public async getTemplateById(templateId: string): Promise<TemplateDTO | null> {
    await this.simulateLatency();
    return this.templates.find(t => t.id === templateId) || null;
  }

  public async searchTemplates(params: { query?: string; category?: ProductionCategory }): Promise<TemplateGroupDTO[]> {
    await this.simulateLatency();
    
    return this.groups.filter(group => {
      let matches = true;
      
      if (params.category) {
        matches = matches && group.productionCategories.includes(params.category);
      }
      if (params.query) {
        const lowerQuery = params.query.toLowerCase();
        matches = matches && (
          group.name.toLowerCase().includes(lowerQuery) || 
          group.description.toLowerCase().includes(lowerQuery)
        );
      }
      
      return matches;
    });
  }

  // ==================================================================
  // ⚙️ ADMIN OPERATIONS (Write - In Memory)
  // ==================================================================

  public async createTemplateGroup(payload: Omit<TemplateGroupDTO, "id" | "version" | "createdAt" | "updatedAt">): Promise<TemplateGroupDTO> {
    await this.simulateLatency();
    const newGroup: TemplateGroupDTO = {
      ...payload,
      id: `tg_mock_${Math.random().toString(36).substring(2, 9)}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  public async updateTemplateGroup(id: string, payload: Partial<TemplateGroupDTO>): Promise<TemplateGroupDTO> {
    await this.simulateLatency();
    const index = this.groups.findIndex(g => g.id === id);
    if (index === -1) throw new Error("Group not found in mock registry");
    
    this.groups[index] = { ...this.groups[index], ...payload, updatedAt: new Date().toISOString() };
    return this.groups[index];
  }

  public async createTemplate(payload: Omit<TemplateDTO, "id" | "version" | "createdAt" | "updatedAt">): Promise<TemplateDTO> {
    await this.simulateLatency();
    const newTemplate: TemplateDTO = {
      ...payload,
      id: `tmpl_mock_${Math.random().toString(36).substring(2, 9)}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.templates.push(newTemplate);
    return newTemplate;
  }

  public async updateTemplate(id: string, payload: Partial<TemplateDTO>): Promise<TemplateDTO> {
    await this.simulateLatency();
    const index = this.templates.findIndex(t => t.id === id);
    if (index === -1) throw new Error("Template not found in mock registry");
    
    this.templates[index] = { ...this.templates[index], ...payload, updatedAt: new Date().toISOString() };
    return this.templates[index];
  }

  // ==================================================================
  // 🛠️ UTILITIES
  // ==================================================================

  private async simulateLatency() {
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  private mapGroupDto(group: any): TemplateGroupDTO {
    return {
      ...group,
      generationPattern: group.generationPattern as GenerationPattern,
      executionMode: group.executionMode as ExecutionMode,
      productionCategories: group.productionCategories as ProductionCategory[],
      expectedOutputs: group.expectedOutputs as ExpectedOutput[],
      inputRequirements: group.inputRequirements.map((req: any) => ({
        ...req,
        type: req.type as InputType
      }))
    };
  }

  private mapTemplateDto(template: any): TemplateDTO {
    return {
      ...template,
      aiWorkflowSpec: template.aiWorkflowSpec ? {
        ...template.aiWorkflowSpec,
        validationSteps: template.aiWorkflowSpec.validationSteps as ValidationStep[],
        generationSteps: template.aiWorkflowSpec.generationSteps.map((step: any) => ({
          ...step,
          step: step.step as GenerationStepType
        }))
      } : undefined
    };
  }
}
