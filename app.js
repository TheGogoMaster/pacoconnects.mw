let beats = [
  { id: 1, title: "CANDLES", bpm: 145, key: "Gm", genre: "Afro Beat", mood: "Energetic", samples: "Exclusive", price: 299, date: "Aug 18, 2024", status: "published", sold: false, producer: "Thyolani Beats" },
  { id: 2, title: "ABERRATION", bpm: 165, key: "A#m", genre: "Trap", mood: "Dark", samples: "Exclusive", price: 349, date: "Aug 13, 2024", status: "published", sold: false, producer: "DJ KAYA" },
  { id: 3, title: "FORTUNA 52", bpm: 152, key: "Dm", genre: "Trap", mood: "Energetic", samples: "Exclusive", price: 599, date: "Aug 9, 2024", status: "published", sold: false, producer: "MALAWI MADE" },
  { id: 4, title: "FACE ID", bpm: 95, key: "Em", genre: "Trap", mood: "Chill", samples: "Exclusive", price: 599, date: "Jul 26, 2024", status: "published", sold: false, producer: "Thyolani Beats" },
  { id: 5, title: "DOPAMINE", bpm: 164, key: "Fm", genre: "Trap", mood: "Energetic", samples: "Exclusive", price: 599, date: "Jul 24, 2024", status: "sold", sold: true, producer: "DJ KAYA" },
  { id: 6, title: "Flabella", bpm: 110, key: "Am", genre: "Afro Beat", mood: "Happy", samples: "Exclusive", price: 199, date: "Jul 20, 2024", status: "published", sold: false, producer: "MALAWI MADE" },
  { id: 7, title: "Zoe", bpm: 120, key: "Gm", genre: "Afro Beat", mood: "Chill", samples: "Exclusive", price: 199, date: "Jul 15, 2024", status: "published", sold: false, producer: "Thyolani Beats" },
  { id: 8, title: "Mtima", bpm: 90, key: "Am", genre: "Afro Beat", mood: "Chill", samples: "Royalty free", price: 199, date: "May 28, 2024", status: "sold", sold: true, producer: "Thyolani Beats" }
];

let purchases = [
  { id: 1, beatName: "Lilongwe Nights", producer: "Thyolani Beats", license: "Exclusive", price: 80000, date: "Jan 15, 2026", status: "Completed", downloadUrl: "#" },
  { id: 2, beatName: "Mzuzu Bounce", producer: "DJ KAYA", license: "Non-Exclusive", price: 35000, date: "Dec 10, 2025", status: "Completed", downloadUrl: "#" }
];

let wishlist = [];

const producers = [
  { id: 1, name: "Thyolani Beats", rating: 4.8, genre: "Afrobeat, Amapiano" },
  { id: 2, name: "DJ KAYA", rating: 4.9, genre: "Trap, Electronic" },
  { id: 3, name: "MALAWI MADE", rating: 4.7, genre: "Amapiano, Club" }
];

let users = JSON.parse(localStorage.getItem('paco_users')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('paco_current')) || null;

if (users.length === 0) {
  users = [
    { id: 1, type: "seller", artistName: "Thyolani Beats", email: "producer@paco.com", firstname: "Tiyamike", lastname: "Thyolani", phone: "+265888123456", facebook: "thyolani", gvtId: "12345678", password: "producer", username: "producer", beats: beats.map(b => b.id), stats: { beatsSoldAlltime: 26, beatsSoldYear: 26, beatsSoldMonth: 3, earnedAlltime: 267.46, earnedYear: 133.73 } },
    { id: 2, type: "buyer", fullname: "John Buyer", username: "buyer", cosomaId: "COSOMA-001", phone: "+265888999000", email: "buyer@paco.com", password: "buyer", purchases: purchases.map(p => p.id), totalSpent: 115000 }
  ];
  localStorage.setItem('paco_users', JSON.stringify(users));
}

