-- Migration: Create media assets tables for centralized media library
-- Run this in Supabase SQL Editor

-- Create media_assets table (user's media library)
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cloudinary_public_id TEXT NOT NULL,
  cloudinary_url TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  filename TEXT,
  mime_type TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,

  -- Prevent duplicate uploads per user (same content hash)
  UNIQUE(user_id, content_hash)
);

-- Create media_asset_usages table (tracks which previews use which assets)
CREATE TABLE media_asset_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_asset_id UUID NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  preview_id UUID NOT NULL REFERENCES previews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Each asset can only be linked once per preview
  UNIQUE(media_asset_id, preview_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_media_assets_user ON media_assets(user_id);
CREATE INDEX idx_media_assets_hash ON media_assets(user_id, content_hash);
CREATE INDEX idx_media_assets_created ON media_assets(user_id, created_at DESC);
CREATE INDEX idx_media_usages_asset ON media_asset_usages(media_asset_id);
CREATE INDEX idx_media_usages_preview ON media_asset_usages(preview_id);

-- Enable Row Level Security
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_asset_usages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media_assets: Users can only access their own assets
CREATE POLICY "Users can view own media assets"
  ON media_assets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create media assets"
  ON media_assets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own media assets"
  ON media_assets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own media assets"
  ON media_assets FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for media_asset_usages: Users can manage usages for their own assets
CREATE POLICY "Users can view own media usages"
  ON media_asset_usages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM media_assets
      WHERE media_assets.id = media_asset_usages.media_asset_id
      AND media_assets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create media usages for own assets"
  ON media_asset_usages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM media_assets
      WHERE media_assets.id = media_asset_usages.media_asset_id
      AND media_assets.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own media usages"
  ON media_asset_usages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM media_assets
      WHERE media_assets.id = media_asset_usages.media_asset_id
      AND media_assets.user_id = auth.uid()
    )
  );

-- View for media assets with usage count (for easy querying)
CREATE OR REPLACE VIEW media_assets_with_usage AS
SELECT
  ma.*,
  COALESCE(COUNT(mau.id), 0)::INTEGER as usage_count
FROM media_assets ma
LEFT JOIN media_asset_usages mau ON ma.id = mau.media_asset_id
GROUP BY ma.id;

-- Grant access to the view
GRANT SELECT ON media_assets_with_usage TO authenticated;
