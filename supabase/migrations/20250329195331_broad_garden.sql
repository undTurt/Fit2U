/*
  # Initial Schema Setup for Fit2U

  1. New Tables
    - `profiles`
      - User profile information
      - Linked to auth.users
    - `clothing`
      - Clothing items
      - Stores metadata and image URLs
    - `outfits`
      - Outfit combinations
      - References clothing items
    - `outfit_items`
      - Junction table for outfits and clothing items

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create clothing table
CREATE TABLE IF NOT EXISTS clothing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  color text,
  season text[],
  occasion text[],
  image_url text NOT NULL,
  times_worn integer DEFAULT 0,
  cost decimal(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outfits table
CREATE TABLE IF NOT EXISTS outfits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  date date,
  occasion text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create outfit_items junction table
CREATE TABLE IF NOT EXISTS outfit_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outfit_id uuid REFERENCES outfits(id) ON DELETE CASCADE,
  clothing_id uuid REFERENCES clothing(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clothing ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_items ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view own clothing"
  ON clothing FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clothing"
  ON clothing FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clothing"
  ON clothing FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clothing"
  ON clothing FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own outfits"
  ON outfits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own outfits"
  ON outfits FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own outfit items"
  ON outfit_items FOR ALL
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id
      FROM outfits
      WHERE id = outfit_items.outfit_id
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_clothing_user_id ON clothing(user_id);
CREATE INDEX IF NOT EXISTS idx_outfits_user_id ON outfits(user_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_outfit_id ON outfit_items(outfit_id);
CREATE INDEX IF NOT EXISTS idx_outfit_items_clothing_id ON outfit_items(clothing_id);