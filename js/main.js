/* ===== HOME PAGE ===== */

async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  let properties = [];

  try {
    if (SUPABASE_CONFIGURED && supabase) {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .eq('featured', true)
        .limit(6);
      if (error) throw error;
      properties = data || [];
    }
  } catch (e) {
    console.warn('Supabase error, falling back to demo data:', e.message);
  }

  /* Fallback: use featured mock data */
  if (!properties.length) {
    properties = MOCK_PROPERTIES.filter(p => p.featured).slice(0, 3);
    /* If none marked featured, show first 3 */
    if (!properties.length) properties = MOCK_PROPERTIES.slice(0, 3);
  }

  grid.innerHTML = properties.map(buildPropertyCard).join('');
}

function doHeroSearch() {
  const type     = document.getElementById('searchType')?.value || '';
  const location = document.getElementById('searchLocation')?.value.trim() || '';
  const price    = document.getElementById('searchPrice')?.value || '';

  const params = new URLSearchParams();
  if (type)     params.set('type', type);
  if (location) params.set('location', location);
  if (price)    params.set('maxprice', price);

  window.location.href = `listings.html?${params.toString()}`;
}

/* Allow Enter key in hero search */
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchLocation');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') doHeroSearch();
    });
  }
  loadFeatured();
});
