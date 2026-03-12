import { AssetDTO, AssetDomain } from "./asset.types";
import { AssetCategory } from "./asset.types";
import type { IAssetInfrastructure } from "./asset.infrastructure";

/**
 * 🧪 MockAssetInfrastructure
 * In-memory implementation of the Asset Infrastructure for local development.
 */
export class MockAssetInfrastructure implements IAssetInfrastructure {
  private assets: Map<string, AssetDTO> = new Map();

  constructor() {
    // Seed with some relational mock data
    this.seed();
  }

  private seed() {
    const mockAssets: AssetDTO[] = [
      {
        id: "asset_001",
        domain: AssetDomain.TEMPLATE_PUBLIC,
        domainReferenceId: "template_cyber_punk",
        originalName: "cyber_hero.glb",
        mimeType: "model/gltf-binary",
        sizeBytes: 1024 * 1024 * 5,
        category: AssetCategory.MESH,
        url: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
        isPrivate: false,
        isEncrypted: false,
        createdAt: Date.now()
      },
      {
        id: "asset_002",
        domain: AssetDomain.CREATION,
        domainReferenceId: "creation_user_123",
        originalName: "my_scan.jpg",
        mimeType: "image/jpeg",
        sizeBytes: 1024 * 500,
        category: AssetCategory.IMAGE,
        url: "https://picsum.photos/seed/asset002/800/800",
        isPrivate: true,
        isEncrypted: false,
        createdAt: Date.now()
      },
      {
        id: "asset_003",
        domain: AssetDomain.BUSINESS_CASE,
        domainReferenceId: "order_999",
        originalName: "final_render.png",
        mimeType: "image/png",
        sizeBytes: 1024 * 1024 * 2,
        category: AssetCategory.IMAGE,
        url: "https://picsum.photos/seed/asset003/800/800",
        isPrivate: true,
        isEncrypted: true, // Mocking an encrypted asset
        createdAt: Date.now()
      }
    ];

    mockAssets.forEach(asset => this.assets.set(asset.id, asset));
  }

  public async uploadAsset(
    file: File | Blob, 
    originalName: string, 
    domain: AssetDomain, 
    domainReferenceId: string,
    isPrivate: boolean
  ): Promise<AssetDTO> {
    const id = `asset_mock_${Math.random().toString(36).substr(2, 9)}`;
    
    // Determine category from mimeType
    let category = AssetCategory.UNKNOWN;
    const type = file.type;
    if (type.startsWith('image/')) category = AssetCategory.IMAGE;
    else if (type.startsWith('video/')) category = AssetCategory.VIDEO;
    else if (type.includes('model/') || originalName.endsWith('.glb')) category = AssetCategory.MESH;

    const newAsset: AssetDTO = {
      id,
      domain,
      domainReferenceId,
      originalName,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      category,
      url: URL.createObjectURL(file), // Local blob URL for mock
      isPrivate,
      isEncrypted: false,
      createdAt: Date.now()
    };

    this.assets.set(id, newAsset);
    return newAsset;
  }

  public async getAsset(id: string): Promise<AssetDTO | null> {
    return this.assets.get(id) || null;
  }

  public async deleteAsset(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }
}
