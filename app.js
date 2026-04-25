// Beat Data
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

// Purchases data (for buyers)
let purchases = [
  { id: 1, beatName: "Lilongwe Nights", producer: "Thyolani Beats", license: "Exclusive", price: 80000, date: "Jan 15, 2026", status: "Completed", downloadUrl: "#" },
  { id: 2, beatName: "Mzuzu Bounce", producer: "DJ KAYA", license: "Non-Exclusive", price: 35000, date: "Dec 10, 2025", status: "Completed", downloadUrl: "#" }
];

// Wishlist data
let wishlist = [];

// Producer List
const producers = [
  { id: 1, name: "Thyolani Beats", rating: 4.8, genre: "Afrobeat, Amapiano" },
  { id: 2, name: "DJ KAYA", rating: 4.9, genre: "Trap, Electronic" },
  { id: 3, name: "MALAWI MADE", rating: 4.7, genre: "Amapiano, Club" }
];

// User Data
let users = JSON.parse(localStorage.getItem('paco_users')) || [];
let currentUser = JSON.parse(sessionStorage.getItem('paco_current')) || null;

// Demo Users
if (users.length === 0) {
  users = [
    { id: 1, type: "seller", artistName: "Thyolani Beats", email: "producer@paco.com", firstname: "Tiyamike", lastname: "Thyolani", phone: "+265888123456", facebook: "thyolani", gvtId: "12345678", password: "producer", username: "producer", beats: beats.map(b => b.id), stats: { beatsSoldAlltime: 26, beatsSoldYear: 26, beatsSoldMonth: 3, earnedAlltime: 267.46, earnedYear: 133.73 } },
    { id: 2, type: "buyer", fullname: "John Buyer", username: "buyer", cosomaId: "COSOMA-001", phone: "+265888999000", email: "buyer@paco.com", password: "buyer", purchases: purchases.map(p => p.id), totalSpent: 115000 }
  ];
  localStorage.setItem('paco_users', JSON.stringify(users));
}

// ========== COMMON FUNCTIONS ==========

// Render Beat Cards on Homepage
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

// Filter Beats
function filterBeats() {
  let filtered = [...beats];
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const activeGenre = document.querySelector('.genre-btn.active')?.textContent;
  const activeCategory = document.querySelector('.filter-btn.active')?.dataset.filter;
  
  if (searchTerm) {
    filtered = filtered.filter(b => b.title.toLowerCase().includes(searchTerm) || b.genre.toLowerCase().includes(searchTerm));
  }
  if (activeGenre) {
    filtered = filtered.filter(b => b.genre === activeGenre);
  }
  if (activeCategory === 'new') {
    filtered = filtered.filter(b => b.id > 6);
  } else if (activeCategory === 'super-sale') {
    filtered = filtered.filter(b => b.price < 400);
  } else if (activeCategory === 'premium') {
    filtered = filtered.filter(b => b.price >= 500);
  }
  renderBeats(filtered);
}

// Add to Cart
window.addToCart = function(beatId) {
  const beat = beats.find(b => b.id === beatId);
  if (beat && !beat.sold) {
    alert(`${beat.title} added to cart! 70/20/10 split applies. Producer 70%, PACO 20%, COSOMA 10%.`);
  } else if (beat?.sold) {
    alert('This beat has already been sold!');
  } else {
    alert('Please login to add to cart');
  }
};

// ========== SELLER DASHBOARD FUNCTIONS ==========