function renderBeats(filteredBeats = beats) {
  const grid = document.getElementById('beatGrid');
  if (!grid) return;
  const hideSold = document.getElementById('hideSold')?.checked || false;
  const visibleBeats = hideSold ? filteredBeats.filter(b => !b.sold) : filteredBeats;
  const countDisplay = document.getElementById('beatCount');
  if (countDisplay) countDisplay.textContent = `Showing ${visibleBeats.length} beats`;
  grid.innerHTML = visibleBeats.map(beat => `
    <div class="beat-card">
      <div class="beat-cover"><i class="fas fa-headphones"></i></div>
      <div class="beat-info">
        <div class="beat-title">${beat.title}</div>
        <div class="beat-meta"><span>${beat.bpm} BPM</span><span>${beat.key}</span><span>${beat.genre}</span></div>
        <div class="beat-price">MK ${beat.price.toLocaleString()}</div>
        <button class="btn-cart" onclick="addToCart(${beat.id})">${beat.sold ? 'Sold' : 'Add to cart'}</button>
      </div>
    </div>
  `).join('');
}

function filterBeats() {
  let filtered = [...beats];
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const activeGenre = document.querySelector('.genre-btn.active')?.textContent;
  const activeCategory = document.querySelector('.filter-btn.active')?.dataset.filter;
  if (searchTerm) filtered = filtered.filter(b => b.title.toLowerCase().includes(searchTerm) || b.genre.toLowerCase().includes(searchTerm));
  if (activeGenre) filtered = filtered.filter(b => b.genre === activeGenre);
  if (activeCategory === 'new') filtered = filtered.filter(b => b.id > 6);
  else if (activeCategory === 'super-sale') filtered = filtered.filter(b => b.price < 400);
  else if (activeCategory === 'premium') filtered = filtered.filter(b => b.price >= 500);
  renderBeats(filtered);
}

window.addToCart = function(beatId) {
  const beat = beats.find(b => b.id === beatId);
  if (beat && !beat.sold) alert(`${beat.title} added to cart! 70/20/10 split applies. Producer 70%, PACO 20%, COSOMA 10%.`);
  else if (beat?.sold) alert('This beat has already been sold!');
  else alert('Please login to add to cart');
};

