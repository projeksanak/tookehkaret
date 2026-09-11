/**
 * TOKEHKARET PRO - Main Application Logic & Analytics Engine
 * Complete Feature Set: Multi-User Relational Database, Onboarding Tutorial, & Dual KKK Calculation
 */

// Initial Accounts
const DEFAULT_ACCOUNTS = [
  {
    username: 'tokeh',
    password: '1234',
    fullname: 'H. Ramli',
    email: 'tokeh.ramli@gmail.com',
    phone: '081234567890',
    resaddress: 'Jl. Merdeka No. 45, Sekayu',
    storename: 'Gudang Karet H. Ramli',
    address: 'Jl. Lintas Sumatera Km 12, Kebun Karet',
    hasSeenTutorial: true
  }
];

// Initial Daily Prices Matrix
const DEFAULT_DAILY_PRICES = {
  'Bokar Cup Lump': 23000,
  'Lateks Cair': 18000,
  'Slab / Balok': 21000,
  'Sheet Kering': 26000
};

// Initial Seed Farmers (tagged with userId: 'tokeh')
const INITIAL_FARMERS = [
  { id: 'F01', userId: 'tokeh', name: 'Pak Ahmad', phone: '081234567890', location: 'Desa Sungai Lilin, Blok A', kasbon: 500000 },
  { id: 'F02', userId: 'tokeh', name: 'Pak Budi', phone: '081398765432', location: 'Blok C Kebun Karet', kasbon: 1200000 },
  { id: 'F03', userId: 'tokeh', name: 'Pak Herman', phone: '085211223344', location: 'Desa Sekayu, Dusun 2', kasbon: 0 },
  { id: 'F04', userId: 'tokeh', name: 'Bu Siti', phone: '082155667788', location: 'Dusun III Sungai Lilin', kasbon: 250000 },
  { id: 'F05', userId: 'tokeh', name: 'Pak Joko', phone: '087899001122', location: 'KM 14 Lintas Kebun', kasbon: 800000 }
];

// Initial Seed Transactions (tagged with userId: 'tokeh')
const INITIAL_TRANSACTIONS = [
  { id: 'TRX-1001', userId: 'tokeh', date: '2026-08-01', farmerId: 'F01', farmerName: 'Pak Ahmad', jenis: 'Bokar Cup Lump', beratBasah: 180, kkkPercent: 58, beratKering: 104.4, hargaKering: 23000, subtotal: 2401200, potongKasbon: 100000, grandTotal: 2301200 },
  { id: 'TRX-1002', userId: 'tokeh', date: '2026-08-02', farmerId: 'F02', farmerName: 'Pak Budi', jenis: 'Lateks Cair', beratBasah: 250, kkkPercent: 32, beratKering: 80.0, hargaKering: 18000, subtotal: 1440000, potongKasbon: 200000, grandTotal: 1240000 },
  { id: 'TRX-1003', userId: 'tokeh', date: '2026-08-04', farmerId: 'F03', farmerName: 'Pak Herman', jenis: 'Bokar Cup Lump', beratBasah: 320, kkkPercent: 62, beratKering: 198.4, hargaKering: 23000, subtotal: 4563200, potongKasbon: 0, grandTotal: 4563200 },
  { id: 'TRX-1004', userId: 'tokeh', date: '2026-08-06', farmerId: 'F04', farmerName: 'Bu Siti', jenis: 'Slab / Balok', beratBasah: 140, kkkPercent: 52, beratKering: 72.8, hargaKering: 21000, subtotal: 1528800, potongKasbon: 50000, grandTotal: 1478800 },
  { id: 'TRX-1005', userId: 'tokeh', date: '2026-08-08', farmerId: 'F05', farmerName: 'Pak Joko', jenis: 'Bokar Cup Lump', beratBasah: 210, kkkPercent: 56, beratKering: 117.6, hargaKering: 23000, subtotal: 2704800, potongKasbon: 150000, grandTotal: 2554800 },
  { id: 'TRX-1006', userId: 'tokeh', date: '2026-08-10', farmerId: 'F01', farmerName: 'Pak Ahmad', jenis: 'Bokar Cup Lump', beratBasah: 195, kkkPercent: 60, beratKering: 117.0, hargaKering: 23000, subtotal: 2691000, potongKasbon: 100000, grandTotal: 2591000 },
  { id: 'TRX-1007', userId: 'tokeh', date: '2026-08-12', farmerId: 'F03', farmerName: 'Pak Herman', jenis: 'Sheet Kering', beratBasah: 160, kkkPercent: 75, beratKering: 120.0, hargaKering: 26000, subtotal: 3120000, potongKasbon: 0, grandTotal: 3120000 },
  { id: 'TRX-1008', userId: 'tokeh', date: '2026-08-14', farmerId: 'F02', farmerName: 'Pak Budi', jenis: 'Bokar Cup Lump', beratBasah: 280, kkkPercent: 54, beratKering: 151.2, hargaKering: 23000, subtotal: 3477600, potongKasbon: 200000, grandTotal: 3277600 }
];

class AppState {
  constructor() {
    this.accounts = JSON.parse(localStorage.getItem('tokeh_accounts')) || DEFAULT_ACCOUNTS;
    this.allFarmers = JSON.parse(localStorage.getItem('tokeh_farmers')) || INITIAL_FARMERS;
    this.allTransactions = JSON.parse(localStorage.getItem('tokeh_transactions')) || INITIAL_TRANSACTIONS;
    this.allDailyPrices = JSON.parse(localStorage.getItem('tokeh_daily_prices_matrix')) || { 'tokeh': DEFAULT_DAILY_PRICES };
    this.isLoggedIn = localStorage.getItem('tokeh_is_logged_in') === 'true';
    this.sidebarCollapsed = localStorage.getItem('tokeh_sidebar_collapsed') === 'true';
    
    const savedUser = JSON.parse(localStorage.getItem('tokeh_user_info'));
    this.currentUser = savedUser || this.accounts[0];
  }

  get currentUserId() {
    return this.currentUser ? this.currentUser.username : 'tokeh';
  }

  get farmers() {
    return this.allFarmers.filter(f => (f.userId || 'tokeh') === this.currentUserId);
  }

  get transactions() {
    return this.allTransactions.filter(t => (t.userId || 'tokeh') === this.currentUserId);
  }

  get dailyPrices() {
    if (!this.allDailyPrices[this.currentUserId]) {
      this.allDailyPrices[this.currentUserId] = { ...DEFAULT_DAILY_PRICES };
    }
    return this.allDailyPrices[this.currentUserId];
  }

  save() {
    localStorage.setItem('tokeh_accounts', JSON.stringify(this.accounts));
    localStorage.setItem('tokeh_farmers', JSON.stringify(this.allFarmers));
    localStorage.setItem('tokeh_transactions', JSON.stringify(this.allTransactions));
    localStorage.setItem('tokeh_daily_prices_matrix', JSON.stringify(this.allDailyPrices));
    localStorage.setItem('tokeh_is_logged_in', this.isLoggedIn ? 'true' : 'false');
    localStorage.setItem('tokeh_sidebar_collapsed', this.sidebarCollapsed ? 'true' : 'false');
    localStorage.setItem('tokeh_user_info', JSON.stringify(this.currentUser));
  }

  addAccount(acc) {
    acc.hasSeenTutorial = false;
    this.accounts.push(acc);
    this.allDailyPrices[acc.username] = { ...DEFAULT_DAILY_PRICES };
    this.save();
  }

