-- Enable Row Level Security on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert records
CREATE POLICY "Allow authenticated inserts"
ON products
FOR INSERT
TO authenticated
USING (true);