// Render Seller My Beats Table
function renderSellerMyBeatsTable(statusFilter = 'all') {
  if (!currentUser || currentUser.type !== 'seller') {
    const tbody = document.getElementById('myBeatsTableBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="9" class="empty-state">You are not a seller. Register as a seller to upload beats.</td></tr>';
    return;
  }
  
  let userBeats = beats.filter(b => currentUser.beats?.includes(b.id));
  if (statusFilter !== 'all') {
    userBeats = userBeats.filter(b => b.status === statusFilter);
  }
  
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

// Update Seller Dashboard Stats
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

// ========== BUYER DASHBOARD FUNCTIONS ==========

// Render Buyer Purchases
function renderBuyerPurchases() {
  if (!currentUser || currentUser.type !== 'buyer') {
    const tbody = document.getElementById('buyerPurchasesBody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="empty-state">You are not a buyer. Register as a buyer to purchase beats.</td></tr>';
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
}

// Render Buyer Wishlist
function renderBuyerWishlist() {
  const grid = document.getElementById('buyerWishlistGrid');
  if (!grid) return;
  
  if (wishlist.length === 0) {
    grid.innerHTML = '<div class="empty-state">No beats in wishlist</div>';
    return;
  }
  
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

// ========== PROFILE DROPDOWN NAVIGATION ==========

// Page Navigation
function navigateTo(page) {
  // Update nav links active state
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) link.classList.add('active');
  });
  
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  
  // Show selected page
  const targetPage = document.getElementById(`${page}Page`);
  if (targetPage) targetPage.classList.add('active');
  
  // Load page-specific data based on user type
  if (page === 'beats') {
    renderBeats();
  } else if (page === 'dashboard') {
    if (currentUser?.type === 'seller') {
      updateSellerDashboardStats();
      // Reset to overview tab
      document.querySelectorAll('.dashboard-tab').forEach(tab => tab.classList.remove('active'));
      document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
      const overviewTab = document.querySelector('.dashboard-tab[data-dash-tab="overview"]');
      const overviewPane = document.getElementById('dash-overview');
      if (overviewTab) overviewTab.classList.add('active');
      if (overviewPane) overviewPane.classList.add('active');
    } else if (currentUser?.type === 'buyer') {
      renderBuyerPurchases();
      renderBuyerWishlist();
    }
  } else if (page === 'mybeats') {
    if (currentUser?.type === 'seller') {
      renderSellerMyBeatsTable();
    } else {
      alert('Only sellers can access My Beats. Register as a seller to upload beats.');
      navigateTo('beats');
    }
  } else if (page === 'purchases') {
    if (currentUser?.type === 'buyer') {
      renderBuyerPurchases();
    } else {
      alert('Only buyers can access My Purchases. Register as a buyer to purchase beats.');
      navigateTo('beats');
    }
  } else if (page === 'wishlist') {
    if (currentUser?.type === 'buyer') {
      renderBuyerWishlist();
    } else {
      alert('Only buyers can access Wishlist. Register as a buyer to save beats.');
      navigateTo('beats');
    }
  } else if (page === 'account' && currentUser) {
    const accArtistName = document.getElementById('accArtistName');
    const accEmail = document.getElementById('accEmail');
    const accCosoma = document.getElementById('accCosoma');
    const accPhone = document.getElementById('accPhone');
    if (accArtistName) accArtistName.value = currentUser.artistName || currentUser.fullname || '';
    if (accEmail) accEmail.value = currentUser.email || '';
    if (accCosoma) accCosoma.value = currentUser.cosomaId || '';
    if (accPhone) accPhone.value = currentUser.phone || '';
  }
}

// Dashboard Tab Navigation (Left Sidebar - Seller only)
function switchDashboardTab(tabId) {
  if (currentUser?.type !== 'seller') return;
  
  // Update sidebar tabs
  document.querySelectorAll('.dashboard-tab').forEach(tab => {
    tab.classList.remove('active');
    if (tab.dataset.dashTab === tabId) tab.classList.add('active');
  });
  
  // Update content panes
  document.querySelectorAll('.dash-tab-pane').forEach(pane => pane.classList.remove('active'));
  const targetPane = document.getElementById(`dash-${tabId}`);
  if (targetPane) targetPane.classList.add('active');
  
  // Load data for specific tabs
  if (tabId === 'mybeats') {
    renderSellerMyBeatsTable();
    // Reset beat status filter to "all"
    document.querySelectorAll('.beat-status-tab').forEach(tab => tab.classList.remove('active'));
    const allTab = document.querySelector('.beat-status-tab[data-beat-status="all"]');
    if (allTab) allTab.classList.add('active');
  } else if (tabId === 'purchases') {
    // Seller purchases view (their sold beats)
    const purchasesPane = document.getElementById('dash-purchases');
    if (purchasesPane) {
      purchasesPane.innerHTML = '<div class="empty-state">View your sold beats and earnings here.</div>';
    }
  } else if (tabId === 'wishlist') {
    const wishlistPane = document.getElementById('dash-wishlist');
    if (wishlistPane) {
      wishlistPane.innerHTML = '<div class="empty-state">Save favorite beats here.</div>';
    }
  }
}

// ========== PRODUCER MODAL ==========

// Show Producer Modal
function showProducerModal(serviceType) {
  const serviceNames = { original: 'Original Beat', mastering: 'Mastering', mixmaster: 'Mix and Master' };
  const modal = document.getElementById('producerModal');
  const producerList = document.getElementById('producerList');
  if (producerList) {
    producerList.innerHTML = `
      <h4>Select a producer for ${serviceNames[serviceType]}</h4>
      ${producers.map(p => `
        <div class="producer-item">
          <div class="producer-info"><h4>${p.name}</h4><p>★ ${p.rating} | ${p.genre}</p></div>
          <button class="hire-btn" onclick="hireProducer(${p.id}, '${serviceType}')">Hire</button>
        </div>
      `).join('')}
    `;
  }
  if (modal) modal.style.display = 'flex';
}

window.hireProducer = function(producerId, serviceType) {
  const producer = producers.find(p => p.id === producerId);
  alert(`Request sent to ${producer.name} for ${serviceType}. They will contact you within 24 hours.`);
  const modal = document.getElementById('producerModal');
  if (modal) modal.style.display = 'none';
};

window.downloadBeat = function(purchaseId) {
  alert(`Downloading beat #${purchaseId}. The file will start downloading shortly.`);
};

// ========== AUTH FUNCTIONS ==========

// Close Modals
function closeModals() {
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => modal.style.display = 'none');
  const profileDropdown = document.querySelector('.profile-dropdown');
  if (profileDropdown) profileDropdown.classList.remove('active');
}

// Login
function login() {
  const username = document.getElementById('loginUsername')?.value || '';
  const password = document.getElementById('loginPassword')?.value || '';
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  
  if (user) {
    currentUser = user;
    sessionStorage.setItem('paco_current', JSON.stringify(user));
    closeModals();
    updateAuthUI();
    
    if (user.type === 'seller') {
      updateSellerDashboardStats();
      renderSellerMyBeatsTable();
    } else if (user.type === 'buyer') {
      renderBuyerPurchases();
      renderBuyerWishlist();
    }
    
    alert(`Welcome ${user.artistName || user.fullname || user.username}!`);
    navigateTo('beats');
  } else {
    alert('Invalid credentials. Try producer/producer or buyer/buyer');
  }
}

// Seller Signup
function sellerSignup() {
  const newSeller = {
    id: users.length + 1,
    type: 'seller',
    artistName: document.getElementById('sellerArtistName')?.value || '',
    email: document.getElementById('sellerEmail')?.value || '',
    firstname: document.getElementById('sellerFirstname')?.value || '',
    lastname: document.getElementById('sellerLastname')?.value || '',
    phone: document.getElementById('sellerPhone')?.value || '',
    facebook: document.getElementById('sellerFacebook')?.value || '',
    gvtId: document.getElementById('sellerGvtId')?.value || '',
    password: document.getElementById('sellerPassword')?.value || '',
    username: document.getElementById('sellerEmail')?.value || '',
    beats: [],
    stats: { beatsSoldAlltime: 0, beatsSoldYear: 0, beatsSoldMonth: 0, earnedAlltime: 0, earnedYear: 0 }
  };
  
  if (!newSeller.artistName || !newSeller.email || !newSeller.password) {
    alert('Please fill all required fields');
    return;
  }
  
  users.push(newSeller);
  localStorage.setItem('paco_users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  
  // Switch to login tab
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  const loginTab = document.querySelector('.auth-tab[data-auth="login"]');
  if (loginTab) loginTab.classList.add('active');
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.classList.add('active');
}

// Buyer Signup
function buyerSignup() {
  const newBuyer = {
    id: users.length + 1,
    type: 'buyer',
    fullname: document.getElementById('buyerFullname')?.value || '',
    username: document.getElementById('buyerUsername')?.value || '',
    cosomaId: document.getElementById('buyerCosoma')?.value || '',
    phone: document.getElementById('buyerPhone')?.value || '',
    email: document.getElementById('buyerEmail')?.value || '',
    password: document.getElementById('buyerPassword')?.value || '',
    purchases: [],
    totalSpent: 0
  };
  
  if (!newBuyer.fullname || !newBuyer.username || !newBuyer.password) {
    alert('Please fill all required fields');
    return;
  }
  
  users.push(newBuyer);
  localStorage.setItem('paco_users', JSON.stringify(users));
  alert('Registration successful! Please login.');
  
  // Switch to login tab
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  const loginTab = document.querySelector('.auth-tab[data-auth="login"]');
  if (loginTab) loginTab.classList.add('active');
  document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.classList.add('active');
}

// Update UI based on login state
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

// Save Account Settings
function saveAccountSettings() {
  if (currentUser) {
    const artistName = document.getElementById('accArtistName')?.value || '';
    const email = document.getElementById('accEmail')?.value || '';
    const cosomaId = document.getElementById('accCosoma')?.value || '';
    const phone = document.getElementById('accPhone')?.value || '';
    
    if (currentUser.type === 'seller') {
      currentUser.artistName = artistName;
    } else {
      currentUser.fullname = artistName;
    }
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

// Logout
function logout() {
  sessionStorage.clear();
  currentUser = null;
  location.reload();
}

// ========== EVENT LISTENERS ==========

document.addEventListener('DOMContentLoaded', () => {
  // Navigation Links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const page = link.dataset.page;
      if (page) navigateTo(page);
    });
  });
  
  // Profile Dropdown Toggle
  const profileBtn = document.getElementById('profileBtn');
  const profileDropdown = document.getElementById('profileDropdown');
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentUser) {
        const authModal = document.getElementById('authModal');
        if (authModal) authModal.style.display = 'flex';
      } else {
        if (profileDropdown) profileDropdown.classList.toggle('active');
      }
    });
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    if (profileDropdown) profileDropdown.classList.remove('active');
  });
  
  // Dropdown Menu Items Navigation
  const dropdownItems = document.querySelectorAll('.dropdown-item[data-nav]');
  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const nav = item.dataset.nav;
      if (profileDropdown) profileDropdown.classList.remove('active');
      
      if (nav === 'logout') {
        logout();
      } else if (nav === 'dashboard') {
        navigateTo('dashboard');
      } else if (nav === 'mybeats') {
        navigateTo('mybeats');
      } else if (nav === 'purchases') {
        navigateTo('purchases');
      } else if (nav === 'wishlist') {
        navigateTo('wishlist');
      } else if (nav === 'support') {
        navigateTo('support');
      } else if (nav === 'account') {
        navigateTo('account');
      }
    });
  });
  
  // Dashboard Sidebar Tabs (Seller only)
  const dashboardTabs = document.querySelectorAll('.dashboard-tab');
  dashboardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabId = tab.dataset.dashTab;
      if (tabId) switchDashboardTab(tabId);
    });
  });
  
  // Beat Status Tabs (inside Seller My Beats)
  const beatStatusTabs = document.querySelectorAll('.beat-status-tab');
  beatStatusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      beatStatusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const status = tab.dataset.beatStatus;
      if (status) renderSellerMyBeatsTable(status);
    });
  });
  
  // Category Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterBeats();
    });
  });
  
  // Genre Buttons
  const genreBtns = document.querySelectorAll('.genre-btn');
  genreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      filterBeats();
    });
  });
  
  // Search Input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.addEventListener('input', filterBeats);
  
  // Hide Sold Checkbox
  const hideSoldCheckbox = document.getElementById('hideSold');
  if (hideSoldCheckbox) hideSoldCheckbox.addEventListener('change', filterBeats);
  
  // Reset Filters Button
  const resetFiltersBtn = document.getElementById('resetFilters');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      genreBtns.forEach(b => b.classList.remove('active'));
      const allFilter = document.querySelector('.filter-btn[data-filter="all"]');
      if (allFilter) allFilter.classList.add('active');
      if (searchInput) searchInput.value = '';
      if (hideSoldCheckbox) hideSoldCheckbox.checked = false;
      filterBeats();
    });
  }
  
  // Services Order Now Buttons
  const orderNowBtns = document.querySelectorAll('.order-now-btn');
  orderNowBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!currentUser) {
        alert('Please login first');
        const authModal = document.getElementById('authModal');
        if (authModal) authModal.style.display = 'flex';
        return;
      }
      const service = btn.dataset.service;
      if (service) showProducerModal(service);
    });
  });
  
  // How it Works Tabs
  const howItWorksTabs = document.querySelectorAll('.tab-btn');
  howItWorksTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      howItWorksTabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabPanes = document.querySelectorAll('.tab-pane');
      tabPanes.forEach(pane => pane.classList.remove('active'));
      const targetPane = document.getElementById(`tab-${tabId}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
  
  // Login Button
  const doLoginBtn = document.getElementById('doLoginBtn');
  if (doLoginBtn) doLoginBtn.addEventListener('click', login);
  
  // Seller Signup Button
  const doSellerSignup = document.getElementById('doSellerSignup');
  if (doSellerSignup) doSellerSignup.addEventListener('click', sellerSignup);
  
  // Buyer Signup Button
  const doBuyerSignup = document.getElementById('doBuyerSignup');
  if (doBuyerSignup) doBuyerSignup.addEventListener('click', buyerSignup);
  
  // Save Account Button
  const saveAccountBtn = document.getElementById('saveAccountBtn');
  if (saveAccountBtn) saveAccountBtn.addEventListener('click', saveAccountSettings);
  
  // Auth Tabs (Login/Seller/Buyer switching)
  const authTabs = document.querySelectorAll('.auth-tab');
  authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const authType = tab.dataset.auth;
      authTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const authForms = document.querySelectorAll('.auth-form');
      authForms.forEach(form => form.classList.remove('active'));
      let targetForm = null;
      if (authType === 'login') targetForm = document.getElementById('loginForm');
      if (authType === 'sellerSignup') targetForm = document.getElementById('sellerSignupForm');
      if (authType === 'buyerSignup') targetForm = document.getElementById('buyerSignupForm');
      if (targetForm) targetForm.classList.add('active');
    });
  });
  
  // Close Modal Buttons
  const closeModalBtns = document.querySelectorAll('.close-modal');
  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.style.display = 'none';
    });
  });
  
  // Click outside modal to close
  window.addEventListener('click', (e) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });
  
  // Add Beat Button (for sellers)
  const addBeatBtn = document.getElementById('addBeatBtn');
  if (addBeatBtn) {
    addBeatBtn.addEventListener('click', () => {
      if (!currentUser) {
        alert('Please login as a seller');
        const authModal = document.getElementById('authModal');
        if (authModal) authModal.style.display = 'flex';
      } else if (currentUser.type !== 'seller') {
        alert('Only sellers can add beats. Register as a seller.');
      } else {
        alert('Add beat form would open here. You can upload beat details, files, and set price.');
      }
    });
  }
  
  // Initial Load
  renderBeats();
  updateAuthUI();
  
  // If logged in as seller, load seller data
  if (currentUser?.type === 'seller') {
    updateSellerDashboardStats();
    renderSellerMyBeatsTable();
  }
  
  // If logged in as buyer, load buyer data
  if (currentUser?.type === 'buyer') {
    renderBuyerPurchases();
    renderBuyerWishlist();
  }
});