  addFarmer(farmer) {
    farmer.userId = this.currentUserId;
    this.allFarmers.push(farmer);
    this.save();
  }

  updateFarmer(updatedFarmer) {
    const idx = this.allFarmers.findIndex(f => f.id === updatedFarmer.id && (f.userId || 'tokeh') === this.currentUserId);
    if (idx !== -1) {
      this.allFarmers[idx] = { ...this.allFarmers[idx], ...updatedFarmer };
      this.save();
    }
  }

  deleteFarmer(id) {
    this.allFarmers = this.allFarmers.filter(f => !(f.id === id && (f.userId || 'tokeh') === this.currentUserId));
    this.save();
  }

  addTransaction(trx) {
    trx.userId = this.currentUserId;
    this.allTransactions.unshift(trx);
    if (trx.potongKasbon > 0) {
      const farmer = this.allFarmers.find(f => f.id === trx.farmerId && (f.userId || 'tokeh') === this.currentUserId);
      if (farmer) {
        farmer.kasbon = Math.max(0, farmer.kasbon - trx.potongKasbon);
      }
    }
    this.save();
  }

  updateTransaction(updatedTrx) {
    const idx = this.allTransactions.findIndex(t => t.id === updatedTrx.id && (t.userId || 'tokeh') === this.currentUserId);
    if (idx !== -1) {
      this.allTransactions[idx] = { ...this.allTransactions[idx], ...updatedTrx };
      this.save();
    }
  }

  deleteTransaction(id) {
    this.allTransactions = this.allTransactions.filter(t => !(t.id === id && (t.userId || 'tokeh') === this.currentUserId));
    this.save();
  }
}

const state = new AppState();

// OTP Code Storage
let currentGeneratedOtp = null;

// Global Chart Instances
let chartPurchasesInstance = null;
let chartKkkDistInstance = null;
let chartKkkTrendInstance = null;

document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  initSidebarToggle();
  initMobileDrawer();
  initPriceMatrix();
  initNavigation();
  initFilterControls();
  initFarmerDropdowns();
  initFormCalculations();
  initTutorial();
  initModalEvents();

  if (state.isLoggedIn) {
    showAppView();
  } else {
    showLandingView();
  }
});

/* ================= SIDEBAR COLLAPSE / MINIMIZE HANDLER ================= */
function initSidebarToggle() {
  const sidebar = document.getElementById('app-sidebar');
  const btnToggle = document.getElementById('btn-toggle-sidebar');

  if (state.sidebarCollapsed) {
    sidebar.classList.add('collapsed');
  }

  btnToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    state.sidebarCollapsed = sidebar.classList.contains('collapsed');
    state.save();
  });
}

/* ================= MOBILE DRAWER HANDLER ================= */
function initMobileDrawer() {
  const sidebar = document.getElementById('app-sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  const btnMobileMenu = document.getElementById('btn-mobile-menu');
  const btnQuickMobile = document.getElementById('btn-quick-timbang-mobile');

  const openDrawer = () => {
    sidebar.classList.add('mobile-open');
    backdrop.classList.add('active');
  };

  const closeDrawer = () => {
    sidebar.classList.remove('mobile-open');
    backdrop.classList.remove('active');
  };

  btnMobileMenu.addEventListener('click', openDrawer);
  backdrop.addEventListener('click', closeDrawer);

  if (btnQuickMobile) {
    btnQuickMobile.addEventListener('click', () => {
      document.querySelector('.nav-item[data-tab="transaction"]').click();
      closeDrawer();
    });
  }

  window.closeMobileDrawer = closeDrawer;
}

/* ================= Point #2: PRICE MATRIX (HARGA PER JENIS KARET) ================= */
function initPriceMatrix() {
  updatePriceDisplays();

  const modalPrices = document.getElementById('modal-price-matrix');
  document.getElementById('btn-open-price-matrix').addEventListener('click', () => {
    document.getElementById('p-cup').value = state.dailyPrices['Bokar Cup Lump'] || 23000;
    document.getElementById('p-lateks').value = state.dailyPrices['Lateks Cair'] || 18000;
    document.getElementById('p-slab').value = state.dailyPrices['Slab / Balok'] || 21000;
    document.getElementById('p-sheet').value = state.dailyPrices['Sheet Kering'] || 26000;
    modalPrices.classList.add('active');
  });

  document.getElementById('btn-close-modal-prices').addEventListener('click', () => modalPrices.classList.remove('active'));
  document.getElementById('btn-cancel-modal-prices').addEventListener('click', () => modalPrices.classList.remove('active'));

  document.getElementById('form-price-matrix').addEventListener('submit', (e) => {
    e.preventDefault();
    state.dailyPrices['Bokar Cup Lump'] = parseFloat(document.getElementById('p-cup').value) || 23000;
    state.dailyPrices['Lateks Cair'] = parseFloat(document.getElementById('p-lateks').value) || 18000;
    state.dailyPrices['Slab / Balok'] = parseFloat(document.getElementById('p-slab').value) || 21000;
    state.dailyPrices['Sheet Kering'] = parseFloat(document.getElementById('p-sheet').value) || 26000;

    state.save();
    updatePriceDisplays();

    // Auto-update transaction form price based on current selected type
    const currentJenis = document.getElementById('input-jenis').value;
    if (state.dailyPrices[currentJenis]) {
      document.getElementById('input-harga-kering').value = state.dailyPrices[currentJenis];
      updateLiveCalculation();
    }

    showToast('Harga harian per jenis karet berhasil diperbarui!');
    modalPrices.classList.remove('active');
  });
}

function updatePriceDisplays() {
  document.getElementById('price-display-cup').textContent = formatRupiah(state.dailyPrices['Bokar Cup Lump']);
  document.getElementById('price-display-lateks').textContent = formatRupiah(state.dailyPrices['Lateks Cair']);
  document.getElementById('price-display-slab').textContent = formatRupiah(state.dailyPrices['Slab / Balok']);
  document.getElementById('price-display-sheet').textContent = formatRupiah(state.dailyPrices['Sheet Kering']);
}

/* ================= AUTHENTICATION & VIEW NAVIGATION HANDLERS ================= */
function initAuth() {
  const loginForm = document.getElementById('form-login');
  const loginErrorMsg = document.getElementById('login-error-msg');
  const btnLogout = document.getElementById('btn-logout');
  const btnToggleLoginPw = document.getElementById('btn-toggle-login-pw');
  const loginPwInput = document.getElementById('login-password');
  const loginPwIcon = document.getElementById('icon-login-pw');

  // Landing Page Buttons
  const btnLandingLogin = document.getElementById('btn-landing-login');
  const btnLandingRegister = document.getElementById('btn-landing-register');
  const btnHeroLogin = document.getElementById('btn-hero-login');
  const btnHeroRegister = document.getElementById('btn-hero-register');
  const linkLoginBackHome = document.getElementById('link-login-back-home');
  const linkRegisterBackHome = document.getElementById('link-register-back-home');

  if (btnLandingLogin) btnLandingLogin.addEventListener('click', showLoginView);
  if (btnLandingRegister) btnLandingRegister.addEventListener('click', showRegisterView);
  if (btnHeroLogin) btnHeroLogin.addEventListener('click', showLoginView);
  if (btnHeroRegister) btnHeroRegister.addEventListener('click', showRegisterView);
  if (linkLoginBackHome) {
    linkLoginBackHome.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }
  if (linkRegisterBackHome) {
    linkRegisterBackHome.addEventListener('click', (e) => {
      e.preventDefault();
      showLandingView();
    });
  }

  // Toggle Password for Login Screen
  if (btnToggleLoginPw && loginPwInput && loginPwIcon) {
    btnToggleLoginPw.addEventListener('click', () => {
      if (loginPwInput.type === 'password') {
        loginPwInput.type = 'text';
        loginPwIcon.className = 'fa-solid fa-eye-slash';
      } else {
        loginPwInput.type = 'password';
        loginPwIcon.className = 'fa-solid fa-eye';
      }
    });
  }

  // Navigation: Go to Register View
  const linkGoToRegister = document.getElementById('link-go-to-register') || document.getElementById('link-register');
  if (linkGoToRegister) {
    linkGoToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      showRegisterView();
    });
  }

  // Navigation: Go to Login View
  const linkGoToLogin = document.getElementById('link-go-to-login');
  if (linkGoToLogin) {
    linkGoToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      showLoginView();
    });
  }

  // Toggle Password for Register Screen
  const btnToggleRegPw = document.getElementById('btn-toggle-reg-pw');
  const regPwInput = document.getElementById('reg-password');
  const regPwIcon = document.getElementById('icon-reg-pw');
  if (btnToggleRegPw && regPwInput && regPwIcon) {
    btnToggleRegPw.addEventListener('click', () => {
      if (regPwInput.type === 'password') {
        regPwInput.type = 'text';
        regPwIcon.className = 'fa-solid fa-eye-slash';
      } else {
        regPwInput.type = 'password';
        regPwIcon.className = 'fa-solid fa-eye';
      }
    });
  }

  // Form Register Submit Handler
  const formRegisterUser = document.getElementById('form-register-user');
  if (formRegisterUser) {
    formRegisterUser.addEventListener('submit', (e) => {
      e.preventDefault();
      const fullname = document.getElementById('reg-fullname').value.trim();
      const resaddress = document.getElementById('reg-resaddress').value.trim();
      const storeaddress = document.getElementById('reg-storeaddress').value.trim();
      const phone = document.getElementById('reg-phone').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const username = document.getElementById('reg-username').value.trim();
      const password = document.getElementById('reg-password').value.trim();

      if (state.accounts.some(a => a.username.toLowerCase() === username.toLowerCase() || (a.email && a.email.toLowerCase() === email.toLowerCase()))) {
        showToast('Username atau Email sudah terdaftar! Gunakan data lain.', 'error');
        return;
      }

      const newAcc = {
        username,
        password,
        fullname,
        email,
        phone,
        resaddress,
        storename: 'Gudang ' + fullname,
        address: storeaddress
      };

      state.addAccount(newAcc);
      showToast(`Akun ${username} berhasil dibuat! Silakan login.`);
      
      formRegisterUser.reset();
      document.getElementById('login-username').value = username;
      showLoginView();
    });
  }

  // Login Form Submit Handler
  if (loginForm) {
    const loginUserEl = document.getElementById('login-username');
    if (loginUserEl) {
      loginUserEl.addEventListener('input', () => {
        if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
      });
    }
    if (loginPwInput) {
      loginPwInput.addEventListener('input', () => {
        if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();

      // Allow login via username OR email
      const account = state.accounts.find(a => 
        (a.username.toLowerCase() === username.toLowerCase() || (a.email && a.email.toLowerCase() === username.toLowerCase())) &&
        a.password === password
      );

      if (account) {
        if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
        state.isLoggedIn = true;
        state.currentUser = account;
        state.save();
        
        showToast(`Login berhasil! Selamat datang, ${account.fullname}`);
        showAppView();
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.classList.remove('hidden');
        }
        showToast('Username/Email atau PIN/Password salah!', 'error');
      }
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      state.isLoggedIn = false;
      state.save();
      showToast('Anda telah logout dari aplikasi.');
      showLandingView();
    });
  }
}

