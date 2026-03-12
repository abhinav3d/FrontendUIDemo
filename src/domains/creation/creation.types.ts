import type { ExecutionMode } from "@/src/domains/template/template.types";

// ======================================================
// ENUM DEFINITIONS
// ======================================================

export enum CreationType {
  IMAGE_TO_3D_FULL_SYNTHESIS = "IMAGE_TO_3D_FULL_SYNTHESIS",
  IMAGE_TO_3D_FACE_REPLACEMENT = "IMAGE_TO_3D_FACE_REPLACEMENT",
  TEXT_TO_3D = "TEXT_TO_3D",
  TEXT_TO_VIDEO = "TEXT_TO_VIDEO",
  IMAGE_TO_VIDEO = "IMAGE_TO_VIDEO",
  MESH_TO_VIDEO = "MESH_TO_VIDEO",
  IMAGE_UPSCALE = "IMAGE_UPSCALE",
  SKETCH_TO_IMAGE = "SKETCH_TO_IMAGE",
  IMAGE_STYLIZATION = "IMAGE_STYLIZATION",
  MESH_REPAIR = "MESH_REPAIR",
}

export enum ArtifactType {
  MESH = "MESH",
  VIDEO = "VIDEO",
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  SKETCH = "SKETCH",
  DOCUMENT = "DOCUMENT",
}

// ======================================================
// SUPPORTING DTOs
// ======================================================

export interface CreationArtifact {
  id: string;
  label: string;
  type: ArtifactType;
  path: string; // The URL/Path managed by the AssetManagement domain
  createdAt: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CreationVision {
  subjectBox: BoundingBox | null;
  poseType: string | null;
  isSafe: boolean;
  detectedCount: number;
  subject: string;
}

export interface CreationTask {
  id: string;
  type: ArtifactType;
  originalTemplateId: string;
  finalTemplateId: string;
  pivotReason: string | null;
  isAutoPivoted: boolean;
  aiCost: number;
  createdAt: number;
}

export interface CreationPricingContext {
  productId: string;
  variantId: string;
  sku?: string;
  storePrice: number;
  storeCurrency: string;
  customerPrice: number;
  customerCurrency: string;
  capturedAt: number;
}

// ======================================================
// MAIN DOMAIN DTO
// ======================================================

/**
 * CreationDTO
 * The Authoritative Wire Format representing a User's Work-in-Progress draft.
 * Owned completely by the FastAPI backend.
 */
export interface CreationDTO {
  id: string;
  userId: string;
  name: string;
  type: CreationType;
  groupTemplateId: string;
  templateId: string;
  
  inputs: CreationArtifact[];
  outputs: CreationArtifact[];
  vision: CreationVision;
  tasks: CreationTask[];
  pricingContext: CreationPricingContext | null;
  executionMode: ExecutionMode;
  version: number;
  lastUpdated: number;
}

// ======================================================
// TYPE GUARDS
// ======================================================

export function isCreationDTO(value: unknown): value is CreationDTO {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    'type' in obj &&
    'vision' in obj &&
    Array.isArray(obj.inputs) &&
    typeof obj.version === 'number' &&
    typeof obj.lastUpdated === 'number'
  );
}
