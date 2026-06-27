/* ===== ADMIN PANEL ===== */

let adminProperties = [];
let pendingImages   = [];   /* new File objects to upload */
let existingUrls    = [];   /* URLs already on the record (editing) */
let deleteTargetId  = null;
let editingId       = null;

/* ============================================================
   AUTH
   ============================================================ */
async function checkAuth() {
  if (!SUPABASE_CONFIGURED || !supabase) {
    /* Demo mode — skip auth */
    showDashboard('demo@example.com');
    return;
  }
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    showDashboard(session.user.email);
  } else {
    showLogin();
  }
}

function showLogin() {
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard(email) {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'block';

  if (email) {
    document.getElementById('adminUserEmail').textContent = email;
  }
  if (!SUPABASE_CONFIGURED) {
    document.getElementById('demoBanner').style.display = 'flex';
  }
  loadAdminProperties();
}

async function doLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginError');
  const email = document.getElementById('loginEmail').value.trim();
  const pass  = document.getElementById('loginPass').value;

  btn.textContent = 'Signing in…';
  btn.disabled = true;
  err.style.display = 'none';

  if (!SUPABASE_CONFIGURED || !supabase) {
    /* Demo mode: accept any credentials */
    setTimeout(() => { showDashboard(email); }, 600);
    return;
  }

  try {
    const { data, error } = await withTimeout(
      supabase.auth.signInWithPassword({ email, password: pass }),
      12000
    );
    if (error) throw error;
    showDashboard(data.user.email);
  } catch (ex) {
    err.textContent = ex.message || 'Connection timed out — check your network and try again.';
    err.style.display = 'block';
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
}

async function doLogout() {
  if (supabase) await supabase.auth.signOut();
  showLogin();
}

/* ============================================================
   LOAD PROPERTIES
   ============================================================ */
async function loadAdminProperties() {
  try {
    if (SUPABASE_CONFIGURED && supabase) {
      const { data, error } = await withTimeout(
        supabase.from('properties').select('*').order('created_at', { ascending: false })
      );
      if (error) throw error;
      adminProperties = data || [];
    } else {
      adminProperties = [...MOCK_PROPERTIES];
    }
  } catch (e) {
    showToast('Failed to load properties: ' + e.message, 'error');
    adminProperties = [...MOCK_PROPERTIES];
  }

  renderStats();
  renderTable(adminProperties);
}

function renderStats() {
  document.getElementById('statTotal').textContent = adminProperties.length;
  document.getElementById('statSale').textContent  = adminProperties.filter(p => p.type === 'sale').length;
  document.getElementById('statRent').textContent  = adminProperties.filter(p => p.type === 'rent').length;
  document.getElementById('statLand').textContent  = adminProperties.filter(p => p.type === 'land').length;
}

function renderTable(props) {
  const tbody = document.getElementById('propTableBody');
  if (!props.length) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:2.5rem;color:var(--muted)">No properties found. <a onclick="openAddModal()" style="color:var(--green);cursor:pointer;font-weight:600">Add one now →</a></td></tr>`;
    return;
  }
  tbody.innerHTML = props.map(p => {
    const img = (p.image_urls || [])[0] || '';
    const priceText = formatPricePlain(p.price, p.type);
    return `
    <tr>
      <td>${img ? `<img class="t-thumb" src="${img}" alt="${p.title}" loading="lazy">` : '<span style="color:var(--muted);font-size:0.75rem">No photo</span>'}</td>
      <td class="t-title-cell">
        <strong>${p.title}</strong>
        <span>${p.bedrooms ? p.bedrooms + ' bed · ' : ''}${p.size || ''}</span>
      </td>
      <td><span class="pill pill-${p.type}">${getTypeLabel(p.type)}</span></td>
      <td class="t-price hide-mobile">${priceText}</td>
      <td class="hide-mobile">${p.location}</td>
      <td><span class="pill ${p.status === 'available' ? 'pill-available' : 'pill-sold'}">${p.status === 'available' ? 'Available' : 'Sold'}</span></td>
      <td>
        <div class="t-actions">
          <button class="t-btn t-btn-edit" onclick="openEditModal(${p.id})">Edit</button>
          <button class="t-btn t-btn-del"  onclick="confirmDelete(${p.id})">Del</button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterTable() {
  const q    = document.getElementById('tableSearch').value.toLowerCase();
  const type = document.getElementById('tableTypeFilter').value;
  const filtered = adminProperties.filter(p => {
    const matchType = !type || p.type === type;
    const matchQ    = !q || p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
    return matchType && matchQ;
  });
  renderTable(filtered);
}

/* ============================================================
   ADD / EDIT MODAL
   ============================================================ */
function openAddModal() {
  editingId = null;
  pendingImages = [];
  existingUrls  = [];
  resetForm();
  document.getElementById('modalTitle').textContent = 'Add New Property';
  document.getElementById('existingUrlsWrap').style.display = 'none';
  openModal('propModal');
}

async function openEditModal(id) {
  const prop = adminProperties.find(p => p.id === id);
  if (!prop) return;

  editingId = id;
  pendingImages = [];
  existingUrls = prop.image_urls ? [...prop.image_urls] : [];

  resetForm();
  document.getElementById('modalTitle').textContent = 'Edit Property';
  document.getElementById('editId').value    = id;
  document.getElementById('fTitle').value    = prop.title || '';
  document.getElementById('fType').value     = prop.type  || '';
  document.getElementById('fStatus').value   = prop.status || 'available';
  document.getElementById('fPrice').value    = prop.price || '';
  document.getElementById('fLocation').value = prop.location || '';
  document.getElementById('fBeds').value     = prop.bedrooms  || '';
  document.getElementById('fBaths').value    = prop.bathrooms || '';
  document.getElementById('fSize').value     = prop.size || '';
  document.getElementById('fDesc').value     = prop.description || '';
  document.getElementById('fFeatured').checked = prop.featured || false;

  updatePriceHint();

  /* Show existing images */
  if (existingUrls.length) {
    document.getElementById('existingUrlsWrap').style.display = 'block';
    renderExistingPreviews();
  }

  openModal('propModal');
}

function resetForm() {
  document.getElementById('propForm').reset();
  document.getElementById('editId').value = '';
  document.getElementById('imgPreviews').innerHTML = '';
  document.getElementById('existingPreviews').innerHTML = '';
  pendingImages = [];
}

function renderExistingPreviews() {
  document.getElementById('existingPreviews').innerHTML = existingUrls.map((url, i) => `
    <div class="img-preview">
      <img src="${url}" alt="Photo">
      <button class="rm-img" onclick="removeExisting(${i})" title="Remove">×</button>
    </div>`).join('');
}

function removeExisting(i) {
  existingUrls.splice(i, 1);
  if (!existingUrls.length) {
    document.getElementById('existingUrlsWrap').style.display = 'none';
  }
  renderExistingPreviews();
}

/* ============================================================
   IMAGE HANDLING
   ============================================================ */
function handleDragOver(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.add('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('uploadArea').classList.remove('drag-over');
  handleFiles(e.dataTransfer.files);
}

function handleFiles(files) {
  Array.from(files).forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { showToast(`${file.name} is too large (max 5MB)`, 'error'); return; }
    pendingImages.push(file);
    const reader = new FileReader();
    reader.onload = e => addPreview(e.target.result, pendingImages.length - 1);
    reader.readAsDataURL(file);
  });
}

function addPreview(src, idx) {
  const wrap = document.getElementById('imgPreviews');
  const div  = document.createElement('div');
  div.className = 'img-preview';
  div.dataset.idx = idx;
  div.innerHTML = `<img src="${src}" alt="Preview"><button class="rm-img" onclick="removePending(${idx})" title="Remove">×</button>`;
  wrap.appendChild(div);
}

function removePending(idx) {
  pendingImages[idx] = null; /* mark as removed */
  const el = document.querySelector(`.img-preview[data-idx="${idx}"]`);
  if (el) el.remove();
}

async function uploadImages() {
  const toUpload = pendingImages.filter(Boolean);
  if (!toUpload.length) return [];
  if (!SUPABASE_CONFIGURED || !supabase) {
    /* Demo: return placeholder URLs */
    return toUpload.map(() => 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=85');
  }

  document.getElementById('uploadBar').classList.add('active');
  const urls = [];

  for (const file of toUpload) {
    const ext  = file.name.split('.').pop();
    const path = `properties/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { data, error } = await supabase.storage.from('property-images').upload(path, file);
    if (error) { showToast('Upload failed: ' + error.message, 'error'); continue; }
    const { data: { publicUrl } } = supabase.storage.from('property-images').getPublicUrl(path);
    urls.push(publicUrl);
  }

  document.getElementById('uploadBar').classList.remove('active');
  return urls;
}

/* ============================================================
   SAVE PROPERTY
   ============================================================ */
async function submitProperty(e) {
  e.preventDefault();
  const btn = document.getElementById('saveBtn');
  btn.textContent = 'Saving…';
  btn.disabled = true;

  try {
    /* Upload new images */
    const newUrls  = await uploadImages();
    const allUrls  = [...existingUrls, ...newUrls];

    const payload = {
      title:       document.getElementById('fTitle').value.trim(),
      type:        document.getElementById('fType').value,
      status:      document.getElementById('fStatus').value,
      price:       Number(document.getElementById('fPrice').value),
      location:    document.getElementById('fLocation').value.trim(),
      bedrooms:    Number(document.getElementById('fBeds').value)  || null,
      bathrooms:   Number(document.getElementById('fBaths').value) || null,
      size:        document.getElementById('fSize').value.trim()   || null,
      description: document.getElementById('fDesc').value.trim(),
      featured:    document.getElementById('fFeatured').checked,
      image_urls:  allUrls,
    };

    if (SUPABASE_CONFIGURED && supabase) {
      let error;
      if (editingId) {
        const res = await supabase.from('properties').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editingId);
        error = res.error;
      } else {
        const res = await supabase.from('properties').insert(payload);
        error = res.error;
      }
      if (error) throw error;
    } else {
      /* Demo mode: mutate local array */
      if (editingId) {
        const idx = adminProperties.findIndex(p => p.id === editingId);
        if (idx !== -1) adminProperties[idx] = { ...adminProperties[idx], ...payload };
      } else {
        adminProperties.unshift({ id: Date.now(), ...payload, created_at: new Date().toISOString() });
      }
    }

    showToast(editingId ? 'Property updated!' : 'Property added!');
    closeModal('propModal');
    loadAdminProperties();
  } catch (ex) {
    showToast('Error: ' + ex.message, 'error');
  } finally {
    btn.textContent = 'Save Property';
    btn.disabled = false;
  }
}

