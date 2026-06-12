// =============================================
// ENERMIND — MAIN JS
// =============================================

// ---- NAV ----
function toggleNav() {
  document.getElementById('navMobile').classList.toggle('open');
}

// Close nav on link click
document.querySelectorAll('.nav-mobile a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('navMobile').classList.remove('open');
  });
});

// ---- PESAPAL PAYMENT ----
// NOTE: Replace with your real Pesapal credentials via backend proxy
// NEVER put real keys in frontend code — use a server-side endpoint
const PESAPAL_CONFIG = {
  // In production, all Pesapal API calls should go through YOUR backend
  // e.g. POST /api/initiate-payment  → your server calls Pesapal API
  demoMode: true // set to false when backend is ready
};

// ---- UNLOCK FLOW ----
let currentUnlockId = null;

function unlockContact(listingId) {
  const listing = LISTINGS.find(l => l.id === listingId);
  if (!listing) return;

  // Check if already unlocked (stored in sessionStorage)
  const unlocked = getUnlocked();
  if (unlocked.includes(listingId)) {
    showUnlockedCard(listingId);
    return;
  }

  currentUnlockId = listingId;
  showUnlockModal(listing);
}

function getUnlocked() {
  try {
    return JSON.parse(sessionStorage.getItem('enermind_unlocked') || '[]');
  } catch { return []; }
}

function saveUnlocked(id) {
  const list = getUnlocked();
  if (!list.includes(id)) list.push(id);
  sessionStorage.setItem('enermind_unlocked', JSON.stringify(list));
}

function showUnlockModal(listing) {
  const modal = document.getElementById('unlockModal');
  if (!modal) return;
  document.getElementById('modalListingTitle').textContent = listing.title;
  document.getElementById('modalUnlockFee').textContent = `KES ${listing.unlockFee}`;
  document.getElementById('modalUnlockFeeBtn').textContent = `Pay KES ${listing.unlockFee} via M-Pesa`;
  modal.style.display = 'flex';
  document.getElementById('stkStep').style.display = 'none';
  document.getElementById('payStep').style.display = 'block';
}

function closeUnlockModal() {
  const modal = document.getElementById('unlockModal');
  if (modal) modal.style.display = 'none';
  currentUnlockId = null;
}

function submitUnlockPayment() {
  const phone = document.getElementById('buyerPhone').value.trim();
  const name = document.getElementById('buyerName').value.trim();

  if (!name) { alert('Please enter your name.'); return; }
  if (!phone || phone.length < 9) { alert('Please enter a valid Safaricom number.'); return; }

  const listing = LISTINGS.find(l => l.id === currentUnlockId);
  if (!listing) return;

  // Show STK push pending screen
  document.getElementById('payStep').style.display = 'none';
  document.getElementById('stkStep').style.display = 'block';
  document.getElementById('stkPhoneDisplay').textContent = phone;

  if (PESAPAL_CONFIG.demoMode) {
    // Demo: simulate STK push → auto-complete after 3 seconds
    setTimeout(() => {
      saveUnlocked(currentUnlockId);
      closeUnlockModal();
      renderAfterUnlock(currentUnlockId);
    }, 3000);
  } else {
    // Production: call your backend to initiate Pesapal STK push
    initiateRealPayment({ phone, name, listing });
  }
}

async function initiateRealPayment({ phone, name, listing }) {
  try {
    const res = await fetch('/api/initiate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        name,
        amount: listing.unlockFee,
        listingId: listing.id,
        description: `Unlock: ${listing.title}`
      })
    });
    const data = await res.json();
    if (data.success) {
      pollPaymentStatus(data.orderId, listing.id);
    } else {
      alert('Payment initiation failed. Please try again.');
      document.getElementById('payStep').style.display = 'block';
      document.getElementById('stkStep').style.display = 'none';
    }
  } catch (err) {
    console.error(err);
    alert('Network error. Please try again.');
  }
}