function renderSellerMyBeatsTable(statusFilter = 'all') {
  if (!currentUser || currentUser.type !== 'seller') {
    const tbody = document.getElementById('myBeatsTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="empty-state">You are not a seller. Register as a seller to upload beats.</td></tr>';
    return;
  }
  let userBeats = beats.filter(b => currentUser.beats?.includes(b.id));
  if (statusFilter !== 'all') userBeats = userBeats.filter(b => b.status === statusFilter);
  const tbody = document.getElementById('myBeatsTableBody');
  if (tbody) {
    tbody.innerHTML = userBeats.map(beat => `
      <tr>
        <td><i class="fas fa-headphones"></i></td>
        <td><strong>${beat.title}</strong></td>
        <td>${beat.genre}</td>
        <td>${beat.mood || '—'}</td>
        <td>${beat.samples || 'Exclusive'}</td>
        <td>MK ${beat.price.toLocaleString()}</td>
        <td>${beat.date}</td>
        <td><span class="status-badge" style="background:rgba(16,185,129,0.2); color:#10b981;">${beat.status.toUpperCase()}</span></td>
        <td>${beat.sold ? '<button class="btn-small">Invoice</button>' : 'Not sold'}</td>
      </tr>
    `).join('');
  }
  const beatsCountSpan = document.getElementById('myBeatsCount');
  if (beatsCountSpan) beatsCountSpan.textContent = userBeats.length;
}

function updateSellerDashboardStats() {
  if (!currentUser || currentUser.type !== 'seller') return;
  const stats = currentUser.stats || { beatsSoldAlltime: 0, beatsSoldYear: 0, beatsSoldMonth: 0, earnedAlltime: 0, earnedYear: 0 };
  const soldAlltime = document.getElementById('beatsSoldAlltime');
  const uploaded = document.getElementById('beatsUploaded');
  const soldYear = document.getElementById('beatsSoldYear');
  const soldMonth = document.getElementById('beatsSoldMonth');
  const earnedAlltime = document.getElementById('earnedAlltime');
  const earnedYear = document.getElementById('earnedYear');
  const dashUserName = document.getElementById('dashUserName');
  const userId = document.getElementById('userId');
  const userRank = document.getElementById('userRank');
  if (soldAlltime) soldAlltime.textContent = stats.beatsSoldAlltime;
  if (uploaded) uploaded.textContent = currentUser.beats?.length || 0;
  if (soldYear) soldYear.textContent = stats.beatsSoldYear;
  if (soldMonth) soldMonth.textContent = stats.beatsSoldMonth;
  if (earnedAlltime) earnedAlltime.textContent = `MK ${(stats.earnedAlltime * 1000).toLocaleString()}`;
  if (earnedYear) earnedYear.textContent = `MK ${(stats.earnedYear * 1000).toLocaleString()}`;
  if (dashUserName) dashUserName.textContent = currentUser.firstname || 'Producer';
  if (userId) userId.textContent = currentUser.id || 'PACO-1756';
  if (userRank) userRank.textContent = Math.floor(Math.random() * 200) + 1;
}

function renderBuyerPurchases() {
  if (!currentUser || currentUser.type !== 'buyer') {
    const tbody = document.getElementById('buyerPurchasesBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="empty-state">You are not a buyer. Register as a buyer to purchase beats.</td></tr>';
    return;
  }
  let userPurchases = purchases;
  const tbody = document.getElementById('buyerPurchasesBody');
  if (tbody) {
    tbody.innerHTML = userPurchases.map(p => `
      <tr>
        <td><strong>${p.beatName}</strong></td>
        <td>${p.producer}</td>
        <td>${p.license}</td>
        <td>MK ${p.price.toLocaleString()}</td>
        <td>${p.status}</td>
        <td><button class="btn-small" onclick="downloadBeat(${p.id})">Download</button></td>
      </tr>
    `).join('');
  }
  const purchasesCountSpan = document.getElementById('buyerPurchasesCount');
  if (purchasesCountSpan) purchasesCountSpan.textContent = userPurchases.length;
  const totalSpentSpan = document.getElementById('buyerTotalSpent');
  if (totalSpentSpan) {
    const total = userPurchases.reduce((sum, p) => sum + p.price, 0);
    totalSpentSpan.textContent = `MK ${total.toLocaleString()}`;
  }
  const buyerUserName = document.getElementById('buyerUserName');
  if (buyerUserName) buyerUserName.textContent = currentUser.fullname || currentUser.username;
  const buyerCosomaId = document.getElementById('buyerCosomaId');
  if (buyerCosomaId) buyerCosomaId.textContent = currentUser.cosomaId || 'Not provided';
  const buyerPurchasesCount = document.getElementById('buyerPurchasesCountDash');
  if (buyerPurchasesCount) buyerPurchasesCount.textContent = userPurchases.length;
}

function renderBuyerWishlist() {
  const grid = document.getElementById('buyerWishlistGrid');
  if (!grid) return;
  if (wishlist.length === 0) { grid.innerHTML = '<div class="empty-state">No beats in wishlist</div>'; return; }
  grid.innerHTML = wishlist.map(beat => `
    <div class="beat-card">
      <div class="beat-cover"><i class="fas fa-headphones"></i></div>
      <div class="beat-info">
        <div class="beat-title">${beat.title}</div>
        <div class="beat-meta">${beat.bpm} BPM | ${beat.key}</div>
        <div class="beat-price">MK ${beat.price.toLocaleString()}</div>
        <button class="btn-cart" onclick="addToCart(${beat.id})">Add to Cart</button>
      </div>
    </div>
  `).join('');
  const wishlistCountSpan = document.getElementById('buyerWishlistCount');
  if (wishlistCountSpan) wishlistCountSpan.textContent = wishlist.length;
}

function navigateTo(page) {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) link.classList.add('active');
  });
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  if (page === 'dashboard') {
    if (currentUser?.type === 'seller') {
      document.getElementById('dashboardPage').classList.add('active');
      updateSellerDashboardStats();
      document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
      const overviewTab = document.querySelector('.dashboard-tab[data-dash-tab="overview"]');
      const overviewPane = document.getElementById('dash-overview');
      if (overviewTab) overviewTab.classList.add('active');
      if (overviewPane) overviewPane.classList.add('active');
    } else if (currentUser?.type === 'buyer') {
      document.getElementById('buyerDashboardPage').classList.add('active');
      renderBuyerPurchases();
      renderBuyerWishlist();
      document.querySelectorAll('.buyer-dash-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.buyer-tab-pane').forEach(pane => pane.classList.remove('active'));
      const overviewTab = document.querySelector('.buyer-dash-tab[data-buyer-tab="overview"]');
      const overviewPane = document.getElementById('buyer-overview');
      if (overviewTab) overviewTab.classList.add('active');
      if (overviewPane) overviewPane.classList.add('active');
    } else { alert('Please login to view dashboard'); document.getElementById('beatsPage').classList.add('active'); }
  } else if (page === 'mybeats') {
    if (currentUser?.type === 'seller') {
      document.getElementById('dashboardPage').classList.add('active');
      renderSellerMyBeatsTable();
      document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
      const mybeatsTab = document.querySelector('.dashboard-tab[data-dash-tab="mybeats"]');
      const mybeatsPane = document.getElementById('dash-mybeats');
      if (mybeatsTab) mybeatsTab.classList.add('active');
      if (mybeatsPane) mybeatsPane.classList.add('active');
    } else { alert('Only sellers can access My Beats.'); document.getElementById('beatsPage').classList.add('active'); }
  } else if (page === 'purchases') {
    if (currentUser?.type === 'buyer') {
      document.getElementById('buyerDashboardPage').classList.add('active');
      renderBuyerPurchases();
      document.querySelectorAll('.buyer-dash-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.buyer-tab-pane').forEach(pane => pane.classList.remove('active'));
      const purchasesTab = document.querySelector('.buyer-dash-tab[data-buyer-tab="purchases"]');
      const purchasesPane = document.getElementById('buyer-purchases');
      if (purchasesTab) purchasesTab.classList.add('active');
      if (purchasesPane) purchasesPane.classList.add('active');
    } else if (currentUser?.type === 'seller') {
      document.getElementById('dashboardPage').classList.add('active');
      document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
      const purchasesTab = document.querySelector('.dashboard-tab[data-dash-tab="purchases"]');
      const purchasesPane = document.getElementById('dash-purchases');
      if (purchasesTab) purchasesTab.classList.add('active');
      if (purchasesPane) purchasesPane.classList.add('active');
    } else { alert('Please login to view purchases'); document.getElementById('beatsPage').classList.add('active'); }
  } else if (page === 'wishlist') {
    if (currentUser?.type === 'buyer') {
      document.getElementById('buyerDashboardPage').classList.add('active');
      renderBuyerWishlist();
      document.querySelectorAll('.buyer-dash-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.buyer-tab-pane').forEach(pane => pane.classList.remove('active'));
      const wishlistTab = document.querySelector('.buyer-dash-tab[data-buyer-tab="wishlist"]');
      const wishlistPane = document.getElementById('buyer-wishlist');
      if (wishlistTab) wishlistTab.classList.add('active');
      if (wishlistPane) wishlistPane.classList.add('active');
    } else if (currentUser?.type === 'seller') {
      document.getElementById('dashboardPage').classList.add('active');
      document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
      const wishlistTab = document.querySelector('.dashboard-tab[data-dash-tab="wishlist"]');
      const wishlistPane = document.getElementById('dash-wishlist');
      if (wishlistTab) wishlistTab.classList.add('active');
      if (wishlistPane) wishlistPane.classList.add('active');
    } else { alert('Please login to view wishlist'); document.getElementById('beatsPage').classList.add('active'); }
  } else if (page === 'support') { document.getElementById('supportPage').classList.add('active');
  } else if (page === 'account') {
    document.getElementById('accountPage').classList.add('active');
    if (currentUser) {
      const accArtistName = document.getElementById('accArtistName');
      const accEmail = document.getElementById('accEmail');
      const accCosoma = document.getElementById('accCosoma');
      const accPhone = document.getElementById('accPhone');
      if (accArtistName) accArtistName.value = currentUser.artistName || currentUser.fullname || '';
      if (accEmail) accEmail.value = currentUser.email || '';
      if (accCosoma) accCosoma.value = currentUser.cosomaId || '';
      if (accPhone) accPhone.value = currentUser.phone || '';
    }
  } else if (page === 'beats') { document.getElementById('beatsPage').classList.add('active'); renderBeats();
  } else if (page === 'services') { document.getElementById('servicesPage').classList.add('active');
  } else if (page === 'howitworks') { document.getElementById('howitworksPage').classList.add('active');
  } else if (page === 'contact') { document.getElementById('contactPage').classList.add('active');
  } else if (page === 'customorder') { document.getElementById('customorderPage').classList.add('active'); }
}

