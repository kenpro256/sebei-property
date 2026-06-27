/* ============================================================
   SUPABASE CONFIG
   ============================================================ */
const SUPABASE_URL      = 'https://keakcngpiqioesczljck.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlYWtjbmdwaXFpb2VzY3psamNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTExNTMsImV4cCI6MjA5ODEyNzE1M30.47IdNWpsuXFqjQrtY8SSwZILYQPx-sRxp03ZULJrZh0';
const WA_NUMBER         = '256700123456';

/* ============================================================
   MOCK DATA — fallback when Supabase is unreachable
   ============================================================ */
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80&auto=format&fit=crop';

const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Executive 4-Bedroom Villa',
    type: 'sale', price: 850000000, location: 'Kololo',
    bedrooms: 4, bathrooms: 3, size: '450 sqm',
    description: 'A magnificent executive villa set on the prestigious Kololo Hill, one of Kampala\'s most coveted addresses. Features a spacious open-plan living and dining area, fully fitted kitchen with granite countertops, master suite with en-suite bathroom and walk-in wardrobe. Outside: manicured garden, electric fence, CCTV, and parking for four. Verified Mailo title, ready for immediate occupation.',
    image_urls: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: true
  },
  {
    id: 2,
    title: 'Modern 3-Bedroom Apartment',
    type: 'rent', price: 4500000, location: 'Nakasero',
    bedrooms: 3, bathrooms: 2, size: '180 sqm',
    description: 'Stunning high-floor apartment in a secure gated complex in Nakasero with panoramic city views. Open-plan living, modern kitchen, master en-suite, two guest bedrooms, 24-hour security, backup generator. Walking distance to Nakasero Market and major banks.',
    image_urls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: true
  },
  {
    id: 3,
    title: '1.5 Acres — Verified Freehold',
    type: 'land', price: 320000000, location: 'Wakiso',
    bedrooms: null, bathrooms: null, size: '1.5 acres',
    description: 'Prime 1.5-acre freehold land along Entebbe Road, Wakiso district. Flat, fully fenced. Verified Freehold title, no encumbrances. Electricity and municipal water nearby. Ideal for residential development or commercial use.',
    image_urls: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: true
  },
  {
    id: 4,
    title: 'Luxury 5-Bedroom Mansion',
    type: 'sale', price: 1350000000, location: 'Muyenga',
    bedrooms: 5, bathrooms: 5, size: '680 sqm',
    description: 'Extraordinary lakefront mansion in Muyenga Tank Hill with breathtaking Lake Victoria views. Five en-suite bedrooms, cinema room, gym, wine cellar, and heated infinity pool. Smart home automation. Three-car garage. Verified Mailo title.',
    image_urls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 5,
    title: 'Self-Contained 2-Bedroom Apartment',
    type: 'rent', price: 2200000, location: 'Ntinda',
    bedrooms: 2, bathrooms: 2, size: '110 sqm',
    description: 'Well-maintained two-bedroom apartment in a secure estate in Ntinda, close to Ntinda Shopping Mall. Fully tiled, fitted kitchen, two bathrooms, covered parking. 24-hour security, water tanks, standby generator.',
    image_urls: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1527030280862-64139fef4a0b?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 6,
    title: '3-Bedroom Bungalow on 50×100 Plot',
    type: 'sale', price: 420000000, location: 'Kira',
    bedrooms: 3, bathrooms: 2, size: '240 sqm',
    description: 'Spacious three-bedroom bungalow on a 50×100 ft plot in Kira municipality. Large sitting room, fitted kitchen, master en-suite, servant\'s quarter. Fully tiled, boundary wall. Mailo title included.',
    image_urls: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 7,
    title: '2 Acres — Entebbe Road Frontage',
    type: 'land', price: 680000000, location: 'Entebbe Road',
    bedrooms: null, bathrooms: null, size: '2 acres',
    description: 'Exceptional 2-acre plot with direct Entebbe Road frontage in Kajjansi. Over 80 metres of road frontage, flat, electricity on site. Ideal for hotel, service station, or commercial development. Freehold title available.',
    image_urls: [
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 8,
    title: 'Studio Apartment — All-Inclusive',
    type: 'rent', price: 1500000, location: 'Bukoto',
    bedrooms: 1, bathrooms: 1, size: '55 sqm',
    description: 'Fully furnished and serviced studio in Bukoto. Includes internet, DSTV, electricity, water, and weekly cleaning. Modern kitchen, queen bed, AC. Backup power and secure parking.',
    image_urls: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 9,
    title: '4-Bedroom Townhouse — Gated Estate',
    type: 'sale', price: 620000000, location: 'Naguru',
    bedrooms: 4, bathrooms: 3, size: '320 sqm',
    description: 'Contemporary four-bedroom townhouse in Naguru Heights gated estate. Rooftop terrace with city views, shared pool and gym, 24-hour security. Sectional title. Close to Uganda Golf Course.',
    image_urls: [
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 10,
    title: '3 Acres Agricultural Land',
    type: 'land', price: 180000000, location: 'Gayaza',
    bedrooms: null, bathrooms: null, size: '3 acres',
    description: 'Three acres of fertile land in Gayaza, Wakiso district. Borehole, caretaker structure, partially fenced. Customary title, conversion to Mailo possible. Area rapidly developing.',
    image_urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 11,
    title: '3-Bedroom House for Rent',
    type: 'rent', price: 3500000, location: 'Lubowa',
    bedrooms: 3, bathrooms: 2, size: '200 sqm',
    description: 'Charming three-bedroom house in Lubowa off Entebbe Road. Large garden, borehole, 6KVA generator, covered patio. Two-car carport and servant\'s quarters. Pets permitted.',
    image_urls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  },
  {
    id: 12,
    title: 'Grade-A Commercial Office Space',
    type: 'rent', price: 9500000, location: 'Kampala CBD',
    bedrooms: null, bathrooms: 2, size: '280 sqm',
    description: 'Grade-A office on the 6th floor of a modern building on Kampala Road. Two boardrooms, reception, fibre internet, three-phase power. Underground parking, 24-hour security.',
    image_urls: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80&auto=format&fit=crop'
    ], status: 'available', featured: false
  }
];

