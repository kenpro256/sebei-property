# Sebei Property Partners — Setup Guide

## 1. Supabase Setup

### Create the properties table
Run this SQL in Supabase → SQL Editor:

```sql
-- Properties table
CREATE TABLE properties (
  id          BIGSERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('sale', 'rent', 'land')),
  price       BIGINT NOT NULL,
  location    TEXT NOT NULL,
  bedrooms    INTEGER,
  bathrooms   INTEGER,
  size        TEXT,
  description TEXT,
  image_urls  TEXT[] DEFAULT '{}',
  status      TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold')),
  featured    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public: read available properties
CREATE POLICY "Public can read available properties"
  ON properties FOR SELECT
  USING (status = 'available');

-- Admin: full CRUD (any authenticated user)
CREATE POLICY "Authenticated users have full access"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

### Create Supabase Storage bucket
```sql
-- Create public storage bucket for property images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'property-images',
  'property-images',
  true,
  5242880,  -- 5MB limit
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
);

-- Allow public to view images
CREATE POLICY "Public read images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Allow authenticated users to upload
CREATE POLICY "Auth users upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Auth users delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
```

### Seed demo data (optional — run after table is created)
```sql
INSERT INTO properties (title, type, price, location, bedrooms, bathrooms, size, description, image_urls, status, featured) VALUES
('Executive 4-Bedroom Villa', 'sale', 850000000, 'Kololo', 4, 3, '450 sqm',
 'A magnificent executive villa set on the prestigious Kololo Hill. Features spacious open-plan living, fitted kitchen, master suite with en-suite and walk-in wardrobe, landscaped garden, perimeter wall with electric fence, and parking for four. Verified Mailo title, ready for immediate occupation.',
 ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=85','https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85'],
 'available', true),

('Modern 3-Bedroom Apartment', 'rent', 4500000, 'Nakasero', 3, 2, '180 sqm',
 'High-floor apartment in a secure gated complex in Nakasero with panoramic city views. Open-plan living, modern fitted kitchen, master with en-suite, balcony, 24-hour security, backup generator.',
 ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85'],
 'available', true),

('1.5 Acres — Verified Freehold', 'land', 320000000, 'Wakiso', NULL, NULL, '1.5 acres',
 'Prime 1.5-acre freehold land along Entebbe Road, Wakiso district. Flat, fully fenced, electricity nearby. Verified Freehold title, no encumbrances. Ideal for residential development.',
 ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85'],
 'available', true),

('Luxury 5-Bedroom Mansion', 'sale', 1350000000, 'Muyenga', 5, 5, '680 sqm',
 'Extraordinary lakefront mansion in Muyenga Tank Hill with Lake Victoria views. Cinema room, gym, infinity pool, smart home automation. Verified Mailo title.',
 ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85'],
 'available', false),

('2-Bedroom Apartment', 'rent', 2200000, 'Ntinda', 2, 2, '110 sqm',
 'Well-maintained two-bedroom apartment in a secure estate in Ntinda, close to shopping mall. 24-hour security, generator, parking included.',
 ARRAY['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85'],
 'available', false),

('3-Bedroom Bungalow', 'sale', 420000000, 'Kira', 3, 2, '240 sqm',
 'Spacious three-bedroom bungalow on a 50x100ft plot in Kira municipality. Tiled throughout, servant quarters, boundary wall. Mailo title.',
 ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85'],
 'available', false),

('2 Acres Entebbe Road Frontage', 'land', 680000000, 'Entebbe Road', NULL, NULL, '2 acres',
 'Exceptional 2-acre plot with direct Entebbe Road frontage in Kajjansi. 80m road frontage, flat, electricity on site. Ideal for hotel, service station, or commercial development.',
 ARRAY['https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=1200&q=85'],
 'available', false),

('Studio Apartment — Serviced', 'rent', 1500000, 'Bukoto', 1, 1, '55 sqm',
 'Fully furnished and serviced studio apartment in Bukoto. Includes internet, DSTV, electricity, water, and weekly cleaning. Backup power, secure parking.',
 ARRAY['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=85'],
 'available', false),

('4-Bedroom Townhouse — Gated Estate', 'sale', 620000000, 'Naguru', 4, 3, '320 sqm',
 'Contemporary townhouse in Naguru Heights gated estate. Rooftop terrace, shared pool and gym, 24-hour security. Sectional title. Close to Uganda Golf Course.',
 ARRAY['https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=85','https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85'],
 'available', false),

('3 Acres Agricultural Land', 'land', 180000000, 'Gayaza', NULL, NULL, '3 acres',
 'Three acres of fertile land in Gayaza, Wakiso district. Borehole, small caretaker structure, partially fenced. Customary title, conversion possible.',
 ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85'],
 'available', false),

('3-Bedroom House for Rent', 'rent', 3500000, 'Lubowa', 3, 2, '200 sqm',
 'Charming three-bedroom house in Lubowa off Entebbe Road. Large garden, borehole, 6KVA generator, covered patio. Pets permitted.',
 ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85','https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=85'],
 'available', false),

('Commercial Office — Grade A', 'rent', 9500000, 'Kampala CBD', NULL, 2, '280 sqm',
 '6th floor Grade-A office on Kampala Road. Open-plan with two boardrooms, fibre internet, three-phase power. Underground parking, 24-hour security.',
 ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85'],
 'available', false);
```

---

## 2. Configure the site

Open `js/config.js` and replace the placeholders:

```js
const SUPABASE_URL      = 'https://YOUR-PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
const WA_NUMBER         = '256700123456';  // your real WhatsApp number
```

Get your URL and anon key from: **Supabase Dashboard → Settings → API**

---

## 3. Create your admin account

In Supabase Dashboard → **Authentication → Users → Add User**, create:
- Email: `admin@sebeipropertypartners.com` (or any email you prefer)
- Password: choose a strong password

Then go to `your-domain.com/admin/` and log in with those credentials.

---

## 4. Deploy to GitHub Pages

```bash
cd realestate-demo
git init
git add .
git commit -m "Initial commit: Sebei Property Partners website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sebei-property.git
git push -u origin main
```

Then in GitHub → Repository → Settings → Pages:
- Source: **Deploy from branch**
- Branch: `main`, folder: `/ (root)`

Your site will be live at: `https://YOUR-USERNAME.github.io/sebei-property/`

---

## 5. Custom domain (optional)

Add a `CNAME` file in the repo root with your domain:
```
sebeipropertypartners.com
```

Then configure DNS at your registrar: `CNAME www → YOUR-USERNAME.github.io`

---

## Admin panel access

URL: `your-domain.com/admin/`  
This page has `noindex` so search engines won't find it.  
Share only with the firm's team members.

## WhatsApp number

Update `WA_NUMBER` in `js/config.js` with the real number (digits only, no + or spaces).  
Also update all `href="https://wa.me/256700123456"` links in HTML files.
