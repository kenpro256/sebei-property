/* ===== PROPERTY DETAIL PAGE ===== */

let currentProp = null;
let images      = [];
let currentImg  = 0;

async function loadProperty() {
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) { showNotFound(); return; }

  let prop = null;

  try {
    if (SUPABASE_CONFIGURED && supabaseClient) {
      const { data, error } = await withTimeout(
        supabaseClient.from('properties').select('*').eq('id', id).single()
      );
      if (error) throw error;
      prop = data;
    }
  } catch (e) {
    console.warn('Supabase fallback:', e.message);
  }

  if (!prop) {
    prop = MOCK_PROPERTIES.find(p => String(p.id) === String(id));
  }

  if (!prop) { showNotFound(); return; }

  currentProp = prop;
  renderProperty(prop);
  loadSimilar(prop);
}

function renderProperty(p) {
  images = p.image_urls || [];
  if (!images.length) images = ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=85'];
  currentImg = 0;

  /* Page title */
  document.getElementById('pageTitle').textContent = `${p.title} — Sebei Property Partners`;
  document.getElementById('breadcrumbTitle').textContent = p.title;

  /* Gallery */
  updateGallery();
  const thumbs = document.getElementById('galleryThumbs');
  thumbs.innerHTML = images.map((url, i) => `
    <div class="gallery-thumb ${i === 0 ? 'active' : ''}" onclick="setImg(${i})">
      <img src="${url}" alt="Photo ${i+1}" loading="lazy">
    </div>`).join('');

  /* Feature chips */
  const chips = [];
  if (p.bedrooms)  chips.push({ val: p.bedrooms,  label: 'Bedrooms'  });
  if (p.bathrooms) chips.push({ val: p.bathrooms, label: 'Bathrooms' });
  if (p.size)      chips.push({ val: p.size,       label: 'Area'      });
  chips.push({ val: p.type === 'rent' ? 'Rent' : 'Purchase', label: 'Type' });
  document.getElementById('featureChips').innerHTML = chips.map(c => `
    <div class="feature-chip">
      <strong>${c.val}</strong>
      <span>${c.label}</span>
    </div>`).join('');

  /* Type + location + title */
  const badge = document.getElementById('propTypeBadge');
  badge.textContent  = getTypeLabel(p.type);
  badge.className    = `card-badge ${getBadgeClass(p.type)}`;
  badge.style.position = 'static';
  document.getElementById('propLocation').textContent = `📍 ${p.location}, Kampala`;
  document.getElementById('propTitle').textContent    = p.title;

  /* Description */
  document.getElementById('propDesc').textContent = p.description || 'Description not available.';

  /* Detail rows */
  const rows = [];
  if (p.type)      rows.push(['Listing Type', getTypeLabel(p.type)]);
  if (p.location)  rows.push(['Location', p.location + ', Uganda']);
  if (p.bedrooms)  rows.push(['Bedrooms', p.bedrooms]);
  if (p.bathrooms) rows.push(['Bathrooms', p.bathrooms]);
  if (p.size)      rows.push(['Plot/Floor Area', p.size]);
  rows.push(['Status', p.status === 'available' ? '✅ Available' : '❌ Sold/Taken']);
  document.getElementById('propDetailRows').innerHTML = rows.map(([k, v]) => `
    <div class="enquire-detail-row"><span>${k}</span><span>${v}</span></div>`).join('');

  /* Enquiry card */
  document.getElementById('eqPrice').innerHTML = formatPrice(p.price, p.type);
  document.getElementById('eqNote').textContent  = p.type === 'rent' ? 'Monthly rent — negotiate with agent' : 'Asking price — negotiable';

  const summaryRows = [];
  if (p.bedrooms)  summaryRows.push([`🛏`, `${p.bedrooms} Bedroom${p.bedrooms > 1 ? 's' : ''}`]);
  if (p.bathrooms) summaryRows.push([`🚿`, `${p.bathrooms} Bathroom${p.bathrooms > 1 ? 's' : ''}`]);
  if (p.size)      summaryRows.push([`📐`, p.size]);
  summaryRows.push([`📍`, p.location]);
  document.getElementById('enquireSummaryRows').innerHTML = summaryRows.map(([icon, val]) => `
    <div style="display:flex;align-items:center;gap:0.5rem;padding:0.35rem 0;font-size:0.85rem">
      <span>${icon}</span><span>${val}</span>
    </div>`).join('');

  /* WhatsApp URL */
  const waMsg = encodeURIComponent(`Hello, I'm interested in the property: *${p.title}* listed at ${formatPricePlain(p.price, p.type)} in ${p.location}. Please provide more details. (Ref: SPP-${p.id})`);
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;
  document.getElementById('waEnquireBtn').href = waUrl;
  document.getElementById('ctaWaBtn').href     = waUrl;

  /* Show content */
  document.getElementById('propLoading').style.display  = 'none';
  document.getElementById('propContent').classList.remove('hidden');
}

function updateGallery() {
  const img   = document.getElementById('galleryMainImg');
  const count = document.getElementById('galleryCount');
  img.src     = images[currentImg];
  count.textContent = `${currentImg + 1} / ${images.length}`;

  /* Update thumb active state */
  document.querySelectorAll('.gallery-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentImg);
  });

  /* Sync lightbox */
  const lbImg = document.getElementById('lightboxImg');
  if (lbImg) lbImg.src = images[currentImg];
}

function setImg(i) {
  currentImg = i;
  updateGallery();
}

function changeImg(dir) {
  currentImg = (currentImg + dir + images.length) % images.length;
  updateGallery();
}

function openLightbox() {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = images[currentImg];
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

/* Keyboard navigation */
document.addEventListener('keydown', e => {
  if (document.getElementById('lightbox').classList.contains('open')) {
    if (e.key === 'ArrowLeft')  changeImg(-1);
    if (e.key === 'ArrowRight') changeImg(1);
    if (e.key === 'Escape')     closeLightbox();
  }
});

function shareWA() {
  if (!currentProp) return;
  const msg = encodeURIComponent(`Check out this property: *${currentProp.title}* — ${formatPricePlain(currentProp.price, currentProp.type)} in ${currentProp.location}. Sebei Property Partners: ${window.location.href}`);
  window.open(`https://wa.me/?text=${msg}`, '_blank');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    showToast('Link copied to clipboard!');
  });
}

async function loadSimilar(p) {
  let similar = [];

  try {
    if (SUPABASE_CONFIGURED && supabaseClient) {
      const { data } = await withTimeout(
        supabaseClient.from('properties').select('*').eq('status', 'available').eq('type', p.type).neq('id', p.id).limit(3)
      );
      similar = data || [];
    }
  } catch (e) { /* ignore */ }

  if (!similar.length) {
    similar = MOCK_PROPERTIES.filter(mp => mp.type === p.type && mp.id !== p.id).slice(0, 3);
  }

  if (!similar.length) return;

  const section = document.getElementById('similarSection');
  const grid    = document.getElementById('similarGrid');
  section.style.display = 'block';
  grid.innerHTML = similar.map(buildPropertyCard).join('');
}

function showNotFound() {
  document.getElementById('propLoading').style.display  = 'none';
  document.getElementById('propNotFound').classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', loadProperty);