function switchDashboardTab(tabId) {
  if (currentUser?.type !== 'seller') return;
  document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
  const targetTab = document.querySelector(`.dashboard-tab[data-dash-tab="${tabId}"]`);
  const targetPane = document.getElementById(`dash-${tabId}`);
  if (targetTab) targetTab.classList.add('active');
  if (targetPane) targetPane.classList.add('active');
  if (tabId === 'mybeats') {
    renderSellerMyBeatsTable();
    document.querySelectorAll('.beat-status-tab').forEach(tab => tab.classList.remove('active'));
    const allTab = document.querySelector('.beat-status-tab[data-beat-status="all"]');
    if (allTab) allTab.classList.add('active');
  }
}

function switchBuyerDashboardTab(tabId) {
  if (currentUser?.type !== 'buyer') return;
  document.querySelectorAll('.buyer-dash-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.buyer-tab-pane').forEach(pane => pane.classList.remove('active'));
  const targetTab = document.querySelector(`.buyer-dash-tab[data-buyer-tab="${tabId}"]`);
  const targetPane = document.getElementById(`buyer-${tabId}`);
  if (targetTab) targetTab.classList.add('active');
  if (targetPane) targetPane.classList.add('active');
  if (tabId === 'purchases') renderBuyerPurchases();
  else if (tabId === 'wishlist') renderBuyerWishlist();
}

