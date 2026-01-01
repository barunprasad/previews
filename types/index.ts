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

// Preview Types (each project can have up to 10 previews)
export interface Preview {
  id: string;
  projectId: string;
  userId: string;
  name: string;
  canvasJson: Record<string, unknown> | null;
  background: string | null;
  thumbnailUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Project Types
export interface Project {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  // Legacy fields - kept for backward compatibility during migration
  canvasJson: Record<string, unknown> | null;
  thumbnailUrl: string | null;
  imageUrls: string[];
  background: string | null;
  // Shared settings
  deviceType: DeviceType;
  // Previews - loaded separately
  previews?: Preview[];
  createdAt: string;
  updatedAt: string;
}

export type DeviceType = "iphone" | "android";

// Maximum previews per project
export const MAX_PREVIEWS_PER_PROJECT = 10;

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

// Template Types
export type TemplateCategory =
  | "minimal"
  | "gradient"
  | "showcase"
  | "device-showcase"
  | "feature-callout"
  | "dual-device";

export type TemplateSetCategory =
  | "app-store-starter"
  | "feature-focused"
  | "onboarding-flow"
  | "minimal-clean";

// App Store category for filtering templates
export type AppStoreCategory =
  | "ecommerce"
  | "finance"
  | "social-networking"
  | "shopping"
  | "productivity"
  | "health-fitness"
  | "entertainment"
  | "education"
  | "travel"
  | "utilities";

// Placeholder image metadata
export interface PlaceholderImage {
  id: string;
  name: string;
  url: string; // Path in /public/placeholders/
  slot: "primary" | "secondary";
}

// Metadata for replaceable canvas objects
export interface PlaceholderData {
  isPlaceholder: boolean;
  placeholderId: string;
  replacementSlot: "primary" | "secondary";
}

// Single preview template
export interface PreviewTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  deviceType: DeviceType | "both";
  background: string;
  canvasJson: Record<string, unknown>;
  placeholders?: PlaceholderImage[];
  thumbnailUrl?: string;
}

// Template set = coordinated multi-preview design
export interface TemplateSet {
  id: string;
  name: string;
  description: string;
  category: TemplateSetCategory;
  appStoreCategories: AppStoreCategory[]; // For filtering by app type
  deviceType: DeviceType | "both";
  previewCount: number;
  templates: PreviewTemplate[];
  designTokens: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    fontFamily: string;
  };
  thumbnailUrl?: string;
  tags: string[];
}