function showLandingView() {
  const landingView = document.getElementById('landing-view');
  if (landingView) landingView.classList.remove('hidden');
  const loginView = document.getElementById('login-view');
  if (loginView) loginView.classList.add('hidden');
  const regView = document.getElementById('register-view');
  if (regView) regView.classList.add('hidden');
  const appView = document.getElementById('app-view');
  if (appView) appView.classList.add('hidden');
}

function showLoginView() {
  const landingView = document.getElementById('landing-view');
  if (landingView) landingView.classList.add('hidden');
  const loginView = document.getElementById('login-view');
  if (loginView) loginView.classList.remove('hidden');
  const regView = document.getElementById('register-view');
  if (regView) regView.classList.add('hidden');
  const appView = document.getElementById('app-view');
  if (appView) appView.classList.add('hidden');

  const loginErrorMsg = document.getElementById('login-error-msg');
  if (loginErrorMsg) loginErrorMsg.classList.add('hidden');
}

function showRegisterView() {
  const landingView = document.getElementById('landing-view');
  if (landingView) landingView.classList.add('hidden');
  const loginView = document.getElementById('login-view');
  if (loginView) loginView.classList.add('hidden');
  const regView = document.getElementById('register-view');
  if (regView) regView.classList.remove('hidden');
  const appView = document.getElementById('app-view');
  if (appView) appView.classList.add('hidden');
}

function showAppView() {
  const landingView = document.getElementById('landing-view');
  if (landingView) landingView.classList.add('hidden');
  const loginView = document.getElementById('login-view');
  if (loginView) loginView.classList.add('hidden');
  const regView = document.getElementById('register-view');
  if (regView) regView.classList.add('hidden');
  document.getElementById('app-view').classList.remove('hidden');
  
  updateUserProfileUI();
  renderDashboard();
  renderFarmersTab();
  renderHistoryTab();

  if (window.checkAutoOpenTutorial) {
    window.checkAutoOpenTutorial();
  }
}

function updateUserProfileUI() {
  const user = state.currentUser;
  
  document.getElementById('user-display-name').textContent = `${user.fullname} (Tokeh)`;
  document.getElementById('user-display-role').textContent = user.storename || 'Pengepul Utama';
  document.getElementById('brand-title-display').textContent = 'TokehKaret';
  document.getElementById('brand-subtitle-display').textContent = user.storename || 'Sistem Timbangan & DRC';

  document.getElementById('r-store-name').textContent = (user.storename || ('GUDANG KARET ' + user.fullname)).toUpperCase();
  document.getElementById('r-store-address').textContent = user.address || 'Jl. Lintas Sumatera Km 12, Kebun Karet';
}

function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');

  const pageHeaders = {
    dashboard: {
      title: 'Dashboard & Analitik Pembelian',
      subtitle: 'Ringkasan tonase karet, grafik KKK, dan aktivitas transaksi tokeh'
    },
    transaction: {
      title: 'Timbang Karet & Kalkulator KKK',
      subtitle: 'Kalkulasi otomatis Kadar Karet Kering (DRC) dan cetak nota transaksi'
    },
    farmers: {
      title: 'Data Petani & Manajemen Kasbon',
      subtitle: 'Daftar penyuplai karet dan catatan sisa pinjaman (bon)'
    },
    history: {
      title: 'Riwayat Penimbangan & Struk',
      subtitle: 'Arsip transaksi penimbangan karet harian'
    }
  };

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      navButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');

      if (pageHeaders[targetTab]) {
        pageTitle.textContent = pageHeaders[targetTab].title;
        pageSubtitle.textContent = pageHeaders[targetTab].subtitle;
      }

      if (targetTab === 'dashboard') {
        renderDashboard();
      }

      if (window.closeMobileDrawer) {
        window.closeMobileDrawer();
      }
    });
  });

  const btnQuick = document.getElementById('btn-quick-timbang');
  if (btnQuick) {
    btnQuick.addEventListener('click', () => {
      document.querySelector('.nav-item[data-tab="transaction"]').click();
    });
  }
}

