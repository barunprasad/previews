-- Migration: Add user storage tracking for admin dashboard
-- Run this in Supabase SQL Editor

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create view for user storage summary (ADMIN ONLY)
-- Non-admins get empty results
CREATE OR REPLACE VIEW user_storage_summary AS
SELECT
  p.id as user_id,
  p.email,
  p.full_name,
  p.avatar_url,
  p.role,
  p.created_at,
  COALESCE(SUM(ma.size_bytes), 0)::BIGINT as storage_bytes,
  COUNT(DISTINCT ma.id)::INTEGER as asset_count,
  COUNT(DISTINCT proj.id)::INTEGER as project_count,
  COUNT(DISTINCT prev.id)::INTEGER as preview_count
FROM profiles p
LEFT JOIN media_assets ma ON p.id = ma.user_id
LEFT JOIN projects proj ON p.id = proj.user_id
LEFT JOIN previews prev ON p.id = prev.user_id
WHERE is_admin() = true
GROUP BY p.id, p.email, p.full_name, p.avatar_url, p.role, p.created_at;

-- Grant access to the view for authenticated users
GRANT SELECT ON user_storage_summary TO authenticated;

-- Admin RLS policy for viewing all media assets
-- First, check if policy exists and drop it
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'media_assets'
    AND policyname = 'Admins can view all media assets'
  ) THEN
    DROP POLICY "Admins can view all media assets" ON media_assets;
  END IF;
END $$;

CREATE POLICY "Admins can view all media assets"
  ON media_assets FOR SELECT
  USING (is_admin() = true);

-- Create view for media assets with user info (ADMIN ONLY)
-- Non-admins get empty results
CREATE OR REPLACE VIEW admin_media_assets AS
SELECT
  ma.id,
  ma.user_id,
  ma.cloudinary_public_id,
  ma.cloudinary_url,
  ma.content_hash,
  ma.filename,
  ma.mime_type,
  ma.size_bytes,
  ma.width,
  ma.height,
  ma.created_at,
  ma.last_used_at,
  p.email as user_email,
  p.full_name as user_name,
  COALESCE(COUNT(mau.id), 0)::INTEGER as usage_count
FROM media_assets ma
JOIN profiles p ON ma.user_id = p.id
LEFT JOIN media_asset_usages mau ON ma.id = mau.media_asset_id
WHERE is_admin() = true
GROUP BY ma.id, p.email, p.full_name;

-- Grant access to admin view
GRANT SELECT ON admin_media_assets TO authenticated;

-- Create index for faster storage aggregation queries
CREATE INDEX IF NOT EXISTS idx_media_assets_size ON media_assets(user_id, size_bytes);

-- Fix media_assets_with_usage view to respect user ownership
-- Users can only see their own assets (or admins can see all)
CREATE OR REPLACE VIEW media_assets_with_usage AS
SELECT
  ma.*,
  COALESCE(COUNT(mau.id), 0)::INTEGER as usage_count
FROM media_assets ma
LEFT JOIN media_asset_usages mau ON ma.id = mau.media_asset_id
WHERE ma.user_id = auth.uid() OR is_admin() = true
GROUP BY ma.id;
