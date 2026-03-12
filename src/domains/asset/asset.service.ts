import type { IAssetInfrastructure } from "./asset.infrastructure";
import { AssetDTO, AssetDomain } from "./asset.types";

export class AssetService {
  // 🔐 The Shared Secret: Passed in from the Factory, which gets it from your secure environment variables.
  constructor(
    private readonly infra: IAssetInfrastructure,
    private readonly drmSalt: string 
  ) {}

  // ==================================================================
  // 📤 UPLOAD
  // ==================================================================

  public async uploadFile(
    file: File, 
    domain: AssetDomain, 
    domainReferenceId: string, 
    isPrivate: boolean = true
  ): Promise<AssetDTO> {
    
    // 🛡️ Front-line validation to protect FastAPI from massive payloads
    const MAX_SIZE_MB = 100;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`File exceeds the ${MAX_SIZE_MB}MB limit.`);
    }

    return await this.infra.uploadAsset(file, file.name, domain, domainReferenceId, isPrivate);
  }

  // ==================================================================
  // 🪄 SECURE DELIVERY (The DRM Magic)
  // ==================================================================

  /**
   * Generates the deterministic AES-256 key matching the FastAPI backend.
   */
  private async deriveImplicitKey(assetId: string): Promise<CryptoKey> {
    const enc = new TextEncoder();
    const keyMaterial = enc.encode(`${assetId}:${this.drmSalt}`);
    
    // Hash the string to get exactly 32 bytes (256 bits)
    const hashBuffer = await crypto.subtle.digest("SHA-256", keyMaterial);
    
    // Convert the raw bytes into a CryptoKey object for AES-GCM
    return await crypto.subtle.importKey(
      "raw", 
      hashBuffer, 
      { name: "AES-GCM" }, 
      false, 
      ["decrypt"]
    );
  }

  /**
   * Evaluates the asset and returns a URL that the browser can actually render.
   */
  public async getRenderableUrl(asset: AssetDTO): Promise<string> {
    
    // ==========================================
    // SCENARIO 1 & 2: Public OR Private (Plaintext)
    // ==========================================
    if (!asset.isEncrypted) {
      return asset.url;
    }

    // ==========================================
    // SCENARIO 3: Encrypted (The DRM Magic)
    // ==========================================
    try {
      const encryptedResponse = await fetch(asset.url);
      if (!encryptedResponse.ok) throw new Error(`Failed to download encrypted asset: ${encryptedResponse.statusText}`);
      const fullBuffer = await encryptedResponse.arrayBuffer();

      const ivBuffer = fullBuffer.slice(0, 12);
      const ciphertextBuffer = fullBuffer.slice(12);

      const cryptoKey = await this.deriveImplicitKey(asset.id);

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        cryptoKey,
        ciphertextBuffer
      );

      const blob = new Blob([decryptedBuffer], { type: asset.mimeType });
      return URL.createObjectURL(blob);

    } catch (error) {
      console.error("[AssetService] Decryption failed:", error);
      throw new Error("Asset decryption failed. The file may be corrupted or unauthorized.");
    }
  }

  // ==================================================================
  // 🧹 MEMORY MANAGEMENT
  // ==================================================================

  public revokeUrl(url: string | null) {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }
}