function pollPaymentStatus(orderId, listingId) {
  let attempts = 0;
  const interval = setInterval(async () => {
    attempts++;
    if (attempts > 20) { clearInterval(interval); alert('Payment timed out. Please try again.'); return; }
    try {
      const res = await fetch(`/api/payment-status?orderId=${orderId}`);
      const data = await res.json();
      if (data.status === 'COMPLETED') {
        clearInterval(interval);
        saveUnlocked(listingId);
        closeUnlockModal();
        renderAfterUnlock(listingId);
      }
    } catch { /* keep polling */ }
  }, 3000);
}

function renderAfterUnlock(listingId) {
  // Re-render the specific card
  const card = document.querySelector(`[data-listing-id="${listingId}"]`);
  if (!card) { location.reload(); return; }

  const listing = LISTINGS.find(l => l.id === listingId);
  if (!listing) return;

  const contactEl = card.querySelector('.locked-contact');
  const btnEl = card.querySelector('.listing-unlock-btn');

  if (contactEl) {
    contactEl.innerHTML = buildUnlockedContact(listing);
  }
  if (btnEl) {
    btnEl.textContent = '✓ Contact unlocked';
    btnEl.classList.add('unlocked');
    btnEl.disabled = true;
  }
}

function buildUnlockedContact(listing) {
  return `
    <div class="unlocked-contact">
      <p>
        <strong>${listing.seller.name}</strong><br>
        ${listing.seller.farm}<br>
        📍 ${listing.seller.location}
      </p>
      <div class="contact-actions">
        <a href="tel:${listing.seller.phone}" class="contact-btn phone">📞 Call</a>
        <a href="https://wa.me/${listing.seller.whatsapp.replace(/\D/g,'')}" target="_blank" class="contact-btn whatsapp">💬 WhatsApp</a>
      </div>
    </div>`;
}

// ---- RENDER LISTING CARD ----
function buildListingCard(listing, compact = false) {
  const unlocked = getUnlocked();
  const isUnlocked = unlocked.includes(listing.id);

  const contactSection = isUnlocked
    ? buildUnlockedContact(listing)
    : `<div class="locked-contact">
        <div class="locked-blur">
          <p>📞 +254 7XX XXX XXX<br>💬 WhatsApp available<br>📍 ${listing.county} — full address hidden</p>
        </div>
        <div class="locked-overlay"><span style="font-size:18px">🔒</span></div>
      </div>`;

  const unlockBtn = isUnlocked
    ? `<button class="listing-unlock-btn unlocked" disabled>✓ Contact unlocked</button>`
    : `<button class="listing-unlock-btn" onclick="unlockContact(${listing.id})">🔓 Unlock — KES ${listing.unlockFee}</button>`;

  return `
    <div class="listing-card" data-listing-id="${listing.id}" data-cat="${listing.cat}">
      <span class="listing-badge ${listing.badgeClass}">${listing.badge}</span>
      <div class="listing-card-body">
        <div class="listing-cat">${listing.category}</div>
        <div class="listing-title">${listing.title}</div>
        <div class="listing-loc">📍 ${listing.county}, ${listing.region}</div>
        <div class="listing-price">${listing.price} <span class="listing-price-note">${listing.unit}</span></div>
        <div class="listing-pills">${listing.pills.map(p => `<span class="listing-pill">${p}</span>`).join('')}</div>
        ${contactSection}
        ${unlockBtn}
      </div>
    </div>`;
}

