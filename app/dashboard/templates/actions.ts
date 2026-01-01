"use server";

import { createClient } from "@/lib/supabase/server";
import { getTemplateSetById } from "@/lib/templates";

export async function createProjectFromTemplateAction(
  templateSetId: string,
  projectName: string,
  _themeColor: string // Reserved for future use
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in" };
  }

  // Get template set
  const templateSet = getTemplateSetById(templateSetId);
  if (!templateSet) {
    return { error: "Template set not found" };
  }

  // Use original template colors - theme customization can be done in editor
  // const themedSet = applyThemeToTemplateSet(templateSet, themeColor);

  // Determine device type from template set
  const deviceType = templateSet.deviceType === "both" ? "iphone" : templateSet.deviceType;

  // Create project
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: projectName,
      description: `Created from "${templateSet.name}" template`,
      device_type: deviceType,
    })
    .select()
    .single();

  if (projectError) {
    return { error: projectError.message };
  }

  // Create previews from original templates (preserving designed colors)
  const previewsToInsert = templateSet.templates.map((template, idx) => ({
    project_id: project.id,
    user_id: user.id,
    name: template.name,
    sort_order: idx,
    canvas_json: template.canvasJson,
    background: template.background,
  }));

  const { error: previewsError } = await supabase
    .from("previews")
    .insert(previewsToInsert);

  if (previewsError) {
    // Cleanup: delete the project if previews failed
    await supabase.from("projects").delete().eq("id", project.id);
    return { error: `Failed to create previews: ${previewsError.message}` };
  }

  return { projectId: project.id };
}
