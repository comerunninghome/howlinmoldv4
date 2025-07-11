--
    -- RITUAL ARTIFACTS SCHEMA V1
    --
    -- This schema defines the core table for storing user-generated artifacts
    -- within the Howlin' Mold ecosystem. It includes Row-Level Security (RLS)
    -- to ensure data is properly isolated to the owning user.
    --

    -- 1. Create a custom ENUM type for the 'deck' column.
    -- This enforces that artifacts can only belong to one of the predefined decks.
    CREATE TYPE public.deck_type AS ENUM ('A', 'B', 'C', 'Vault');

    -- 2. Create the 'ritual_artifacts' table.
    -- This table will store the metadata for each artifact.
    CREATE TABLE public.ritual_artifacts (
        -- 'id' is the unique identifier for each artifact, generated automatically.
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

        -- 'user_id' links the artifact to a user in the Supabase auth system.
        -- It is non-nullable and has a foreign key constraint.
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

        -- 'title' is the name of the artifact.
        title text NOT NULL,

        -- 'artist' is the creator of the artifact's content.
        artist text,

        -- 'deck' categorizes the artifact into a specific collection.
        deck public.deck_type NOT NULL,

        -- 'tags' are user-defined labels for filtering and discovery.
        tags text[],

        -- 'dateCanonized' is the timestamp when the artifact was created.
        -- It defaults to the current time.
        "dateCanonized" timestamp with time zone DEFAULT now() NOT NULL,

        -- 'created_at' is another timestamp for tracking creation time.
        created_at timestamp with time zone DEFAULT now() NOT NULL
    );

    -- Add comments to the table and columns for clarity in database inspection tools.
    COMMENT ON TABLE public.ritual_artifacts IS 'Stores user-submitted ritual artifacts and their metadata.';
    COMMENT ON COLUMN public.ritual_artifacts.id IS 'Unique identifier for the artifact.';
    COMMENT ON COLUMN public.ritual_artifacts.user_id IS 'The user who owns this artifact.';
    COMMENT ON COLUMN public.ritual_artifacts.deck IS 'The deck this artifact belongs to (A, B, C, or Vault).';
    COMMENT ON COLUMN public.ritual_artifacts.dateCanonized IS 'Timestamp when the artifact was officially recognized or created.';


    -- 3. Enable Row-Level Security (RLS) on the table.
    -- This is a critical security step. Once enabled, no data can be accessed
    -- until a policy is created.
    ALTER TABLE public.ritual_artifacts ENABLE ROW LEVEL SECURITY;


    -- 4. Create RLS policies to control data access.
    -- This policy ensures that users can only perform operations on their own artifacts.
    CREATE POLICY "Users can manage their own artifacts"
    ON public.ritual_artifacts
    FOR ALL -- This policy applies to SELECT, INSERT, UPDATE, and DELETE
    TO authenticated -- This policy only applies to logged-in users
    USING ( auth.uid() = user_id ) -- The USING clause checks for read/update/delete operations.
    WITH CHECK ( auth.uid() = user_id ); -- The WITH CHECK clause checks for write/update operations.

    -- Add a policy to allow administrators to bypass RLS.
    -- This is useful for maintenance and moderation. Assumes a 'service_role' key is used.
    -- This policy is commented out by default but can be enabled if needed.
    /*
    CREATE POLICY "Admins can access all artifacts"
    ON public.ritual_artifacts
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
    */

    -- Grant usage for the new type to authenticated and anon roles
    GRANT USAGE ON TYPE public.deck_type TO authenticated;
    GRANT USAGE ON TYPE public.deck_type TO anon;

    -- Grant all permissions on the table to authenticated and anon roles
    -- RLS policies will enforce the actual data access rules.
    GRANT ALL ON TABLE public.ritual_artifacts TO authenticated;
    GRANT ALL ON TABLE public.ritual_artifacts TO anon;
