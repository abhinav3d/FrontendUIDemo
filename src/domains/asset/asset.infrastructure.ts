import { BaseInfrastructureApi } from "@/src/core/base/base.infrastructure.api";
import { AssetDTO, AssetDomain } from "./asset.types";

/**
 * The strict contract for bridging the stateless Remix Edge to the FastAPI storage core.
 */
export interface IAssetInfrastructure {
  /**
   * 📤 Uploads a physical file through FastAPI for security scanning, 
   * optional AES-GCM encryption, and final cloud storage.
   */
  uploadAsset(
    file: File | Blob, 
    originalName: string, 
    domain: AssetDomain, 
    domainReferenceId: string,
    isPrivate: boolean
  ): Promise<AssetDTO>;

  /**
   * 🔍 Lookup an asset's metadata (Does not return the file bytes)
   */
  getAsset(id: string): Promise<AssetDTO | null>;

  /**
   * 🗑️ Deletes an asset from the database and triggers cloud storage cleanup
   */
  deleteAsset(id: string): Promise<boolean>;
}

export class AssetInfrastructure 
  extends BaseInfrastructureApi<AssetDTO> 
  implements IAssetInfrastructure 
{
  constructor(fastApiBaseUrl: string) {
    // Maps to your FastAPI backend route: /api/v1/assets
    super("Asset", `${fastApiBaseUrl}/api/v1/assets`);
  }

  // ==================================================================
  // 📤 UPLOAD (Custom FormData handling)
  // ==================================================================

  public async uploadAsset(
    file: File | Blob, 
    originalName: string, 
    domain: AssetDomain, 
    domainReferenceId: string,
    isPrivate: boolean
  ): Promise<AssetDTO> {
    const formData = new FormData();
    formData.append("file", file, originalName);
    formData.append("domain", domain);
    formData.append("domainReferenceId", domainReferenceId);
    formData.append("isPrivate", String(isPrivate));

    const response = await fetch(`${this.basePath}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`[AssetInfrastructure] Upload failed (${response.status}): ${errorText}`);
    }

    return (await response.json()) as AssetDTO;
  }

  // ==================================================================
  // 🔍 STANDARD OPERATIONS (Inherited from Base)
  // ==================================================================

  public async getAsset(id: string): Promise<AssetDTO | null> {
    return await this.read(id);
  }

  public async deleteAsset(id: string): Promise<boolean> {
    return await this.delete(id);
  }
}