function initFilterControls() {
  const dashPetani = document.getElementById('filter-dash-petani');
  const dashKkk = document.getElementById('filter-dash-kkk');
  const dashPeriod = document.getElementById('filter-dash-period');
  const btnReset = document.getElementById('btn-reset-filters');

  const histPetani = document.getElementById('filter-hist-petani');
  const histKkk = document.getElementById('filter-hist-kkk');
  const histSearch = document.getElementById('search-history');

  [dashPetani, dashKkk, dashPeriod].forEach(el => {
    el.addEventListener('change', renderDashboard);
  });

  btnReset.addEventListener('click', () => {
    dashPetani.value = 'ALL';
    dashKkk.value = 'ALL';
    dashPeriod.value = '30';
    renderDashboard();
    showToast('Filter dashboard telah direset');
  });

  [histPetani, histKkk, histSearch].forEach(el => {
    el.addEventListener('change', renderHistoryTab);
    el.addEventListener('keyup', renderHistoryTab);
  });

  document.getElementById('btn-print-all-transactions').addEventListener('click', () => {
    document.body.classList.add('printing-all-transactions');
    window.print();
    document.body.classList.remove('printing-all-transactions');
  });
}

function initFarmerDropdowns() {
  const selectTimbang = document.getElementById('input-petani');
  const selectEditTrx = document.getElementById('edit-trx-petani');
  const selectFilterDash = document.getElementById('filter-dash-petani');
  const selectFilterHist = document.getElementById('filter-hist-petani');

  selectTimbang.innerHTML = '<option value="">-- Pilih Petani --</option>';
  if (selectEditTrx) selectEditTrx.innerHTML = '';
  selectFilterDash.innerHTML = '<option value="ALL">Semua Petani</option>';
  selectFilterHist.innerHTML = '<option value="ALL">Semua Petani</option>';

  state.farmers.forEach(f => {
    const opt1 = document.createElement('option');
    opt1.value = f.id;
    opt1.textContent = `${f.name} (${f.location})`;
    selectTimbang.appendChild(opt1);

    if (selectEditTrx) {
      const optEdit = document.createElement('option');
      optEdit.value = f.id;
      optEdit.textContent = f.name;
      selectEditTrx.appendChild(optEdit);
    }

    const opt2 = document.createElement('option');
    opt2.value = f.id;
    opt2.textContent = f.name;
    selectFilterDash.appendChild(opt2);

    const opt3 = document.createElement('option');
    opt3.value = f.id;
    opt3.textContent = f.name;
    selectFilterHist.appendChild(opt3);
  });

  selectTimbang.addEventListener('change', (e) => {
    const farmerId = e.target.value;
    const preview = document.getElementById('farmer-kasbon-preview');
    const farmer = state.farmers.find(f => f.id === farmerId);

    if (farmer) {
      preview.textContent = `Kasbon Aktif Petani: ${formatRupiah(farmer.kasbon)}`;
      document.getElementById('input-potong-kasbon').max = farmer.kasbon;
    } else {
      preview.textContent = 'Kasbon Petani: Rp 0';
    }
    updateLiveCalculation();
  });
}

function initFormCalculations() {
  const inputs = [
    'input-berat-basah',
    'input-berat-kering',
    'input-kkk-percent',
    'input-harga-kering',
    'input-potong-kasbon',
    'input-potong-air'
  ];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => updateLiveCalculation(e));
    }
  });

  // Auto-sync price when rubber type changes
  const jenisSelect = document.getElementById('input-jenis');
  if (jenisSelect) {
    jenisSelect.addEventListener('change', () => {
      const jenis = jenisSelect.value;
      if (state.dailyPrices[jenis]) {
        document.getElementById('input-harga-kering').value = state.dailyPrices[jenis];
      }
      updateLiveCalculation();
    });
  }

  document.getElementById('btn-reset-form').addEventListener('click', () => {
    document.getElementById('form-timbang').reset();
    const defaultJenis = document.getElementById('input-jenis').value;
    document.getElementById('input-harga-kering').value = state.dailyPrices[defaultJenis] || 23000;
    updateLiveCalculation();
  });

  document.getElementById('btn-submit-transaksi').addEventListener('click', handleSaveTransaction);

  document.getElementById('btn-print-sim').addEventListener('click', () => {
    document.body.classList.add('printing-receipt');
    window.print();
    document.body.classList.remove('printing-receipt');
  });
}

function updateLiveCalculation(e) {
  const beratBasah = parseFloat(document.getElementById('input-berat-basah').value) || 0;
  const potongKotoran = parseFloat(document.getElementById('input-potong-air').value) || 0;
  const hargaKering = parseFloat(document.getElementById('input-harga-kering').value) || 0;
  const potongKasbon = parseFloat(document.getElementById('input-potong-kasbon').value) || 0;

  const beratBasahBersih = Math.max(0, beratBasah - potongKotoran);
  const targetId = e && e.target ? e.target.id : null;

  let kkkPercent = parseFloat(document.getElementById('input-kkk-percent').value) || 0;
  let beratKering = parseFloat(document.getElementById('input-berat-kering').value) || 0;

  if (targetId === 'input-berat-kering' || targetId === 'input-berat-basah' || targetId === 'input-potong-air' || (!targetId && beratKering > 0)) {
    if (beratBasahBersih > 0 && beratKering > 0) {
      kkkPercent = parseFloat(((beratKering / beratBasahBersih) * 100).toFixed(1));
      document.getElementById('input-kkk-percent').value = kkkPercent;
    } else if (beratBasahBersih > 0 && kkkPercent > 0 && beratKering === 0) {
      beratKering = parseFloat((beratBasahBersih * (kkkPercent / 100)).toFixed(1));
      document.getElementById('input-berat-kering').value = beratKering;
    }
  } else if (targetId === 'input-kkk-percent') {
    if (beratBasahBersih > 0) {
      beratKering = parseFloat((beratBasahBersih * (kkkPercent / 100)).toFixed(1));
      document.getElementById('input-berat-kering').value = beratKering;
    }
  }

  const subtotal = Math.round(beratKering * hargaKering);
  const grandTotal = Math.max(0, subtotal - potongKasbon);

  document.getElementById('res-berat-kering').textContent = `${beratKering.toFixed(1)} kg`;
  document.getElementById('res-subtotal').textContent = formatRupiah(subtotal);
  document.getElementById('res-potongan-kasbon').textContent = `- ${formatRupiah(potongKasbon)}`;
  document.getElementById('res-potongan-kotoran').textContent = `- ${potongKotoran} kg`;
  document.getElementById('res-grand-total').textContent = formatRupiah(grandTotal);

  const meterFill = document.getElementById('kkk-meter-fill');
  const qualityLabel = document.getElementById('kkk-quality-label');
  const clampedPercent = Math.min(100, Math.max(0, kkkPercent));
  if (meterFill) meterFill.style.width = `${clampedPercent}%`;

  if (qualityLabel) {
    if (kkkPercent === 0) {
      qualityLabel.textContent = '-';
      qualityLabel.style.color = 'var(--text-muted)';
    } else if (kkkPercent < 45) {
      qualityLabel.textContent = 'Kadar Air Tinggi (Basah)';
      qualityLabel.style.color = '#ef4444';
    } else if (kkkPercent <= 60) {
      qualityLabel.textContent = 'Kualitas Kebun Standar';
      qualityLabel.style.color = '#f59e0b';
    } else {
      qualityLabel.textContent = 'Kualitas Super (Bokar Kering)';
      qualityLabel.style.color = '#10b981';
    }
  }

  const farmerId = document.getElementById('input-petani').value;
  const selectedFarmer = state.farmers.find(f => f.id === farmerId);

  document.getElementById('r-no').textContent = '#TRX-LIVE';
  document.getElementById('r-date').textContent = new Date().toLocaleDateString('id-ID');
  document.getElementById('r-petani').textContent = selectedFarmer ? selectedFarmer.name : '-';
  document.getElementById('r-jenis').textContent = document.getElementById('input-jenis').value;
  document.getElementById('r-basah').textContent = `${beratBasah} kg`;
  document.getElementById('r-kkk').textContent = `${kkkPercent} %`;
  document.getElementById('r-kering').textContent = `${beratKering.toFixed(1)} kg`;
  document.getElementById('r-harga').textContent = formatRupiah(hargaKering);
  document.getElementById('r-subtotal').textContent = formatRupiah(subtotal);
  document.getElementById('r-potbon').textContent = formatRupiah(potongKasbon);
  document.getElementById('r-total').textContent = formatRupiah(grandTotal);
}

