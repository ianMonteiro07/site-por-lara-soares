-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies (modify these for production!)
-- Allow public read access
CREATE POLICY "Public categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Allow authenticated users (or everyone for simple testing) to insert/update/delete
-- WARNING: This allows ANYONE to edit if you don't restrict it. 
-- For this demo, we'll allow all operations for now, but in a real app you'd check for admin role.
CREATE POLICY "Enable all access for now" ON categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Enable all access for now" ON products
  FOR ALL USING (true) WITH CHECK (true);
