# Supabase Setup Guide - Kunstlabor Fundraising Platform

This document contains the complete SQL setup for the Kunstlabor fundraising platform database. **All SQL commands must be executed manually in the Supabase dashboard SQL editor.**

---

## 1. Schema Changes

### Add New Columns to Donations Table

The `donations` table currently has: `id`, `donor_name`, `amount`, `message`, `created_at`

Execute the following ALTER TABLE statements to add the 4 new columns:

```sql
-- Add generation column (G1-G45 identifier)
ALTER TABLE donations
ADD COLUMN generation text;

-- Add screenshot_url column (proof of donation)
ALTER TABLE donations
ADD COLUMN screenshot_url text;

-- Add status column (donation lifecycle: pending, confirmed, rejected)
ALTER TABLE donations
ADD COLUMN status text DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected'));

-- Add commitment_type column (payment method type)
ALTER TABLE donations
ADD COLUMN commitment_type text DEFAULT 'transfer';
```

### Verify Schema Changes

After running the ALTER TABLE statements, verify the new columns exist:

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'donations'
ORDER BY ordinal_position;
```

Expected output should include:
- `generation` (text, nullable)
- `screenshot_url` (text, nullable)
- `status` (text, default: 'pending')
- `commitment_type` (text, default: 'transfer')

---

## 2. RLS Policies

### Enable RLS on Donations Table

```sql
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
```

### Create INSERT Policy (Allow Anonymous Users to Create Donations)

```sql
CREATE POLICY "Allow anonymous insert on donations"
ON donations
FOR INSERT
WITH CHECK (true);
```

### Create SELECT Policy (Allow Public Read Access)

```sql
CREATE POLICY "Allow public select on donations"
ON donations
FOR SELECT
USING (true);
```

### Verify RLS Policies

Check that RLS is enabled and policies are created:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'donations';

-- List all policies on donations table
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'donations';
```

Expected output:
- `rowsecurity` should be `true`
- Two policies should exist: "Allow anonymous insert on donations" and "Allow public select on donations"

---

## 3. Storage Setup

### Create Screenshots Bucket

Create a public storage bucket for donation proof screenshots:

```sql
-- Insert new bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true);
```

### Create Storage RLS Policies

#### Allow Anonymous Users to Upload Screenshots

```sql
CREATE POLICY "Allow anonymous upload to screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'screenshots'
  AND auth.role() = 'anon'
);
```

#### Allow Public Read Access to Screenshots

```sql
CREATE POLICY "Allow public read from screenshots"
ON storage.objects
FOR SELECT
USING (bucket_id = 'screenshots');
```

### Verify Storage Setup

Check that the bucket exists and policies are created:

```sql
-- Check if screenshots bucket exists
SELECT id, name, public
FROM storage.buckets
WHERE name = 'screenshots';

-- List all policies on storage.objects
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage';
```

Expected output:
- Bucket `screenshots` should exist with `public = true`
- Two policies should exist for storage.objects related to screenshots

---

## 4. Verification Queries

Run these queries to verify the complete setup:

### Verify All Donations Columns Exist

```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'donations'
ORDER BY ordinal_position;
```

### Verify RLS is Enabled

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'donations';
```

### Verify Donations Policies

```sql
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'donations'
ORDER BY policyname;
```

### Verify Screenshots Bucket Exists

```sql
SELECT id, name, public
FROM storage.buckets
WHERE name = 'screenshots';
```

### Verify Storage Policies

```sql
SELECT policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'objects'
AND schemaname = 'storage'
ORDER BY policyname;
```

### Test INSERT Permission (Optional)

To verify that anonymous users can insert donations, you can test with:

```sql
-- This should succeed if policies are correctly configured
INSERT INTO donations (donor_name, amount, message, generation, status, commitment_type)
VALUES ('Test Donor', 100, 'Test message', 'G1', 'pending', 'transfer')
RETURNING id, donor_name, amount, generation, status, commitment_type;
```

### Test SELECT Permission (Optional)

To verify that public read access works:

```sql
-- This should return all donations
SELECT id, donor_name, amount, message, generation, screenshot_url, status, commitment_type, created_at
FROM donations
ORDER BY created_at DESC;
```

---

## Setup Checklist

- [ ] Execute all ALTER TABLE statements in Section 1
- [ ] Run verification query from Section 1 to confirm columns exist
- [ ] Execute ALTER TABLE ENABLE ROW LEVEL SECURITY
- [ ] Create both RLS policies (INSERT and SELECT)
- [ ] Run verification queries from Section 2 to confirm RLS is enabled
- [ ] Create screenshots bucket via INSERT statement
- [ ] Create both storage RLS policies
- [ ] Run verification queries from Section 3 to confirm bucket and policies exist
- [ ] Run all verification queries from Section 4 to confirm complete setup
- [ ] (Optional) Run test INSERT and SELECT queries to verify permissions work

---

## 5. Campaign Table Cleanup

The `campaign` table is no longer used by the app. The fundraising goal is defined as a constant in code (`FUNDRAISING_GOAL` in `src/lib/constants.ts`) and the current total is computed from the `donations` table. You can safely drop the table:

```sql
DROP TABLE IF EXISTS campaign;
```

---

## Notes

- All SQL commands should be executed in the Supabase dashboard SQL editor
- RLS policies allow anonymous users to insert and read donations
- The screenshots bucket is public, allowing anonymous uploads and public reads
- The `status` column uses a CHECK constraint to ensure only valid values ('pending', 'confirmed', 'rejected')
- The `commitment_type` column defaults to 'transfer' for payment method tracking
- The `generation` column stores G1-G45 identifiers for donor generation tracking
- The `screenshot_url` column stores the path to uploaded proof screenshots in the storage bucket
- The fundraising total is always computed from the `donations` table — never stored as a static value
