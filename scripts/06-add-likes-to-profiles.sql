-- Add a `liked_artifacts` column to the `profiles` table.
-- This column will store an array of artifact IDs that the user has liked.
ALTER TABLE profiles
ADD COLUMN liked_artifacts TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create a function to toggle a liked artifact.
CREATE OR REPLACE FUNCTION toggle_like(artifact_id TEXT, user_id UUID)
RETURNS VOID AS $$
DECLARE
  is_liked BOOLEAN;
BEGIN
  -- Check if the artifact is already liked
  SELECT artifact_id = ANY(liked_artifacts) INTO is_liked
  FROM profiles
  WHERE id = user_id;

  IF is_liked THEN
    -- If liked, remove it from the array
    UPDATE profiles
    SET liked_artifacts = array_remove(liked_artifacts, artifact_id)
    WHERE id = user_id;
  ELSE
    -- If not liked, add it to the array
    UPDATE profiles
    SET liked_artifacts = array_append(liked_artifacts, artifact_id)
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;