// ---- HOMEPAGE LISTINGS ----
function filterListings(cat, btn) {
  document.querySelectorAll('.ltab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const grid = document.getElementById('listingsGrid');
  if (!grid) return;

  const filtered = cat === 'all' ? LISTINGS.slice(0, 6) : LISTINGS.filter(l => l.cat === cat).slice(0, 6);
  grid.innerHTML = filtered.length
    ? filtered.map(l => (window.buildListingCardV2 || buildListingCard)(l)).join('')
    : '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No listings in this category yet</h3><p>Check back soon or browse all.</p></div>';
}

// ---- LISTINGS PAGE ----
function initListingsPage() {
  const grid = document.getElementById('fullListingsGrid');
  if (!grid) return;

  renderListingsPage();

  const searchInput = document.getElementById('searchInput');
  const countyFilter = document.getElementById('countyFilter');
  const catFilter = document.getElementById('catFilter');
  const sortFilter = document.getElementById('sortFilter');

  [searchInput, countyFilter, catFilter, sortFilter].forEach(el => {
    if (el) el.addEventListener('input', renderListingsPage);
  });

  // URL param filter
  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get('cat');
  if (catParam && catFilter) {
    catFilter.value = catParam;
    renderListingsPage();
  }
}

function renderListingsPage() {
  const grid = document.getElementById('fullListingsGrid');
  if (!grid) return;

  const search = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const county = document.getElementById('countyFilter')?.value || '';
  const cat = document.getElementById('catFilter')?.value || '';

  let filtered = LISTINGS.filter(l => {
    const matchSearch = !search || l.title.toLowerCase().includes(search) || l.county.toLowerCase().includes(search) || l.category.toLowerCase().includes(search);
    const matchCounty = !county || l.county === county;
    const matchCat = !cat || l.cat === cat;
    return matchSearch && matchCounty && matchCat;
  });

  const resultCount = document.getElementById('resultCount');
  if (resultCount) resultCount.textContent = `${filtered.length} listing${filtered.length !== 1 ? 's' : ''} found`;

  grid.innerHTML = filtered.length
    ? filtered.map(l => (window.buildListingCardV2 || buildListingCard)(l)).join('')
    : '<div class="empty-state" style="grid-column:1/-1"><div class="icon">🔍</div><h3>No listings match your search</h3><p>Try different keywords or remove filters.</p></div>';
}

// ---- DIRECTORY PAGE ----
function initDirectoryPage() {
  const grid = document.getElementById('dirGrid');
  if (!grid) return;

  renderDirectory();

  const searchInput = document.getElementById('dirSearch');
  const roleFilter = document.getElementById('roleFilter');
  if (searchInput) searchInput.addEventListener('input', renderDirectory);
  if (roleFilter) roleFilter.addEventListener('change', renderDirectory);
}

function renderDirectory() {
  const grid = document.getElementById('dirGrid');
  if (!grid) return;

  const search = (document.getElementById('dirSearch')?.value || '').toLowerCase();
  const role = document.getElementById('roleFilter')?.value || '';

  const roleColors = {
    'Farmer': { bg: '#e8f5e0', text: '#27500A' },
    'Agrovet': { bg: '#e6f1fb', text: '#0C447C' },
    'Feed Seller': { bg: '#faeeda', text: '#633806' },
    'Buyer': { bg: '#f5ede2', text: '#6b3a1f' },
  };

  const filtered = DIRECTORY.filter(d => {
    const matchSearch = !search || d.name.toLowerCase().includes(search) || d.sub.toLowerCase().includes(search);
    const matchRole = !role || d.role === role;
    return matchSearch && matchRole;
  });

  grid.innerHTML = filtered.map(d => {
    const col = roleColors[d.role] || { bg: '#eee', text: '#333' };
    const stars = '★'.repeat(Math.floor(d.rating)) + (d.rating % 1 >= 0.5 ? '½' : '');
    return `
      <div class="dir-card">
        <div class="dir-avatar" style="background:${d.avatarColor};color:${d.avatarText}">${d.initials}</div>
        <h3>${d.name}</h3>
        <div class="dir-card-sub">${d.sub}</div>
        <div>
          <span class="stars">${stars}</span>
          <span style="font-size:12px;color:var(--gray-600);margin-left:4px">${d.rating} (${d.reviews} reviews)</span>
        </div>
        <span class="role-badge" style="background:${col.bg};color:${col.text};font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600;letter-spacing:.06em">${d.role}</span>
        <div class="dir-tags">${d.tags.map(t => `<span class="dir-tag">${t}</span>`).join('')}</div>
      </div>`;
  }).join('') || '<div class="empty-state" style="grid-column:1/-1"><div class="icon">👤</div><h3>No results found</h3></div>';
}

// ---- LIST FARM PAGE ----
let selectedPlan = 'standard';
let listingStep = 1;

function initListFarmPage() {
  const form = document.getElementById('listFarmForm');
  if (!form) return;

  selectPlan('standard');

  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get('role');
  if (role) {
    const roleSelect = document.getElementById('sellerRole');
    if (roleSelect) {
      const map = { farmer: 'Farmer', agrovet: 'Agrovet', feed: 'Feed Seller', buyer: 'Buyer' };
      if (map[role]) roleSelect.value = map[role];
    }
  }

  updateSidebar();
}

function selectPlan(planId) {
  selectedPlan = planId;
  document.querySelectorAll('.plan-card').forEach(c => c.classList.remove('active'));
  const el = document.querySelector(`[data-plan="${planId}"]`);
  if (el) el.classList.add('active');
  updateSidebar();
}

function updateSidebar() {
  const plan = PLANS.find(p => p.id === selectedPlan);
  if (!plan) return;
  const el = document.getElementById('sidebarPlanName');
  const el2 = document.getElementById('sidebarPlanPrice');
  const el3 = document.getElementById('sidebarTotal');
  if (el) el.textContent = `${plan.name} plan (${plan.duration})`;
  if (el2) el2.textContent = `KES ${plan.price}`;
  if (el3) el3.textContent = `KES ${plan.price}`;
}

function submitListingForm() {
  const name = document.getElementById('sellerName')?.value.trim();
  const phone = document.getElementById('sellerPhone')?.value.trim();
  const email = document.getElementById('sellerEmail')?.value.trim();
  const county = document.getElementById('sellerCounty')?.value;
  const title = document.getElementById('listingTitle')?.value.trim();
  const role = document.getElementById('sellerRole')?.value;

  if (!name || !phone || !county || !title || !role) {
    alert('Please fill in all required fields.');
    return;
  }

  const plan = PLANS.find(p => p.id === selectedPlan);
  showListingPaymentModal(plan, { name, phone, email });
}

function showListingPaymentModal(plan, sellerInfo) {
  const modal = document.getElementById('listingPayModal');
  if (!modal) return;
  document.getElementById('listingPayAmount').textContent = `KES ${plan.price}`;
  document.getElementById('listingPayPlanName').textContent = `${plan.name} plan — ${plan.duration}`;
  document.getElementById('listingPayBtn').textContent = `Pay KES ${plan.price} via M-Pesa`;
  document.getElementById('listingPayPhone').value = sellerInfo.phone;
  modal.style.display = 'flex';
  document.getElementById('listingPayStep1').style.display = 'block';
  document.getElementById('listingPayStep2').style.display = 'none';
}

function closeListingPayModal() {
  const modal = document.getElementById('listingPayModal');
  if (modal) modal.style.display = 'none';
}

function submitListingPayment() {
  const phone = document.getElementById('listingPayPhone').value.trim();
  if (!phone || phone.length < 9) { alert('Enter a valid Safaricom number.'); return; }

  document.getElementById('listingPayStep1').style.display = 'none';
  document.getElementById('listingPayStep2').style.display = 'block';
  document.getElementById('listingPayPhoneDisplay').textContent = phone;

  // Demo: show success after 3 seconds
  setTimeout(() => {
    closeListingPayModal();
    document.getElementById('listFormSuccess').style.display = 'flex';
    document.getElementById('listFarmFormWrapper').style.display = 'none';
  }, 3000);
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Homepage listings
  const homeGrid = document.getElementById('listingsGrid');
  if (homeGrid) {
    homeGrid.innerHTML = LISTINGS.slice(0, 6).map(l => buildListingCardV2(l)).join('');
  }

  initListingsPage();
  initDirectoryPage();
  initListFarmPage();
});

