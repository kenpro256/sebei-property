/* ===== LISTINGS PAGE ===== */

let allProperties = [];
let filtered      = [];
let displayCount  = 9;
const PAGE_SIZE   = 9;

let activeFilters = { type: '', location: '', minPrice: 0, maxPrice: 0, beds: 0 };

async function init() {
  /* Read URL params from hero search */
  const params = new URLSearchParams(window.location.search);
  const urlType     = params.get('type')     || '';
  const urlLocation = params.get('location') || '';
  const urlMaxprice = params.get('maxprice') || '';

  /* Pre-apply URL filters */
  if (urlType) {
    activeFilters.type = urlType;
    document.querySelectorAll('.filter-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.type === urlType);
    });
  }
  if (urlLocation) {
    document.getElementById('filterLocation').value = urlLocation.toLowerCase();
    activeFilters.location = urlLocation.toLowerCase();
  }
  if (urlMaxprice) {
    /* Set the closest price bracket */
    const sel = document.getElementById('filterPrice');
    const mp = Number(urlMaxprice);
    if (mp <= 200000000)         sel.value = '0-200000000';
    else if (mp <= 500000000)    sel.value = '200000000-500000000';
    else if (mp <= 1000000000)   sel.value = '500000000-1000000000';
    else                         sel.value = '1000000000-99999999999';
    const [mn, mx] = sel.value.split('-').map(Number);
    activeFilters.minPrice = mn;
    activeFilters.maxPrice = mx;
  }

  await fetchProperties();
  applyFilters();
  bindFilterEvents();
}

async function fetchProperties() {
  try {
    if (SUPABASE_CONFIGURED && supabaseClient) {
      const { data, error } = await withTimeout(
        supabaseClient.from('properties').select('*').eq('status', 'available').order('created_at', { ascending: false })
      );
      if (error) throw error;
      allProperties = data || [];
      return;
    }
  } catch (e) {
    console.warn('Supabase fallback:', e.message);
  }
  allProperties = MOCK_PROPERTIES.filter(p => p.status === 'available');
}

function applyFilters() {
  filtered = allProperties.filter(p => {
    if (activeFilters.type && p.type !== activeFilters.type) return false;
    if (activeFilters.location && !p.location.toLowerCase().includes(activeFilters.location)) return false;
    if (activeFilters.minPrice && p.price < activeFilters.minPrice) return false;
    if (activeFilters.maxPrice && p.price > activeFilters.maxPrice) return false;
    if (activeFilters.beds) {
      if (activeFilters.beds >= 4) { if (!p.bedrooms || p.bedrooms < 4) return false; }
      else { if (p.bedrooms !== activeFilters.beds) return false; }
    }
    return true;
  });

  displayCount = PAGE_SIZE;
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('listingsGrid');
  const count = document.getElementById('listingsCount');
  const loadWrap = document.getElementById('loadMoreWrap');

  const slice = filtered.slice(0, displayCount);

  if (!slice.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="icon">🏡</div>
        <h3>No properties found</h3>
        <p>Try adjusting your filters or <a href="contact.html" style="color:var(--green);font-weight:600">contact us</a> — we may have off-market listings.</p>
      </div>`;
    count.innerHTML = '<strong>0</strong> properties found';
    loadWrap.style.display = 'none';
    return;
  }

  grid.innerHTML = slice.map(buildPropertyCard).join('');
  count.innerHTML = `Showing <strong>${slice.length}</strong> of <strong>${filtered.length}</strong> properties`;
  loadWrap.style.display = filtered.length > displayCount ? 'block' : 'none';
}

function loadMoreProps() {
  displayCount += PAGE_SIZE;
  renderGrid();
  if (displayCount >= filtered.length) {
    document.getElementById('loadMoreWrap').style.display = 'none';
  }
}

function clearFilters() {
  activeFilters = { type: '', location: '', minPrice: 0, maxPrice: 0, beds: 0 };
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.toggle('active', b.dataset.type === ''));
  document.getElementById('filterLocation').value = '';
  document.getElementById('filterPrice').value    = '';
  document.getElementById('filterBeds').value     = '';
  applyFilters();
  /* Clear URL params */
  window.history.replaceState({}, '', 'listings.html');
}

function bindFilterEvents() {
  /* Type tabs */
  document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.type = btn.dataset.type;
      applyFilters();
    });
  });

  /* Location */
  document.getElementById('filterLocation').addEventListener('change', e => {
    activeFilters.location = e.target.value.toLowerCase();
    applyFilters();
  });

  /* Price range */
  document.getElementById('filterPrice').addEventListener('change', e => {
    if (!e.target.value) { activeFilters.minPrice = 0; activeFilters.maxPrice = 0; }
    else {
      const [mn, mx] = e.target.value.split('-').map(Number);
      activeFilters.minPrice = mn;
      activeFilters.maxPrice = mx;
    }
    applyFilters();
  });

  /* Beds */
  document.getElementById('filterBeds').addEventListener('change', e => {
    activeFilters.beds = Number(e.target.value) || 0;
    applyFilters();
  });
}

document.addEventListener('DOMContentLoaded', init);
