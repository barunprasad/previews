-- Migration: Add admin RLS policies
-- Run this in Supabase SQL Editor
-- This allows users with role='admin' in profiles table to read all data

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin policies for profiles table
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admin policies for projects table
CREATE POLICY "Admins can view all projects"
  ON projects FOR SELECT
  USING (is_admin());

-- Admin policies for previews table
CREATE POLICY "Admins can view all previews"
  ON previews FOR SELECT
  USING (is_admin());

-- Note: If you want admins to be able to update/delete all records,
-- add similar policies for UPDATE and DELETE operations