// =============================================
// NEW FEATURES — ENERMIND V2
// =============================================

// ---- FAVOURITES ----
function getFavourites() {
  try { return JSON.parse(localStorage.getItem('enermind_favs') || '[]'); } catch { return []; }
}

function toggleFavourite(id, btn) {
  let favs = getFavourites();
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    btn.textContent = '🤍';
    btn.title = 'Save to favourites';
  } else {
    favs.push(id);
    btn.textContent = '❤️';
    btn.title = 'Saved!';
    showToast('Saved to favourites!');
  }
  localStorage.setItem('enermind_favs', JSON.stringify(favs));
}

// ---- WHATSAPP QUICK CONNECT ----
function whatsappEnquire(listingId) {
  const listing = LISTINGS.find(l => l.id === listingId);
  if (!listing) return;
  const msg = encodeURIComponent(
    `Hi! I found your listing on Enermind Poultry Platform.\n\n*${listing.title}*\nCounty: ${listing.county}\nPrice: ${listing.price} ${listing.unit}\n\nIs this still available?`
  );
  window.open(`https://wa.me/254700000001?text=${msg}`, '_blank');
}

// ---- TOAST NOTIFICATIONS ----
function showToast(message, duration = 2500) {
  let toast = document.getElementById('enermindToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'enermindToast';
    toast.style.cssText = 'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#1a3d08;color:#fff;padding:12px 24px;border-radius:100px;font-size:14px;font-weight:600;z-index:9999;opacity:0;transition:opacity .2s;box-shadow:0 4px 20px rgba(0,0,0,0.2);pointer-events:none';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => { toast.style.opacity = '0'; }, duration);
}

