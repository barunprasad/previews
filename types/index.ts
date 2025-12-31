// User & Auth Types
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  canvasJson: Record<string, unknown> | null;
  thumbnailUrl: string | null;
  imageUrls: string[];
  deviceType: DeviceType;
  createdAt: string;
  updatedAt: string;
}

export type DeviceType = "iphone" | "android";

// Device Frame Types
export interface DeviceFrame {
  id: string;
  name: string;
  type: DeviceType;
  width: number;
  height: number;
  screenX: number;
  screenY: number;
  screenWidth: number;
  screenHeight: number;
  svgPath: string;
  exportSizes: ExportSize[];
}

export interface ExportSize {
  width: number;
  height: number;
  label: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

// Form State Types
export interface ActionState {
  error?: string;
  success?: boolean;
  message?: string;
  data?: Record<string, unknown>;
}

// Cloudinary Types
export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

// Editor Types
export interface EditorState {
  selectedDevice: DeviceFrame | null;
  zoom: number;
  isDirty: boolean;
  isLoading: boolean;
  error: string | null;
}

// Canvas Object Types (for Fabric.js serialization)
export interface CanvasObject {
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  angle: number;
  [key: string]: unknown;
}

export interface CanvasState {
  version: string;
  objects: CanvasObject[];
  background?: string;
}