function handleSaveTransaction() {
  const farmerId = document.getElementById('input-petani').value;
  const jenis = document.getElementById('input-jenis').value;
  const beratBasah = parseFloat(document.getElementById('input-berat-basah').value);
  let kkkPercent = parseFloat(document.getElementById('input-kkk-percent').value);
  const hargaKering = parseFloat(document.getElementById('input-harga-kering').value);
  const potongKasbon = parseFloat(document.getElementById('input-potong-kasbon').value) || 0;
  const potongKotoran = parseFloat(document.getElementById('input-potong-air').value) || 0;
  let beratKering = parseFloat(document.getElementById('input-berat-kering').value);

  if (!farmerId || isNaN(beratBasah) || isNaN(hargaKering)) {
    showToast('Mohon lengkapi semua kolom bertanda *', 'error');
    return;
  }

  const farmer = state.farmers.find(f => f.id === farmerId);
  const beratBasahBersih = Math.max(0, beratBasah - potongKotoran);
  
  if (isNaN(beratKering) && !isNaN(kkkPercent)) {
    beratKering = parseFloat((beratBasahBersih * (kkkPercent / 100)).toFixed(1));
  }
  if (isNaN(kkkPercent) && !isNaN(beratKering)) {
    kkkPercent = parseFloat(((beratKering / beratBasahBersih) * 100).toFixed(1));
  }

  const subtotal = Math.round(beratKering * hargaKering);
  const grandTotal = Math.max(0, subtotal - potongKasbon);

  const newTrx = {
    id: '#TRX-' + Math.floor(10000 + Math.random() * 90000),
    date: new Date().toISOString().split('T')[0],
    farmerId,
    farmerName: farmer ? farmer.name : 'Unknown',
    jenis,
    beratBasah,
    kkkPercent,
    beratKering,
    hargaKering,
    subtotal,
    potongKasbon,
    grandTotal
  };

  state.addTransaction(newTrx);

  document.getElementById('notif-success-message').textContent = `Transaksi ${newTrx.id} untuk ${farmer ? farmer.name : 'Petani'} (Total: ${formatRupiah(grandTotal)}) telah berhasil dicatat!`;
  document.getElementById('modal-notif-success').classList.add('active');

  document.getElementById('form-timbang').reset();
  const defaultJenis = document.getElementById('input-jenis').value;
  document.getElementById('input-harga-kering').value = state.dailyPrices[defaultJenis] || 23000;

  initFarmerDropdowns();
  updateLiveCalculation();
  renderDashboard();
  renderFarmersTab();
  renderHistoryTab();
}

function getFilteredTransactionsDashboard() {
  const selectedFarmer = document.getElementById('filter-dash-petani').value;
  const selectedKkk = document.getElementById('filter-dash-kkk').value;

  return state.transactions.filter(t => {
    if (selectedFarmer !== 'ALL' && t.farmerId !== selectedFarmer) return false;
    if (selectedKkk === 'SUPER' && t.kkkPercent <= 60) return false;
    if (selectedKkk === 'STANDAR' && (t.kkkPercent < 45 || t.kkkPercent > 60)) return false;
    if (selectedKkk === 'BASAH' && t.kkkPercent >= 45) return false;
    return true;
  });
}

function renderDashboard() {
  const filteredData = getFilteredTransactionsDashboard();

  let totalBasah = 0;
  let totalKering = 0;
  let totalPembelian = 0;
  let sumKkk = 0;

  filteredData.forEach(t => {
    totalBasah += t.beratBasah;
    totalKering += t.beratKering;
    totalPembelian += t.grandTotal;
    sumKkk += t.kkkPercent;
  });

  const avgKkk = filteredData.length > 0 ? (sumKkk / filteredData.length).toFixed(1) : 0;

  document.getElementById('stat-total-basah').textContent = `${totalBasah.toLocaleString('id-ID')} kg`;
  document.getElementById('stat-total-kering').textContent = `${totalKering.toLocaleString('id-ID')} kg`;
  document.getElementById('stat-avg-kkk').textContent = `${avgKkk}%`;
  document.getElementById('stat-total-pembelian').textContent = formatRupiah(totalPembelian);

  renderChartPurchases(filteredData);
  renderChartKkkDistribution(filteredData);
  renderChartKkkTrend(filteredData);
  renderTopFarmersList(filteredData);
}

function renderChartPurchases(data) {
  const ctx = document.getElementById('chartPurchases').getContext('2d');
  
  const dateMap = {};
  data.slice().reverse().forEach(t => {
    if (!dateMap[t.date]) {
      dateMap[t.date] = { basah: 0, kering: 0 };
    }
    dateMap[t.date].basah += t.beratBasah;
    dateMap[t.date].kering += t.beratKering;
  });

  const labels = Object.keys(dateMap);
  const dataBasah = labels.map(d => dateMap[d].basah);
  const dataKering = labels.map(d => dateMap[d].kering);

  if (chartPurchasesInstance) chartPurchasesInstance.destroy();

  chartPurchasesInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(d => formatDateShort(d)),
      datasets: [
        { label: 'Karet Basah (kg)', data: dataBasah, backgroundColor: '#f59e0b', borderRadius: 6 },
        { label: 'Karet Kering / KKK (kg)', data: dataKering, backgroundColor: '#10b981', borderRadius: 6 }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
        y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } }
      }
    }
  });
}