/* ============================================================
   SUPABASE CLIENT — initialised AFTER mock data so a CDN
   failure never crashes the page (fallback always available)
   ============================================================ */
let supabase = null;
const SUPABASE_CONFIGURED = SUPABASE_URL !== 'YOUR_SUPABASE_URL';

try {
  if (SUPABASE_CONFIGURED && window.supabase && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  console.warn('Supabase init failed, using demo data:', e.message);
}

/* ============================================================
   HELPERS
   ============================================================ */
function formatPrice(price, type) {
  if (!price) return 'Price on Request';
  const ugx = new Intl.NumberFormat('en-UG').format(price);
  if (type === 'rent') return `UGX ${ugx}<span class="card-price-note">/mo</span>`;
  return `UGX ${ugx}`;
}

function formatPricePlain(price, type) {
  if (!price) return 'Price on Request';
  const ugx = new Intl.NumberFormat('en-UG').format(price);
  return type === 'rent' ? `UGX ${ugx}/mo` : `UGX ${ugx}`;
}

function getTypeLabel(type) {
  return { sale: 'For Sale', rent: 'For Rent', land: 'For Sale (Land)' }[type] || type;
}

function getBadgeClass(type) {
  return { sale: 'badge-sale', rent: 'badge-rent', land: 'badge-land' }[type] || 'badge-sale';
}

function getPillClass(type) {
  return { sale: 'pill-sale', rent: 'pill-rent', land: 'pill-land' }[type] || 'pill-sale';
}

function imgWithFallback(src, alt) {
  const safe = src || FALLBACK_IMG;
  return `<img src="${safe}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">`;
}

function buildPropertyCard(p) {
  const img  = (p.image_urls || [])[0] || FALLBACK_IMG;
  const feats = [];
  if (p.bedrooms)  feats.push(`🛏 ${p.bedrooms} Bed`);
  if (p.bathrooms) feats.push(`🚿 ${p.bathrooms} Bath`);
  if (p.size)      feats.push(`📐 ${p.size}`);

  return `
  <div class="property-card reveal-card" onclick="location.href='property.html?id=${p.id}'">
    <div class="card-image">
      <img src="${img}" alt="${p.title}" loading="lazy"
           onerror="this.onerror=null;this.src='${FALLBACK_IMG}'">
      <span class="card-badge ${getBadgeClass(p.type)}">${getTypeLabel(p.type)}</span>
    </div>
    <div class="card-body">
      <div class="card-price">${formatPrice(p.price, p.type)}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-location">📍 ${p.location}, Kampala</div>
      ${feats.length ? `<div class="card-features">${feats.map(f=>`<span>${f}</span>`).join('')}</div>` : ''}
    </div>
  </div>`;
}

function showToast(msg, type = 'success') {
  const wrap = document.getElementById('toastWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* ===== NAV SCROLL + TOGGLE ===== */
document.addEventListener('DOMContentLoaded', () => {
  const nav    = document.getElementById('mainNav');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');

  if (nav && nav.classList.contains('transparent')) {
    const onScroll = () => {
      const scrolled = window.scrollY > 50;
      nav.classList.toggle('scrolled',     scrolled);
      nav.classList.toggle('transparent', !scrolled);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = mobile.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mobile.classList.remove('open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* Hero bg zoom */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 80);
});