/* ============================================================
   DELETE PROPERTY
   ============================================================ */
function confirmDelete(id) {
  deleteTargetId = id;
  document.getElementById('confirmDeleteBtn').onclick = doDelete;
  openModal('confirmModal');
}

async function doDelete() {
  if (!deleteTargetId) return;
  try {
    if (SUPABASE_CONFIGURED && supabase) {
      const { error } = await supabase.from('properties').delete().eq('id', deleteTargetId);
      if (error) throw error;
    } else {
      adminProperties = adminProperties.filter(p => p.id !== deleteTargetId);
    }
    showToast('Property deleted.');
    closeModal('confirmModal');
    loadAdminProperties();
  } catch (ex) {
    showToast('Delete failed: ' + ex.message, 'error');
  }
  deleteTargetId = null;
}

/* ============================================================
   UI HELPERS
   ============================================================ */
function openModal(id)  { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }

function toggleSidebar() {
  const s = document.getElementById('adminSidebar');
  const o = document.getElementById('sidebarOverlay');
  const open = s.classList.toggle('open');
  o.classList.toggle('open', open);
}
function closeSidebar() {
  document.getElementById('adminSidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

function showView(view) {
  document.querySelectorAll('.admin-nav-link').forEach(l => l.classList.toggle('active', l.dataset.view === view));
}

/* Format price hint as user types */
function updatePriceHint() {
  const val = Number(document.getElementById('fPrice').value);
  const hint = document.getElementById('priceHint');
  if (val) hint.textContent = 'UGX ' + new Intl.NumberFormat('en-UG').format(val);
  else hint.textContent = '';
}

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  /* Price hint on input */
  document.getElementById('fPrice').addEventListener('input', updatePriceHint);

  /* Close modals on overlay click */
  document.querySelectorAll('.modal-overlay, .confirm-overlay').forEach(el => {
    el.addEventListener('click', e => { if (e.target === el) closeModal(el.id); });
  });

  /* Keyboard shortcut: Escape to close modals */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open, .confirm-overlay.open').forEach(el => closeModal(el.id));
    }
  });

  /* Auth state change listener */
  if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') showLogin();
    });
  }
});