function renderChartKkkDistribution(data) {
  const ctx = document.getElementById('chartKkkDistribution').getContext('2d');

  let countHigh = 0;
  let countMedium = 0;
  let countLow = 0;

  data.forEach(t => {
    if (t.kkkPercent > 60) countHigh++;
    else if (t.kkkPercent >= 45) countMedium++;
    else countLow++;
  });

  if (chartKkkDistInstance) chartKkkDistInstance.destroy();

  chartKkkDistInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Super (>60%)', 'Standar (45-60%)', 'Basah (<45%)'],
      datasets: [{
        data: [countHigh, countMedium, countLow],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: '#64748b', font: { family: 'Plus Jakarta Sans', size: 11 } }
        }
      },
      cutout: '68%'
    }
  });
}

function renderChartKkkTrend(data) {
  const ctx = document.getElementById('chartKkkTrend').getContext('2d');

  const sortedTrx = data.slice().reverse();
  const labels = sortedTrx.map(t => formatDateShort(t.date));
  const dataTrend = sortedTrx.map(t => t.kkkPercent);

  if (chartKkkTrendInstance) chartKkkTrendInstance.destroy();

  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
  gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

  chartKkkTrendInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Persentase KKK (%)',
        data: dataTrend,
        borderColor: '#10b981',
        borderWidth: 3,
        fill: true,
        backgroundColor: gradient,
        tension: 0.35,
        pointBackgroundColor: '#10b981',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
        y: {
          min: 20,
          max: 90,
          grid: { color: '#f1f5f9' },
          ticks: { color: '#64748b', callback: v => `${v}%` }
        }
      }
    }
  });
}

