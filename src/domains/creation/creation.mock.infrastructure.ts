import type { ICreationInfrastructure } from "./creation.infrastructure";
import { 
  type CreationDTO, 
  type CreationArtifact, 
  type CreationVision, 
  type CreationPricingContext,
  CreationType,
  ArtifactType
} from "./creation.types";
import { ExecutionMode } from "@/src/domains/template/template.types";
import type { BusinessCaseDTO } from "@/src/domains/business_case/businessCase.types";

export class MockCreationInfrastructure implements ICreationInfrastructure {
  private creations: Map<string, CreationDTO> = new Map();

  constructor() {
    this.seed();
  }

  private seed() {
    const mockCreation: CreationDTO = {
      id: "creation_001",
      userId: "2c8261b4-5ab3-4df3-b48d-e4b7305716cb",
      name: "My Cyberpunk Dog",
      type: CreationType.IMAGE_TO_3D_FULL_SYNTHESIS,
      groupTemplateId: "gid://shopify/Collection/479045746916",
      templateId: "gid://shopify/Product/8934238028004",
      inputs: [
        {
          id: "asset_001",
          label: "Input Image",
          type: ArtifactType.IMAGE,
          path: "https://picsum.photos/seed/dog/800/800",
          createdAt: Date.now()
        }
      ],
      outputs: [],
      vision: {
        subjectBox: { x: 100, y: 100, width: 600, height: 600 },
        poseType: "standing",
        isSafe: true,
        detectedCount: 1,
        subject: "pet"
      },
      tasks: [],
      pricingContext: null,
      executionMode: ExecutionMode.AI_PLUS_ARTIST,
      version: 1,
      lastUpdated: Date.now()
    };

    this.creations.set(mockCreation.id, mockCreation);
  }

  public async getCreation(id: string): Promise<CreationDTO | null> {
    return this.creations.get(id) || null;
  }

  public async getRelatedBusinessCases(creationId: string): Promise<BusinessCaseDTO[]> {
    return [];
  }

  public async initializeCreation(payload: { name: string; type: CreationType }): Promise<CreationDTO> {
    const newCreation: CreationDTO = {
      id: `creation_${Math.random().toString(36).substring(2, 9)}`,
      userId: "2c8261b4-5ab3-4df3-b48d-e4b7305716cb",
      name: payload.name,
      type: payload.type,
      groupTemplateId: "",
      templateId: "",
      inputs: [],
      outputs: [],
      vision: {
        subjectBox: null,
        poseType: null,
        isSafe: true,
        detectedCount: 0,
        subject: "unknown"
      },
      tasks: [],
      pricingContext: null,
      executionMode: ExecutionMode.AI_ONLY,
      version: 1,
      lastUpdated: Date.now()
    };
    this.creations.set(newCreation.id, newCreation);
    return newCreation;
  }

  public async renameCreation(id: string, name: string): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.name = name;
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async addInputAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.inputs.push(artifact);
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async replaceInputAsset(id: string, artifact: CreationArtifact): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.inputs = [artifact];
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async updateVision(id: string, vision: CreationVision): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.vision = vision;
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async selectTemplate(id: string, groupTemplateId: string, templateId: string): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.groupTemplateId = groupTemplateId;
    creation.templateId = templateId;
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async triggerImagePreview(id: string, templateId: string): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    
    // Simulate GPU generation
    creation.outputs.push({
      id: `out_${Math.random().toString(36).substring(2, 9)}`,
      label: "AI Preview",
      type: ArtifactType.IMAGE,
      path: "https://picsum.photos/seed/preview/800/800",
      createdAt: Date.now()
    });
    
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async trigger3DPrintImagePreview(id: string, templateId: string, print_style: string): Promise<CreationDTO> {
    return this.triggerImagePreview(id, templateId);
  }

  public async trigger3DGeneration(id: string, templateId: string): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    
    creation.outputs.push({
      id: `out_${Math.random().toString(36).substring(2, 9)}`,
      label: "3D Mesh",
      type: ArtifactType.MESH,
      path: "/models/mock_mesh.glb",
      createdAt: Date.now()
    });
    
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async skipPreview(id: string): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.lastUpdated = Date.now();
    return creation;
  }

  public async updatePricingContext(id: string, pricing: CreationPricingContext): Promise<CreationDTO> {
    const creation = this.creations.get(id);
    if (!creation) throw new Error("Creation not found");
    creation.pricingContext = pricing;
    creation.lastUpdated = Date.now();
    return creation;
  }
}
