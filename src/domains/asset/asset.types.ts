// ======================================================
// ENUM DEFINITIONS
// ======================================================

/**
 * 🗂️ AssetDomain
 * Organizes files into distinct buckets/folders so your storage 
 * doesn't become a chaotic dumping ground. Crucial for garbage collection.
 */
export enum AssetDomain {
  CREATION = "CREATION",                 // Work-in-progress user uploads & generated meshes
  BUSINESS_CASE = "BUSINESS_CASE",       // Finalized assets attached to a paid order
  WORKORDER = "WORKORDER",               // 🏭 Factory floor outputs, debug renders, or artist revisions
  TEMPLATE_PUBLIC = "TEMPLATE_PUBLIC",   // Public storefront thumbnails & examples
  USER_PROFILE = "USER_PROFILE"          // Avatars, etc.
}

/**
 * 🏷️ AssetCategory
 * Categorizes the file for UI rendering logic (e.g., should we render 
 * an <img> tag, a <video> tag, or a <model-viewer> tag?)
 */
export enum AssetCategory {
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  MESH = "MESH",         // .glb, .obj
  DOCUMENT = "DOCUMENT", // .pdf invoices, receipts
  UNKNOWN = "UNKNOWN"
}

// ======================================================
// MAIN DOMAIN DTO
// ======================================================

/**
 * AssetDTO
 * Represents the metadata of a file. The actual bytes are managed by FastAPI.
 */
export interface AssetDTO {
  id: string;
  domain: AssetDomain;
  domainReferenceId: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  category: AssetCategory;
  url: string;               
  
  isPrivate: boolean;   // True if the URL is a temporary Signed URL
  isEncrypted: boolean; // 🔐 True if the file bytes are AES-GCM scrambled
  
  createdAt: number;
}

// ======================================================
// TYPE GUARDS
// ======================================================

export function isAssetDTO(value: unknown): value is AssetDTO {
  if (typeof value !== "object" || value === null) return false;
  const obj = value as Record<string, unknown>;
  
  return (
    typeof obj.id === 'string' &&
    typeof obj.domain === 'string' &&
    typeof obj.domainReferenceId === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.isPrivate === 'boolean' &&
    typeof obj.isEncrypted === 'boolean'
  );
}