function renderTopFarmersList(data) {
  const container = document.getElementById('top-farmers-container');
  container.innerHTML = '';

  const farmerStats = {};
  data.forEach(t => {
    if (!farmerStats[t.farmerName]) {
      farmerStats[t.farmerName] = { volBasah: 0, volKering: 0, totalKkkSum: 0, count: 0 };
    }
    farmerStats[t.farmerName].volBasah += t.beratBasah;
    farmerStats[t.farmerName].volKering += t.beratKering;
    farmerStats[t.farmerName].totalKkkSum += t.kkkPercent;
    farmerStats[t.farmerName].count++;
  });

  const sorted = Object.keys(farmerStats)
    .map(name => ({
      name,
      ...farmerStats[name],
      avgKkk: (farmerStats[name].totalKkkSum / farmerStats[name].count).toFixed(1)
    }))
    .sort((a, b) => b.volKering - a.volKering)
    .slice(0, 4);

  if (sorted.length === 0) {
    container.innerHTML = '<p class="text-muted" style="font-size:12px; text-align:center; padding:10px;">Tidak ada data penyuplai pada filter ini</p>';
    return;
  }

  sorted.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'top-farmer-item';
    el.innerHTML = `
      <div class="farmer-rank">#${index + 1}</div>
      <div class="farmer-info-sub">
        <strong>${item.name}</strong>
        <span>Avg KKK: ${item.avgKkk}%</span>
      </div>
      <div class="farmer-vol">
        <span class="kg">${item.volKering.toFixed(1)} kg Kering</span>
        <span class="kkk">${item.volBasah} kg Basah</span>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderFarmersTab() {
  const container = document.getElementById('farmers-cards-list');
  container.innerHTML = '';

  state.farmers.forEach(f => {
    let totalKering = 0;
    let totalBasah = 0;
    state.transactions.filter(t => t.farmerId === f.id).forEach(t => {
      totalKering += t.beratKering;
      totalBasah += t.beratBasah;
    });

    const card = document.createElement('div');
    card.className = 'farmer-card card';
    card.innerHTML = `
      <div class="farmer-card-header">
        <div class="farmer-avatar"><i class="fa-solid fa-user"></i></div>
        <div class="farmer-meta">
          <h4>${f.name}</h4>
          <p><i class="fa-solid fa-location-dot"></i> ${f.location}</p>
        </div>
      </div>
      
      <div class="farmer-detail-list">
        <div><i class="fa-solid fa-phone"></i> ${f.phone || '-'}</div>
        <div><i class="fa-solid fa-layer-group"></i> Total Basah: <strong>${totalBasah.toFixed(1)} kg</strong></div>
      </div>

      <div class="farmer-stats">
        <div class="f-stat-item">
          <span>Total Setoran (KKK)</span>
          <strong class="text-green">${totalKering.toFixed(1)} kg</strong>
        </div>
        <div class="f-stat-item">
          <span>Sisa Kasbon</span>
          <strong class="${f.kasbon > 0 ? 'text-red' : ''}">${formatRupiah(f.kasbon)}</strong>
        </div>
      </div>
      
      <div class="farmer-card-actions">
        <button class="btn btn-outline btn-sm" onclick="quickTimbangForFarmer('${f.id}')" title="Timbang Karet">
          <i class="fa-solid fa-scale-balanced"></i> Timbang
        </button>
        <button class="btn btn-secondary btn-sm" onclick="editFarmer('${f.id}')" title="Edit Data Petani">
          <i class="fa-solid fa-pen-to-square"></i> Edit
        </button>
        <button class="btn btn-danger-light btn-sm" onclick="deleteFarmerConfirm('${f.id}')" title="Hapus Petani">
          <i class="fa-solid fa-trash"></i> Hapus
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.editFarmer = function(id) {
  const f = state.farmers.find(item => item.id === id);
  if (!f) return;

  document.getElementById('modal-petani-title').innerHTML = `<i class="fa-solid fa-user-pen text-green"></i> Edit Data Petani`;
  document.getElementById('m-petani-id').value = f.id;
  document.getElementById('m-nama-petani').value = f.name;
  document.getElementById('m-hp-petani').value = f.phone || '';
  document.getElementById('m-lokasi-kebun').value = f.location || '';
  document.getElementById('m-kasbon-awal').value = f.kasbon || 0;

  document.getElementById('modal-petani').classList.add('active');
};

window.deleteFarmerConfirm = function(id) {
  const f = state.farmers.find(item => item.id === id);
  if (!f) return;

  if (confirm(`Apakah Anda yakin ingin menghapus data petani "${f.name}"?`)) {
    state.deleteFarmer(id);
    showToast(`Petani ${f.name} berhasil dihapus.`);
    initFarmerDropdowns();
    renderFarmersTab();
    renderDashboard();
  }
};

function renderHistoryTab() {
  const tbody = document.getElementById('history-table-body');
  tbody.innerHTML = '';

  const selectedFarmer = document.getElementById('filter-hist-petani').value;
  const selectedKkk = document.getElementById('filter-hist-kkk').value;
  const searchQuery = document.getElementById('search-history').value.toLowerCase().trim();

  const filtered = state.transactions.filter(t => {
    if (selectedFarmer !== 'ALL' && t.farmerId !== selectedFarmer) return false;
    if (selectedKkk === 'SUPER' && t.kkkPercent <= 60) return false;
    if (selectedKkk === 'STANDAR' && (t.kkkPercent < 45 || t.kkkPercent > 60)) return false;
    if (selectedKkk === 'BASAH' && t.kkkPercent >= 45) return false;

    if (searchQuery) {
      const matchName = t.farmerName.toLowerCase().includes(searchQuery);
      const matchId = t.id.toLowerCase().includes(searchQuery);
      if (!matchName && !matchId) return false;
    }

    return true;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center; color:#94a3b8; padding:20px;">Tidak ada data transaksi yang cocok dengan filter</td></tr>';
    return;
  }

  filtered.forEach(t => {
    const kkkBadgeClass = t.kkkPercent > 60 ? 'high' : t.kkkPercent >= 45 ? 'medium' : 'low';
    
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${t.id}</strong><br><small class="text-muted">${t.date}</small></td>
      <td><strong>${t.farmerName}</strong></td>
      <td>${t.jenis}</td>
      <td>${t.beratBasah} kg</td>
      <td><span class="badge-kkk ${kkkBadgeClass}">${t.kkkPercent}%</span></td>
      <td><strong>${t.beratKering} kg</strong></td>
      <td>${formatRupiah(t.hargaKering)}</td>
      <td><strong class="text-green">${formatRupiah(t.grandTotal)}</strong></td>
      <td class="no-print">
        <div class="action-btn-group">
          <button class="btn btn-outline btn-sm" onclick="reprintReceipt('${t.id}')" title="Cetak Struk">
            <i class="fa-solid fa-print"></i> Struk
          </button>
          <button class="btn btn-secondary btn-sm" onclick="editTransactionModal('${t.id}')" title="Edit Transaksi">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger-light btn-sm" onclick="deleteTransactionConfirm('${t.id}')" title="Hapus Transaksi">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

window.editTransactionModal = function(trxId) {
  const trx = state.transactions.find(t => t.id === trxId);
  if (!trx) return;

  document.getElementById('edit-trx-id').value = trx.id;
  document.getElementById('edit-trx-petani').value = trx.farmerId;
  document.getElementById('edit-trx-jenis').value = trx.jenis;
  document.getElementById('edit-trx-harga').value = trx.hargaKering;
  document.getElementById('edit-trx-basah').value = trx.beratBasah;
  document.getElementById('edit-trx-kkk').value = trx.kkkPercent;
  document.getElementById('edit-trx-potbon').value = trx.potongKasbon || 0;

  document.getElementById('modal-edit-transaksi').classList.add('active');
};

window.deleteTransactionConfirm = function(trxId) {
  if (confirm(`Apakah Anda yakin ingin menghapus transaksi ${trxId}?`)) {
    state.deleteTransaction(trxId);
    showToast(`Transaksi ${trxId} telah dihapus.`);
    renderHistoryTab();
    renderDashboard();
    renderFarmersTab();
  }
};

/* ================= MODAL EVENT HANDLERS ================= */
function initModalEvents() {
  // Registration is handled via full-page #register-view in initAuth()

  // Modal 2: Success Notification Popup
  const modalSuccess = document.getElementById('modal-notif-success');
  if (modalSuccess) {
    const btnCloseNotif = document.getElementById('btn-close-notif-success');
    if (btnCloseNotif) btnCloseNotif.addEventListener('click', () => modalSuccess.classList.remove('active'));
  }

  // Modal 3: Edit Profile Tokeh (Point #3)
  const modalProf = document.getElementById('modal-edit-profile');
  document.getElementById('btn-open-edit-profile').addEventListener('click', () => {
    const user = state.currentUser;
    document.getElementById('prof-fullname').value = user.fullname || '';
    document.getElementById('prof-email').value = user.email || '';
    document.getElementById('prof-phone').value = user.phone || '';
    document.getElementById('prof-resaddress').value = user.resaddress || '';
    document.getElementById('prof-storeaddress').value = user.address || '';
    modalProf.classList.add('active');
  });

  document.getElementById('btn-close-modal-profile').addEventListener('click', () => modalProf.classList.remove('active'));
  document.getElementById('btn-cancel-modal-profile').addEventListener('click', () => modalProf.classList.remove('active'));

  document.getElementById('form-edit-profile').addEventListener('submit', (e) => {
    e.preventDefault();
    const newFullname = document.getElementById('prof-fullname').value.trim();
    state.currentUser.fullname = newFullname;
    state.currentUser.email = document.getElementById('prof-email').value.trim();
    state.currentUser.phone = document.getElementById('prof-phone').value.trim();
    state.currentUser.resaddress = document.getElementById('prof-resaddress').value.trim();
    state.currentUser.address = document.getElementById('prof-storeaddress').value.trim();

    // Automatically update storename to follow user fullname update
    state.currentUser.storename = 'Gudang Karet ' + newFullname;

    // Sync changes to accounts list
    const accIdx = state.accounts.findIndex(a => a.username === state.currentUser.username);
    if (accIdx !== -1) {
      state.accounts[accIdx] = { ...state.accounts[accIdx], ...state.currentUser };
    }

    state.save();
    updateUserProfileUI();
    showToast(`Profil tokeh berhasil diperbarui! Nama Gudang disinkronkan: Gudang Karet ${newFullname}`);
    modalProf.classList.remove('active');
  });

  // Modal 4: Ubah Password via Email OTP (Point #3)
  const modalPw = document.getElementById('modal-change-password');
  const btnOpenPw = document.getElementById('btn-open-change-password');
  const btnSendOtp = document.getElementById('btn-send-otp');
  const otpGroup = document.getElementById('otp-input-group');
  const otpInput = document.getElementById('pw-otp');
  const btnSubmitPw = document.getElementById('btn-submit-pw-change');

  btnOpenPw.addEventListener('click', () => {
    document.getElementById('pw-email-display').value = state.currentUser.email || 'tokeh.ramli@gmail.com';
    document.getElementById('form-change-password').reset();
    document.getElementById('pw-email-display').value = state.currentUser.email || 'tokeh.ramli@gmail.com';
    otpGroup.classList.add('hidden');
    btnSubmitPw.disabled = true;
    currentGeneratedOtp = null;
    
    modalProf.classList.remove('active');
    modalPw.classList.add('active');
  });

  document.getElementById('btn-close-modal-changepw').addEventListener('click', () => modalPw.classList.remove('active'));
  document.getElementById('btn-cancel-modal-changepw').addEventListener('click', () => modalPw.classList.remove('active'));

  // Send OTP Handler
  btnSendOtp.addEventListener('click', () => {
    currentGeneratedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    otpGroup.classList.remove('hidden');
    btnSubmitPw.disabled = false;
    
    showToast(`SIMULASI EMAIL: Kode OTP Verifikasi Anda adalah ${currentGeneratedOtp}`, 'success');
  });

  // Handle Change Password Form Submit
  document.getElementById('form-change-password').addEventListener('submit', (e) => {
    e.preventDefault();
    const oldPw = document.getElementById('pw-old').value;
    const newPw = document.getElementById('pw-new').value;
    const enteredOtp = otpInput.value.trim();

    if (oldPw !== state.currentUser.password) {
      showToast('Password lama Anda salah!', 'error');
      return;
    }

    if (!currentGeneratedOtp || enteredOtp !== currentGeneratedOtp) {
      showToast('Kode OTP Verifikasi Email salah atau belum dikirim!', 'error');
      return;
    }

    // Update password in current user & account list
    state.currentUser.password = newPw;
    const accIndex = state.accounts.findIndex(a => a.username === state.currentUser.username);
    if (accIndex !== -1) {
      state.accounts[accIndex].password = newPw;
    }

    // Logout user automatically & save state
    state.isLoggedIn = false;
    state.save();

    modalPw.classList.remove('active');
    showToast('Password berhasil diubah via verifikasi email! Silakan masuk kembali.');
    showLoginView();
  });

  // Modal 5: Tambah / Edit Petani
  const modalPetani = document.getElementById('modal-petani');
  const openAddFarmer = () => {
    document.getElementById('modal-petani-title').innerHTML = `<i class="fa-solid fa-user-plus text-green"></i> Tambah Data Petani Baru`;
    document.getElementById('form-add-petani').reset();
    document.getElementById('m-petani-id').value = '';
    modalPetani.classList.add('active');
  };

  document.getElementById('btn-modal-add-petani').addEventListener('click', openAddFarmer);
  document.getElementById('btn-add-farmer-main').addEventListener('click', openAddFarmer);
  document.getElementById('btn-close-modal-petani').addEventListener('click', () => modalPetani.classList.remove('active'));
  document.getElementById('btn-cancel-modal-petani').addEventListener('click', () => modalPetani.classList.remove('active'));

  document.getElementById('form-add-petani').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('m-petani-id').value;
    const name = document.getElementById('m-nama-petani').value;
    const phone = document.getElementById('m-hp-petani').value;
    const location = document.getElementById('m-lokasi-kebun').value;
    const kasbon = parseFloat(document.getElementById('m-kasbon-awal').value) || 0;

    if (id) {
      state.updateFarmer({ id, name, phone, location, kasbon });
      showToast(`Data petani ${name} berhasil diperbarui!`);
    } else {
      const newFarmer = {
        id: 'F' + Math.floor(100 + Math.random() * 900),
        name,
        phone,
        location,
        kasbon
      };
      state.addFarmer(newFarmer);
      showToast(`Petani ${name} berhasil ditambahkan!`);
    }

    modalPetani.classList.remove('active');
    initFarmerDropdowns();
    renderFarmersTab();
  });

  // Modal 6: Edit Transaksi
  const modalEditTrx = document.getElementById('modal-edit-transaksi');
  document.getElementById('btn-close-modal-edit-trx').addEventListener('click', () => modalEditTrx.classList.remove('active'));
  document.getElementById('btn-cancel-modal-edit-trx').addEventListener('click', () => modalEditTrx.classList.remove('active'));

  document.getElementById('form-edit-transaksi').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit-trx-id').value;
    const farmerId = document.getElementById('edit-trx-petani').value;
    const jenis = document.getElementById('edit-trx-jenis').value;
    const hargaKering = parseFloat(document.getElementById('edit-trx-harga').value);
    const beratBasah = parseFloat(document.getElementById('edit-trx-basah').value);
    const kkkPercent = parseFloat(document.getElementById('edit-trx-kkk').value);
    const potongKasbon = parseFloat(document.getElementById('edit-trx-potbon').value) || 0;

    const farmer = state.farmers.find(f => f.id === farmerId);
    const beratKering = parseFloat((beratBasah * (kkkPercent / 100)).toFixed(1));
    const subtotal = Math.round(beratKering * hargaKering);
    const grandTotal = Math.max(0, subtotal - potongKasbon);

    state.updateTransaction({
      id,
      farmerId,
      farmerName: farmer ? farmer.name : 'Unknown',
      jenis,
      hargaKering,
      beratBasah,
      kkkPercent,
      beratKering,
      subtotal,
      potongKasbon,
      grandTotal
    });

    showToast(`Transaksi ${id} berhasil diperbarui!`);
    modalEditTrx.classList.remove('active');
    renderHistoryTab();
    renderDashboard();
    renderFarmersTab();
  });
}

window.quickTimbangForFarmer = function(farmerId) {
  document.querySelector('.nav-item[data-tab="transaction"]').click();
  document.getElementById('input-petani').value = farmerId;
  document.getElementById('input-petani').dispatchEvent(new Event('change'));
};

window.reprintReceipt = function(trxId) {
  const trx = state.transactions.find(t => t.id === trxId);
  if (!trx) return;

  document.querySelector('.nav-item[data-tab="transaction"]').click();
  
  document.getElementById('r-no').textContent = trx.id;
  document.getElementById('r-date').textContent = trx.date;
  document.getElementById('r-petani').textContent = trx.farmerName;
  document.getElementById('r-jenis').textContent = trx.jenis;
  document.getElementById('r-basah').textContent = `${trx.beratBasah} kg`;
  document.getElementById('r-kkk').textContent = `${trx.kkkPercent} %`;
  document.getElementById('r-kering').textContent = `${trx.beratKering} kg`;
  document.getElementById('r-harga').textContent = formatRupiah(trx.hargaKering);
  document.getElementById('r-subtotal').textContent = formatRupiah(trx.subtotal);
  document.getElementById('r-potbon').textContent = formatRupiah(trx.potongKasbon);
  document.getElementById('r-total').textContent = formatRupiah(trx.grandTotal);

  document.body.classList.add('printing-receipt');
  window.print();
  document.body.classList.remove('printing-receipt');
};

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${message}`;
  if (type === 'error') {
    toast.style.background = '#991b1b';
    toast.style.borderLeftColor = '#ef4444';
    toast.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${message}`;
  }
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

