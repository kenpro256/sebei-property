/* ============================================================
   SUPABASE CONFIG — replace with your real credentials
   Get these from: Supabase Dashboard → Settings → API
   ============================================================ */
const SUPABASE_URL     = 'https://keakcngpiqioesczljck.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlYWtjbmdwaXFpb2VzY3psamNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTExNTMsImV4cCI6MjA5ODEyNzE1M30.47IdNWpsuXFqjQrtY8SSwZILYQPx-sRxp03ZULJrZh0';

/* WhatsApp number for enquiries (include country code, no +) */
const WA_NUMBER = '256700123456';

/* Admin email (set up in Supabase Auth → Users) */
const ADMIN_EMAIL_HINT = 'admin@sebeipropertypartners.com';

/* ============================================================
   SUPABASE CLIENT — initialised only when URL is set
   ============================================================ */
let supabase = null;
const SUPABASE_CONFIGURED = SUPABASE_URL !== 'YOUR_SUPABASE_URL';

if (SUPABASE_CONFIGURED) {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* ============================================================
   MOCK DATA — used when Supabase is not yet configured
   Replace with real entries or let Supabase drive the data
   ============================================================ */
const MOCK_PROPERTIES = [
  {
    id: 1,
    title: 'Executive 4-Bedroom Villa',
    type: 'sale',
    price: 850000000,
    location: 'Kololo',
    bedrooms: 4,
    bathrooms: 3,
    size: '450 sqm',
    description: 'A magnificent executive villa set on the prestigious Kololo Hill, one of Kampala\'s most coveted addresses. The property features a spacious open-plan living and dining area flooded with natural light, a fully fitted kitchen with granite countertops and imported fittings, and a private master suite with en-suite bathroom and walk-in wardrobe. Outside, a manicured garden with pergola, a perimeter wall with electric fence, CCTV, and parking for four vehicles. The property sits on a verified Mailo land title and is ready for immediate occupation. Close to international schools, embassies, and Nakasero Market.',
    image_urls: [
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=85',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1200&q=85',
      'https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=1200&q=85'
    ],
    status: 'available',
    featured: true
  },
  {
    id: 2,
    title: 'Modern 3-Bedroom Apartment',
    type: 'rent',
    price: 4500000,
    location: 'Nakasero',
    bedrooms: 3,
    bathrooms: 2,
    size: '180 sqm',
    description: 'Stunning high-floor apartment in a secure gated complex in the heart of Nakasero. Enjoy panoramic views of Kampala city from the balcony. Open-plan living area, modern fitted kitchen, master bedroom with en-suite, two guest bedrooms, and 24-hour security with CCTV. The building has a backup generator, water storage, and a rooftop terrace. Walking distance to Nakasero Market, major banks, and restaurants. Ideal for professionals and corporate tenants.',
    image_urls: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=85',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85'
    ],
    status: 'available',
    featured: true
  },
  {
    id: 3,
    title: '1.5 Acres — Verified Freehold',
    type: 'land',
    price: 320000000,
    location: 'Wakiso',
    bedrooms: null,
    bathrooms: null,
    size: '1.5 acres',
    description: 'Prime 1.5-acre freehold land along Entebbe Road, Wakiso district. The land is flat, fully fenced with murram roads accessing all corners. It sits on a verified Freehold title with no encumbrances — title search completed. Located 2km from the main Entebbe Highway with electricity and municipal water nearby. Ideal for residential development, a gated community project, or commercial use. Surrounded by established estates. Certificate of title available for inspection.',
    image_urls: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85'
    ],
    status: 'available',
    featured: true
  },
  {
    id: 4,
    title: 'Luxury 5-Bedroom Mansion',
    type: 'sale',
    price: 1350000000,
    location: 'Muyenga',
    bedrooms: 5,
    bathrooms: 5,
    size: '680 sqm',
    description: 'An extraordinary lakefront mansion in the exclusive Muyenga Tank Hill neighbourhood, offering breathtaking views of Lake Victoria. Five en-suite bedrooms, a cinema room, gym, wine cellar, and a heated infinity pool. Smart home automation controls lights, security, and climate. Landscaped grounds with indigenous trees, a gazebo, and a BBQ deck. Three-car garage with servant quarters. Verified Mailo title, all levies paid. A rare trophy property for the discerning buyer.',
    image_urls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 5,
    title: 'Self-Contained 2-Bedroom Apartment',
    type: 'rent',
    price: 2200000,
    location: 'Ntinda',
    bedrooms: 2,
    bathrooms: 2,
    size: '110 sqm',
    description: 'Well-maintained two-bedroom apartment in a secure estate in Ntinda, close to Ntinda Shopping Mall and Kigobe Road. The unit is fully tiled, with a fitted kitchen, two bathrooms, and a covered parking bay. The estate has 24-hour security, water tanks, and a standby generator. Ideal for young professionals or small families. Available from 1st of next month.',
    image_urls: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=85',
      'https://images.unsplash.com/photo-1527030280862-64139fef4a0b?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 6,
    title: '3-Bedroom Bungalow on 50×100 Plot',
    type: 'sale',
    price: 420000000,
    location: 'Kira',
    bedrooms: 3,
    bathrooms: 2,
    size: '240 sqm',
    description: 'Spacious three-bedroom bungalow on a 50×100 ft plot in Kira municipality, off Kira Road. The property features a large sitting room, dining area, fitted kitchen, master bedroom with en-suite, two guest rooms, and a servant\'s quarter. Fully tiled throughout, with aluminium windows and a boundary wall. The property is on a registered Mailo title and includes a small garden. Close to Kira Health Centre, schools, and the new Kira Central Market.',
    image_urls: [
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=85',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 7,
    title: '2 Acres — Entebbe Road Frontage',
    type: 'land',
    price: 680000000,
    location: 'Entebbe Road',
    bedrooms: null,
    bathrooms: null,
    size: '2 acres',
    description: 'Exceptional 2-acre plot with direct Entebbe Road frontage — prime commercial land in Kajjansi town. The land has over 80 metres of road frontage, is flat, with electricity on site. Excellent for a hotel, service station, warehousing, or a mixed-use commercial development. The Entebbe Expressway exit is 300 metres away. Freehold title available. Serious buyers only — proof of funds required for inspection.',
    image_urls: [
      'https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=1200&q=85',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 8,
    title: 'Studio Apartment — All-Inclusive',
    type: 'rent',
    price: 1500000,
    location: 'Bukoto',
    bedrooms: 1,
    bathrooms: 1,
    size: '55 sqm',
    description: 'Fully furnished and serviced studio apartment in Bukoto, available on monthly lease. Includes internet (fibre), DSTV, electricity, water, and weekly cleaning. Modern fitted kitchen, queen bed, sofa set, and air conditioning. The building has backup power, rooftop solar water heating, and secure parking. Ideal for expats, business travellers, or anyone seeking a hassle-free city living experience.',
    image_urls: [
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=1200&q=85',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 9,
    title: '4-Bedroom Townhouse — Gated Estate',
    type: 'sale',
    price: 620000000,
    location: 'Naguru',
    bedrooms: 4,
    bathrooms: 3,
    size: '320 sqm',
    description: 'Contemporary four-bedroom townhouse in the exclusive Naguru Heights gated estate. Modern architecture with an open-plan ground floor, rooftop terrace with city views, and a private rear garden. The estate has a shared swimming pool, gym, children\'s play area, and 24-hour manned security. All units are on a Sectional Title. Close to the Uganda Golf Course, Nakawa and Kololo. Ready to move in.',
    image_urls: [
      'https://images.unsplash.com/photo-1593696140826-c58b021acf8b?w=1200&q=85',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 10,
    title: '3 Acres Agricultural Land',
    type: 'land',
    price: 180000000,
    location: 'Gayaza',
    bedrooms: null,
    bathrooms: null,
    size: '3 acres',
    description: 'Three acres of fertile land in Gayaza, Wakiso district, suitable for agriculture, poultry, or residential subdivision. The land has a borehole, a small caretaker\'s structure, and is partially fenced. Access road is murram, navigable year-round. The area is rapidly developing with nearby schools and a health centre. Customary title with a proven ownership history, conversion to Mailo possible. Seller is motivated.',
    image_urls: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&q=85',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 11,
    title: '3-Bedroom House for Rent',
    type: 'rent',
    price: 3500000,
    location: 'Lubowa',
    bedrooms: 3,
    bathrooms: 2,
    size: '200 sqm',
    description: 'Charming three-bedroom house set in a quiet cul-de-sac in Lubowa, off Entebbe Road. Large sitting room with fireplace, dining room, fitted kitchen with pantry, master bedroom with en-suite, and a large covered patio overlooking a mature garden. The property has a borehole, NWSC municipal water, and a 6 KVA standby generator. Two-car carport and servant\'s quarters included. Pets permitted. Short-stay available at negotiated rate.',
    image_urls: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=1200&q=85',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  },
  {
    id: 12,
    title: 'Commercial Office Space',
    type: 'rent',
    price: 9500000,
    location: 'Kampala CBD',
    bedrooms: null,
    bathrooms: 2,
    size: '280 sqm',
    description: 'Grade-A office space on the 6th floor of a modern building on Kampala Road. Open-plan layout with two board rooms, a reception area, kitchenette, and two bathrooms. Floor-to-ceiling windows with city views, fibre internet infrastructure, three-phase power, and a dedicated lift. The building has 24-hour security, an underground parking deck, and a rooftop terrace. Ideal for corporates, law firms, and NGOs. Fit-out contribution negotiable for a long-term tenant.',
    image_urls: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=85',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=85'
    ],
    status: 'available',
    featured: false
  }
];

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

function buildPropertyCard(p) {
  const img = (p.image_urls || [])[0] || 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80';
  const feats = [];
  if (p.bedrooms)  feats.push(`🛏 ${p.bedrooms} Bed`);
  if (p.bathrooms) feats.push(`🚿 ${p.bathrooms} Bath`);
  if (p.size)      feats.push(`📐 ${p.size}`);

  return `
  <div class="property-card" onclick="location.href='property.html?id=${p.id}'">
    <div class="card-image">
      <img src="${img}" alt="${p.title}" loading="lazy">
      <span class="card-badge ${getBadgeClass(p.type)}">${getTypeLabel(p.type)}</span>
    </div>
    <div class="card-body">
      <div class="card-price">${formatPrice(p.price, p.type)}</div>
      <div class="card-title">${p.title}</div>
      <div class="card-location">📍 ${p.location}, Kampala</div>
      ${feats.length ? `<div class="card-features">${feats.map(f => `<span>${f}</span>`).join('')}</div>` : ''}
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
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      nav.classList.toggle('transparent', window.scrollY <= 50);
    }, { passive: true });
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
  if (heroBg) setTimeout(() => heroBg.classList.add('loaded'), 100);
});