function showProducerModal(serviceType) {
  const serviceNames = { original: 'Original Beat', mastering: 'Mastering', mixmaster: 'Mix and Master' };
  const modal = document.getElementById('producerModal');
  const producerList = document.getElementById('producerList');
  if (producerList) {
    producerList.innerHTML = `<h4>Select a producer for ${serviceNames[serviceType]}</h4>${producers.map(p => `<div class="producer-item"><div class="producer-info"><h4>${p.name}</h4><p>★ ${p.rating} | ${p.genre}</p></div><button class="hire-btn" onclick="hireProducer(${p.id}, '${serviceType}')">Hire</button></div>`).join('')}`;
  }
  if (modal) modal.style.display = 'flex';
}

window.hireProducer = function(producerId, serviceType) {
  const producer = producers.find(p => p.id === producerId);
  alert(`Request sent to ${producer.name} for ${serviceType}. They will contact you within 24 hours.`);
  const modal = document.getElementById('producerModal');
  if (modal) modal.style.display = 'none';
};

window.downloadBeat = function(purchaseId) { alert(`Downloading beat #${purchaseId}.`); };

function closeModals() {
  document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
  const profileDropdown = document.querySelector('.profile-dropdown');
  if (profileDropdown) profileDropdown.classList.remove('active');
}

function login() {
  const username = document.getElementById('loginUsername')?.value || '';
  const password = document.getElementById('loginPassword')?.value || '';
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  if (user) {
    currentUser = user;
    sessionStorage.setItem('paco_current', JSON.stringify(user));
    closeModals();
    updateAuthUI();
    if (user.type === 'seller') { updateSellerDashboardStats(); renderSellerMyBeatsTable(); }
    else if (user.type === 'buyer') { renderBuyerPurchases(); renderBuyerWishlist(); }
    alert(`Welcome ${user.artistName || user.fullname || user.username}!`);
    navigateTo('beats');
  } else { alert('Invalid credentials. Try producer/producer or buyer/buyer'); }
}