/* ================= ONBOARDING TUTORIAL HANDLER ================= */
function initTutorial() {
  const modalTutorial = document.getElementById('modal-onboarding-tutorial');
  if (!modalTutorial) return;

  let currentSlide = 1;
  const totalSlides = 4;

  const showSlide = (slideNum) => {
    currentSlide = slideNum;
    const slides = modalTutorial.querySelectorAll('.tutorial-slide');
    const dots = modalTutorial.querySelectorAll('.tutorial-dots .dot');

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    const activeSlide = modalTutorial.querySelector(`.tutorial-slide[data-slide="${slideNum}"]`);
    const activeDot = modalTutorial.querySelector(`.tutorial-dots .dot[data-dot="${slideNum}"]`);

    if (activeSlide) activeSlide.classList.add('active');
    if (activeDot) activeDot.classList.add('active');

    const btnPrev = document.getElementById('btn-prev-tutorial');
    const btnNext = document.getElementById('btn-next-tutorial');
    const btnFinish = document.getElementById('btn-finish-tutorial');

    if (btnPrev) btnPrev.style.display = slideNum === 1 ? 'none' : 'inline-flex';
    if (btnNext) btnNext.style.display = slideNum === totalSlides ? 'none' : 'inline-flex';
    if (btnFinish) btnFinish.style.display = slideNum === totalSlides ? 'inline-flex' : 'none';
  };

  const openTutorial = () => {
    showSlide(1);
    modalTutorial.classList.add('active');
  };

  const closeTutorial = () => {
    modalTutorial.classList.remove('active');
    if (state.currentUser) {
      state.currentUser.hasSeenTutorial = true;
      state.save();
    }
  };

  document.getElementById('btn-open-tutorial')?.addEventListener('click', openTutorial);
  document.getElementById('btn-close-tutorial')?.addEventListener('click', closeTutorial);
  document.getElementById('btn-prev-tutorial')?.addEventListener('click', () => showSlide(Math.max(1, currentSlide - 1)));
  document.getElementById('btn-next-tutorial')?.addEventListener('click', () => showSlide(Math.min(totalSlides, currentSlide + 1)));
  document.getElementById('btn-finish-tutorial')?.addEventListener('click', closeTutorial);

  modalTutorial.querySelectorAll('.tutorial-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const targetSlide = parseInt(dot.getAttribute('data-dot'), 10);
      showSlide(targetSlide);
    });
  });

  window.checkAutoOpenTutorial = () => {
    if (state.currentUser && !state.currentUser.hasSeenTutorial) {
      openTutorial();
    }
  };
}
