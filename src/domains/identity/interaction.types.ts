/**
 * DeviceType Enum
 * Categorization for client hardware telemetry.
 */
export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  UNKNOWN = 'unknown',
}

/**
 * CustomerInformationPayload
 * The environmental and hardware context of the client.
 */
export interface CustomerInformationPayload {
  ip: string;
  timezone: string;
  deviceType: DeviceType;
  screenWidth: number;
  screenHeight: number;
  hasTouch: boolean;
}

/**
 * InteractionDTO
 * The authoritative wire format and persistence shape.
 * Used for both the Request body to FastAPI and Dexie storage.
 */
export interface InteractionDTO {
  version: number;
  lastUpdated: number;
  interactionId: string; 
  payload: CustomerInformationPayload;
}

/**
 * InteractionResponse
 * The server's reply structure after validation/creation.
 */
export interface InteractionResponse {
  interactionId: string;        // The authoritative ID (potentially new)
  version: number;              // Current server version
  lastUpdated: number;          // Server-side heartbeat
  originalInteractionId: string; // The ID the client originally sent
  isNewId: boolean;             // Flag to trigger local session key update
}