// ---- SHARE LISTING ----
function shareListing(id) {
  const listing = LISTINGS.find(l => l.id === id);
  if (!listing) return;
  const text = `Check out this listing on Enermind: ${listing.title} — ${listing.price} ${listing.unit} in ${listing.county}. Browse more at enermindcompany.co.ke`;
  if (navigator.share) {
    navigator.share({ title: listing.title, text, url: window.location.href });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Link copied to clipboard!'));
  }
}

// ---- ENHANCED buildListingCard (v2) ----
function buildListingCardV2(listing, compact = false) {
  const unlocked = getUnlocked();
  const isUnlocked = unlocked.includes(listing.id);
  const favs = getFavourites();
  const isFav = favs.includes(listing.id);

  const contactSection = isUnlocked
    ? buildUnlockedContact(listing)
    : `<div class="locked-contact">
        <div class="locked-blur">
          <p>📞 +254 7XX XXX XXX<br>💬 WhatsApp available<br>📍 ${listing.county} — full address hidden</p>
        </div>
        <div class="locked-overlay"><span style="font-size:18px">🔒</span></div>
      </div>`;

  const unlockBtn = isUnlocked
    ? `<button class="listing-unlock-btn unlocked" disabled>✓ Contact unlocked</button>`
    : `<button class="listing-unlock-btn" onclick="unlockContact(${listing.id})">🔓 Unlock — KES ${listing.unlockFee}</button>`;

  return `
    <div class="listing-card" data-listing-id="${listing.id}" data-cat="${listing.cat}" style="position:relative">
      <span class="listing-badge ${listing.badgeClass}">${listing.badge}</span>
      <div style="position:absolute;top:12px;right:12px;display:flex;gap:6px;z-index:2">
        <button onclick="toggleFavourite(${listing.id},this)" title="${isFav ? 'Saved!' : 'Save to favourites'}" style="border:none;background:rgba(255,255,255,0.9);border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.1)">${isFav ? '❤️' : '🤍'}</button>
        <button onclick="shareListing(${listing.id})" title="Share listing" style="border:none;background:rgba(255,255,255,0.9);border-radius:50%;width:32px;height:32px;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,.1)">↗️</button>
      </div>
      <div class="listing-card-body">
        <div class="listing-cat">${listing.category}</div>
        <div class="listing-title">${listing.title}</div>
        <div class="listing-loc">📍 ${listing.county}, ${listing.region}</div>
        <div class="listing-price">${listing.price} <span class="listing-price-note">${listing.unit}</span></div>
        <div class="listing-pills">${listing.pills.map(p => `<span class="listing-pill">${p}</span>`).join('')}</div>
        ${contactSection}
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-top:.75rem">
          ${unlockBtn}
          <button onclick="whatsappEnquire(${listing.id})" style="flex:1;padding:9px 14px;border:1px solid #25D366;color:#25D366;background:#fff;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;min-width:120px">💬 WhatsApp</button>
        </div>
      </div>
    </div>`;
}

// Override the old buildListingCard on pages that load after this script
if (typeof window !== 'undefined') {
  window.buildListingCardV2 = buildListingCardV2;
}

