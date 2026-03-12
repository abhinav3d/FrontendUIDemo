// ======================================================
// TEMPLATE DOMAIN — CANONICAL DTO TYPES
// ======================================================

// ------------------------------------------------------
// ENUM DEFINITIONS (Runtime Safe + Type Safe)
// ------------------------------------------------------

export const ExecutionMode = {
  AI_ONLY: "AI_ONLY",
  AI_PLUS_ARTIST: "AI_PLUS_ARTIST",
  ARTIST_ONLY: "ARTIST_ONLY",
} as const;
export type ExecutionMode = typeof ExecutionMode[keyof typeof ExecutionMode];

export const ProductionCategory = {
  DIGITAL_3D: "DIGITAL_3D",
  PRINTED_3D: "PRINTED_3D",
  AI_VIDEO: "AI_VIDEO",
  MODEL_REPAIR: "MODEL_REPAIR",
  TEXT_TO_3D: "TEXT_TO_3D",
  TEXT_TO_VIDEO: "TEXT_TO_VIDEO",
} as const;
export type ProductionCategory = typeof ProductionCategory[keyof typeof ProductionCategory];

export const ExpectedOutput = {
  AI_DIGITAL_ASSET: "AI_DIGITAL_ASSET",
  MANUAL_DIGITAL_ASSET: "MANUAL_DIGITAL_ASSET",
  PHYSICAL_3D_PRINT: "PHYSICAL_3D_PRINT",
  VIDEO_FILE: "VIDEO_FILE",
  REPAIRED_MESH: "REPAIRED_MESH",
} as const;
export type ExpectedOutput = typeof ExpectedOutput[keyof typeof ExpectedOutput];

export const InputType = {
  IMAGE: "IMAGE",
  MESH: "MESH",
  TEXT: "TEXT",
  AUDIO: "AUDIO",
  VIDEO: "VIDEO",
  REFERENCE_OBJECT: "REFERENCE_OBJECT",
} as const;
export type InputType = typeof InputType[keyof typeof InputType];

export const ValidationStep = {
  NSFW_CHECK: "NSFW_CHECK",
  BACKGROUND_REMOVAL: "BACKGROUND_REMOVAL",
  OBJECT_DETECTION: "OBJECT_DETECTION",
  FACE_DETECTION: "FACE_DETECTION",
  MESH_VALIDATION: "MESH_VALIDATION",
  RESOLUTION_CHECK: "RESOLUTION_CHECK",
} as const;
export type ValidationStep = typeof ValidationStep[keyof typeof ValidationStep];

export const PreprocessingStep = {
  AUTO_CROP: "AUTO_CROP",
  COLOR_NORMALIZATION: "COLOR_NORMALIZATION",
  DEPTH_ESTIMATION: "DEPTH_ESTIMATION",
  POSE_ESTIMATION: "POSE_ESTIMATION",
} as const;
export type PreprocessingStep = typeof PreprocessingStep[keyof typeof PreprocessingStep];

export const GenerationPattern = {
  IMAGE_TO_3D_FULL_SYNTHESIS: "IMAGE_TO_3D_FULL_SYNTHESIS",
  IMAGE_TO_3D_FACE_REPLACEMENT: "IMAGE_TO_3D_FACE_REPLACEMENT",
  TEXT_TO_3D: "TEXT_TO_3D",
  TEXT_TO_VIDEO: "TEXT_TO_VIDEO",
  IMAGE_TO_VIDEO: "IMAGE_TO_VIDEO",
  MESH_TO_VIDEO: "MESH_TO_VIDEO",
  IMAGE_UPSCALE: "IMAGE_UPSCALE",
  MEDIA_GENERATION: "MEDIA_GENERATION",
  IMAGE_STYLIZATION: "IMAGE_STYLIZATION",
  MANUAL_ONLY: "MANUAL_ONLY",
} as const;
export type GenerationPattern = typeof GenerationPattern[keyof typeof GenerationPattern];

export const GenerationStepType = {
  IMAGE_TO_3D: "IMAGE_TO_3D",
  TEXT_TO_3D: "TEXT_TO_3D",
  IMAGE_TO_VIDEO: "IMAGE_TO_VIDEO",
  MESH_TO_VIDEO: "MESH_TO_VIDEO",
  STYLE_TRANSFER: "STYLE_TRANSFER",
  UPSCALE: "UPSCALE",
  FACE_REPLACEMENT: "FACE_REPLACEMENT",
} as const;
export type GenerationStepType = typeof GenerationStepType[keyof typeof GenerationStepType];  

export const PostProcessingStep = {
  MESH_SMOOTHING: "MESH_SMOOTHING",
  DECIMATION: "DECIMATION",
  TEXTURE_BAKE: "TEXTURE_BAKE",
  FORMAT_CONVERSION: "FORMAT_CONVERSION",
} as const;
export type PostProcessingStep = typeof PostProcessingStep[keyof typeof PostProcessingStep];

// ------------------------------------------------------
// SUPPORTING DTOs
// ------------------------------------------------------

export interface InputRequirementDTO {
  type: InputType;
  required: boolean;
  multipleAllowed?: boolean;
  constraints?: {
    minCount?: number;
    maxCount?: number;
    minResolution?: string;
    maxFileSizeMB?: number;
    acceptedFormats?: string[];
  };
}

export interface AIWorkflowSpecDTO {
  inputPolicy?: {
    minImages?: number;
    maxImages?: number;
    subject?:string;
    allowTextPrompt?: boolean;
    allowReferenceObject?: boolean;
  };
  validationSteps?: ValidationStep[];
  preprocessingSteps?: PreprocessingStep[];
  generationSteps: Array<{
    step: GenerationStepType;
    modelProfile: string;
  }>;
  postProcessingSteps?: PostProcessingStep[];
  failurePolicy?: {
    onNSFW?: "REJECT" | "REDIRECT_TO_SERVICE";
    onLowResolution?: "REJECT" | "AUTO_UPSCALE";
    onMultipleFaces?: "REJECT" | "ALLOW_WITH_SELECTION";
  };
}

// ------------------------------------------------------
// MAIN DOMAIN DTOs
// ------------------------------------------------------

export interface TemplateDTO {
  id: string;
  name: string;
  thumbnailUrl: string; // Path: public/media/<uuid>/preview.jpg
  groupId: string;

  styleKey: string;
  styleDisplayName: string;

  shopifyProductId: string; // Commercial identity moved here
  shopifyVariantId?: string;

  aiCoinCost: number; // 0 for manual/NSFW fallbacks
  aiCoinCurrency?: "AI_COIN";

  aiWorkflowSpec?: AIWorkflowSpecDTO;

  artistScope?: {
    estimatedTurnaroundDays?: number;
    includedServices?: string[];
  };

  configurableOptions: Array<{
    key: string;
    type: "select" | "boolean" | "number" | "text";
    values?: string[];
  }>;

  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateGroupDTO {
  id: string;
  slug: string;
  templateUrl: string;
  thumbnailUrl:string;
  name: string;
  description: string;

  generationPattern: GenerationPattern;
  executionMode: ExecutionMode;

  productionCategories: ProductionCategory[];
  expectedOutputs: ExpectedOutput[];
  inputRequirements: InputRequirementDTO[];

  supportsVariants: boolean;
  isQuoteRequired: boolean;
  allowsUpgradeToArtist: boolean;

  isPromoted: boolean;
  promotionPriority?: number;

  styleTemplateIds: string[];
  defaultStyleTemplateId: string;

  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateListSnapshotDTO {
  groups: TemplateGroupDTO[];
  templates: TemplateDTO[];
}
