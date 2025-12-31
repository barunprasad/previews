-- Migration: Create previews table
-- Run this in Supabase SQL Editor

-- Create previews table
CREATE TABLE previews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id),
  name text NOT NULL DEFAULT 'Preview',
  canvas_json jsonb,
  background text,
  thumbnail_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX previews_project_id_idx ON previews(project_id);
CREATE INDEX previews_user_id_idx ON previews(user_id);
CREATE INDEX previews_sort_order_idx ON previews(project_id, sort_order);

-- Enable Row Level Security
ALTER TABLE previews ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own previews
CREATE POLICY "Users can view own previews"
  ON previews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create previews"
  ON previews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own previews"
  ON previews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own previews"
  ON previews FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_previews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER previews_updated_at
  BEFORE UPDATE ON previews
  FOR EACH ROW
  EXECUTE FUNCTION update_previews_updated_at();

-- Migration: Create initial previews from existing projects
-- This moves canvas_json, background, and thumbnail_url to a new preview for each project
INSERT INTO previews (project_id, user_id, name, canvas_json, background, thumbnail_url, sort_order)
SELECT
  id as project_id,
  user_id,
  'Preview 1' as name,
  canvas_json,
  background,
  thumbnail_url,
  0 as sort_order
FROM projects
WHERE canvas_json IS NOT NULL OR thumbnail_url IS NOT NULL;