function sellerSignup() {
  const newSeller = { id: users.length + 1, type: 'seller', artistName: document.getElementById('sellerArtistName')?.value || '', email: document.getElementById('sellerEmail')?.value || '', firstname: document.getElementById('sellerFirstname')?.value || '', lastname: document.getElementById('sellerLastname')?.value || '', phone: document.getElementById('sellerPhone')?.value || '', facebook: document.getElementById('sellerFacebook')?.value || '', gvtId: document.getElementById('sellerGvtId')?.value || '', password: document.getElementById('sellerPassword')?.value || '', username: document.getElementById('sellerEmail')?.value || '', beats: [], stats: { beatsSoldAlltime: 0, beatsSoldYear: 0, beatsSoldMonth: 0, earnedAlltime: 0, earnedYear: 0 } };
  if (!newSeller.artistName || !newSeller.email || !newSeller.password) { alert('Please fill all required fields'); return; }
  users.push(newSeller);
  localStorage.setItem('paco_users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  const loginTab = document.querySelector('.auth-tab[data-auth="login"]');
  if (loginTab) loginTab.classList.add('active');
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.classList.add('active');
}

function buyerSignup() {
  const newBuyer = { id: users.length + 1, type: 'buyer', fullname: document.getElementById('buyerFullname')?.value || '', username: document.getElementById('buyerUsername')?.value || '', cosomaId: document.getElementById('buyerCosoma')?.value || '', phone: document.getElementById('buyerPhone')?.value || '', email: document.getElementById('buyerEmail')?.value || '', password: document.getElementById('buyerPassword')?.value || '', purchases: [], totalSpent: 0 };
  if (!newBuyer.fullname || !newBuyer.username || !newBuyer.password) { alert('Please fill all required fields'); return; }
  users.push(newBuyer);
  localStorage.setItem('paco_users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  const loginTab = document.querySelector('.auth-tab[data-auth="login"]');
  if (loginTab) loginTab.classList.add('active');
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.classList.add('active');
}

function updateAuthUI() {
  const profileBtn = document.getElementById('profileBtn');
  const profileNameSpan = document.getElementById('profileName');
  const dropdownUserName = document.getElementById('dropdownUserName');
  if (currentUser && profileBtn) {
    const displayName = currentUser.artistName || currentUser.firstname || currentUser.fullname || currentUser.username;
    if (profileNameSpan) profileNameSpan.textContent = displayName;
    if (dropdownUserName) dropdownUserName.textContent = `${displayName} ${currentUser.lastname || ''}`.trim();
    profileBtn.style.borderColor = 'var(--success)';
  } else if (profileBtn) {
    if (profileNameSpan) profileNameSpan.textContent = 'Sign In';
    if (dropdownUserName) dropdownUserName.textContent = 'Guest User';
    profileBtn.style.borderColor = 'var(--border-color)';
  }
}

function saveAccountSettings() {
  if (currentUser) {
    const artistName = document.getElementById('accArtistName')?.value || '';
    const email = document.getElementById('accEmail')?.value || '';
    const cosomaId = document.getElementById('accCosoma')?.value || '';
    const phone = document.getElementById('accPhone')?.value || '';
    if (currentUser.type === 'seller') currentUser.artistName = artistName;
    else currentUser.fullname = artistName;
    currentUser.email = email;
    currentUser.cosomaId = cosomaId;
    currentUser.phone = phone;
    sessionStorage.setItem('paco_current', JSON.stringify(currentUser));
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) users[idx] = currentUser;
    localStorage.setItem('paco_users', JSON.stringify(users));
    updateAuthUI();
    alert('Account saved!');
  }
}

function logout() { sessionStorage.clear(); currentUser = null; location.reload(); }

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-link').forEach(link => { link.addEventListener('click', () => { const page = link.dataset.page; if (page) navigateTo(page); }); });
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => { e.stopPropagation(); if (!currentUser) { const authModal = document.getElementById('authModal'); if (authModal) authModal.style.display = 'flex'; } else { if (profileDropdown) profileDropdown.classList.toggle('active'); } });
  }
  document.addEventListener('click', () => { if (profileDropdown) profileDropdown.classList.remove('active'); });
  document.querySelectorAll('.dropdown-item[data-nav]').forEach(item => { item.addEventListener('click', (e) => { e.stopPropagation(); const nav = item.dataset.nav; if (profileDropdown) profileDropdown.classList.remove('active'); if (nav === 'logout') logout(); else navigateTo(nav); }); });
  document.querySelectorAll('.dashboard-tab').forEach(tab => { tab.addEventListener('click', () => { const tabId = tab.dataset.dashTab; if (tabId) switchDashboardTab(tabId); }); });
  document.querySelectorAll('.buyer-dash-tab').forEach(tab => { tab.addEventListener('click', () => { const tabId = tab.dataset.buyerTab; if (tabId) switchBuyerDashboardTab(tabId); }); });
  document.querySelectorAll('.beat-status-tab').forEach(tab => { tab.addEventListener('click', () => { document.querySelectorAll('.beat-status-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); const status = tab.dataset.beatStatus; if (status) renderSellerMyBeatsTable(status); }); });
  document.querySelectorAll('.filter-btn').forEach(btn => { btn.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); filterBeats(); }); });
  document.querySelectorAll('.genre-btn').forEach(btn => { btn.addEventListener('click', () => { btn.classList.toggle('active'); filterBeats(); }); });
  const searchInput = document.getElementById('searchInput'); if (searchInput) searchInput.addEventListener('input', filterBeats);
  const hideSoldCheckbox = document.getElementById('hideSold'); if (hideSoldCheckbox) hideSoldCheckbox.addEventListener('change', filterBeats);
  const resetFiltersBtn = document.getElementById('resetFilters'); if (resetFiltersBtn) { resetFiltersBtn.addEventListener('click', () => { document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active')); document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active')); const allFilter = document.querySelector('.filter-btn[data-filter="all"]'); if (allFilter) allFilter.classList.add('active'); if (searchInput) searchInput.value = ''; if (hideSoldCheckbox) hideSoldCheckbox.checked = false; filterBeats(); }); }
  document.querySelectorAll('.order-now-btn').forEach(btn => { btn.addEventListener('click', () => { if (!currentUser) { alert('Please login first'); const authModal = document.getElementById('authModal'); if (authModal) authModal.style.display = 'flex'; return; } const service = btn.dataset.service; if (service) showProducerModal(service); }); });
  document.querySelectorAll('.tab-btn').forEach(btn => { btn.addEventListener('click', () => { const tabId = btn.dataset.tab; document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active'); document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active')); const targetPane = document.getElementById(`tab-${tabId}`); if (targetPane) targetPane.classList.add('active'); }); });
  const doLoginBtn = document.getElementById('doLoginBtn'); if (doLoginBtn) doLoginBtn.addEventListener('click', login);
  const doSellerSignup = document.getElementById('doSellerSignup'); if (doSellerSignup) doSellerSignup.addEventListener('click', sellerSignup);
  const doBuyerSignup = document.getElementById('doBuyerSignup'); if (doBuyerSignup) doBuyerSignup.addEventListener('click', buyerSignup);
  const saveAccountBtn = document.getElementById('saveAccountBtn'); if (saveAccountBtn) saveAccountBtn.addEventListener('click', saveAccountSettings);
  document.querySelectorAll('.auth-tab').forEach(tab => { tab.addEventListener('click', () => { const authType = tab.dataset.auth; document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active')); tab.classList.add('active'); document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active')); let targetForm = null; if (authType === 'login') targetForm = document.getElementById('loginForm'); if (authType === 'sellerSignup') targetForm = document.getElementById('sellerSignupForm'); if (authType === 'buyerSignup') targetForm = document.getElementById('buyerSignupForm'); if (targetForm) targetForm.classList.add('active'); }); });
  document.querySelectorAll('.close-modal').forEach(btn => { btn.addEventListener('click', () => { const modal = btn.closest('.modal'); if (modal) modal.style.display = 'none'; }); });
  window.addEventListener('click', (e) => { document.querySelectorAll('.modal').forEach(modal => { if (e.target === modal) modal.style.display = 'none'; }); });
  const addBeatBtn = document.getElementById('addBeatBtn'); if (addBeatBtn) { addBeatBtn.addEventListener('click', () => { if (!currentUser) { alert('Please login as a seller'); const authModal = document.getElementById('authModal'); if (authModal) authModal.style.display = 'flex'; } else if (currentUser.type !== 'seller') { alert('Only sellers can add beats.'); } else { alert('Add beat form would open here.'); } }); }
  renderBeats();
  updateAuthUI();
  if (currentUser?.type === 'seller') { updateSellerDashboardStats(); renderSellerMyBeatsTable(); }
  if (currentUser?.type === 'buyer') { renderBuyerPurchases(); renderBuyerWishlist(); }
});
