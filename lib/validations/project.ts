import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  deviceType: z.enum(["iphone", "android"], {
    message: "Please select a valid device type",
  }),
});

export const updateProjectSchema = createProjectSchema.partial().extend({
  id: z.string().uuid("Invalid project ID"),
});

export const projectIdSchema = z.object({
  id: z.string().uuid("Invalid project ID"),
});

export const saveCanvasSchema = z.object({
  projectId: z.string().uuid("Invalid project ID"),
  canvasJson: z.record(z.string(), z.unknown()).nullable(),
  imageUrls: z.array(z.string().url("Invalid image URL")).optional(),
  thumbnailUrl: z.string().url("Invalid thumbnail URL").optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdInput = z.infer<typeof projectIdSchema>;
export type SaveCanvasInput = z.infer<typeof saveCanvasSchema>;
