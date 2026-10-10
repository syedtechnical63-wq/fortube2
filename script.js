/* ============================================================
   FORTUBE v15 - FINAL (Green/Black Theme + All Features)
   ============================================================ */

const SUPABASE_URL = "https://eaxstlpltwgpmaupgcwq.supabase.co";
const SUPABASE_KEY = "sb_publishable_sfcTaBDwgGM8ccmMfwP_ig_A6jTZ8w7";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const AGORA_APP_ID = "e84b0914baa44e8c878fb68ade1d804e";
const ADMIN_EMAILS = ["syedtechnical63@gmail.com"];

// 💰 REVENUE RATES
const REVENUE_PER_500_SUBS = 1.00;
const REVENUE_PER_1000_HOURS = 0.50;
const REVENUE_PER_1000_VIEWS = 0.07;
const MIN_WITHDRAWAL = 10.00; // ✅ CHANGED to $10

// 🪙 GIFT COIN SETTINGS
const MIN_COINS = 10;
const MAX_COINS = 50000;
const COIN_TO_RUPEE = 1;
const RECHARGE_ACCOUNT = "03010975121";
const RECHARGE_HOLDER = "Saima Batool";

// 🎁 GIFT LIST (30-40 gifts)
const GIFTS = [
  { id: 'rose', name: 'Rose', emoji: '🌹', coins: 10 },
  { id: 'heart', name: 'Heart', emoji: '❤️', coins: 10 },
  { id: 'star', name: 'Star', emoji: '⭐', coins: 15 },
  { id: 'kiss', name: 'Kiss', emoji: '💋', coins: 20 },
  { id: 'flower', name: 'Flower', emoji: '🌻', coins: 25 },
  { id: 'cake', name: 'Cake', emoji: '🎂', coins: 30 },
  { id: 'chocolate', name: 'Chocolate', emoji: '🍫', coins: 40 },
  { id: 'teddy', name: 'Teddy', emoji: '🧸', coins: 50 },
  { id: 'crown', name: 'Crown', emoji: '👑', coins: 75 },
  { id: 'ring', name: 'Ring', emoji: '💍', coins: 100 },
  { id: 'diamond', name: 'Diamond', emoji: '💎', coins: 150 },
  { id: 'balloon', name: 'Balloon', emoji: '🎈', coins: 20 },
  { id: 'fire', name: 'Fire', emoji: '🔥', coins: 30 },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', coins: 200 },
  { id: 'trophy', name: 'Trophy', emoji: '🏆', coins: 250 },
  { id: 'medal', name: 'Medal', emoji: '🏅', coins: 80 },
  { id: 'guitar', name: 'Guitar', emoji: '🎸', coins: 120 },
  { id: 'mic', name: 'Microphone', emoji: '🎤', coins: 90 },
  { id: 'gift', name: 'Gift Box', emoji: '🎁', coins: 60 },
  { id: 'beer', name: 'Drink', emoji: '🍺', coins: 45 },
  { id: 'pizza', name: 'Pizza', emoji: '🍕', coins: 55 },
  { id: 'burger', name: 'Burger', emoji: '🍔', coins: 50 },
  { id: 'icecream', name: 'Ice Cream', emoji: '🍦', coins: 35 },
  { id: 'candy', name: 'Candy', emoji: '🍬', coins: 15 },
  { id: 'lollipop', name: 'Lollipop', emoji: '🍭', coins: 20 },
  { id: 'sunglasses', name: 'Sunglasses', emoji: '🕶️', coins: 70 },
  { id: 'watch', name: 'Watch', emoji: '⌚', coins: 300 },
  { id: 'car', name: 'Car', emoji: '🚗', coins: 500 },
  { id: 'plane', name: 'Airplane', emoji: '✈️', coins: 400 },
  { id: 'yacht', name: 'Yacht', emoji: '🛥️', coins: 800 },
  { id: 'castle', name: 'Castle', emoji: '🏰', coins: 1000 },
  { id: 'unicorn', name: 'Unicorn', emoji: '🦄', coins: 1500 },
  { id: 'dragon', name: 'Dragon', emoji: '🐉', coins: 2000 },
  { id: 'lion', name: 'Lion', emoji: '🦁', coins: 600 },
  { id: 'galaxy', name: 'Galaxy', emoji: '🌌', coins: 5000 },
  { id: 'supernova', name: 'Supernova', emoji: '💥', coins: 10000 },
  { id: 'universe', name: 'Universe', emoji: '🌠', coins: 20000 },
  { id: 'infinite', name: 'Infinity', emoji: '♾️', coins: 50000 }
];

// ==================== INDEXEDDB ====================
const IDB_NAME = 'fortube_videos_db';
const IDB_STORE = 'videos';
let idbInstance = null;

function openIDB() {
  return new Promise((resolve, reject) => {
    if (idbInstance) return resolve(idbInstance);
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'id' });
      }
    };
    req.onsuccess = (e) => { idbInstance = e.target.result; resolve(idbInstance); };
    req.onerror = () => reject(req.error);
  });
}

async function saveVideoToIDB(id, blob) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put({ id, blob, savedAt: Date.now() });
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) { return false; }
}

async function getVideoFromIDB(id) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(id);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) { return null; }
}

async function deleteVideoFromIDB(id) {
  try {
    const db = await openIDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(id);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) { return false; }
}

// ==================== STATE ====================
const state = {
  loggedIn: false,
  user: null,
  email: '',
  channel: null,
  recentlyWatchedList: [],
  allChannels: [],
  allVideos: [],
  notifications: [],
  subscriptions: [],
  activeLiveStream: null,
  agoraClient: null,
  agoraTracks: [],
  liveStartTime: null,
  liveDurationInterval: null,
  currentWatchStartTime: null,
  currentWatchingVideoId: null,
  currentWatchingLive: null,
  chartInstances: {},
  shortsIndex: 0,
  userCoins: 0,
  preferences: {
    language: 'English',
    region: 'Global',
    currency: 'USD',
    subtitles: false,
    restricted: false,
    history: true,
    notifications: true,
    quality: 'auto'
  }
};

// ==================== DOM REFS ====================
const $ = id => document.getElementById(id);

const loginGate = $('loginGate');
const gateEmail = $('gateEmail');
const gatePassword = $('gatePassword');
const gateLoginBtn = $('gateLoginBtn');
const hamburgerBtn = $('hamburgerBtn');
const drawer = $('drawer');
const drawerOverlay = $('drawerOverlay');
const drawerUserEmail = $('drawerUserEmail');
const feed = $('feed');
const feedTitle = $('feedTitle');
const emptyFeed = $('emptyFeed');
const searchInput = $('searchInput');
const searchBtn = $('searchBtn');
const micBtn = $('micBtn');
const profilePanel = $('profilePanel');
const profileBackBtn = $('profileBackBtn');
const profileName = $('profileName');
const profileEmail = $('profileEmail');
const channelStatusArea = $('channelStatusArea');
const recentlyWatched = $('recentlyWatched');
const monetizationCard = $('monetizationCard');
const analyticsCard = $('analyticsCard');
const monetizationSubtext = $('monetizationSubtext');
const monetizationPage = $('monetizationPage');
const monetizationBackBtn = $('monetizationBackBtn');
const verifyBtn = $('verifyBtn');
const progressFill = $('progressFill');
const check1 = $('check1'), check2 = $('check2'), check3 = $('check3');
const viewsProgress = $('viewsProgress');
const watchProgress = $('watchProgress');
const subsProgress = $('subsProgress');
const eligibilityCard = $('eligibilityCard');
const monetizationApplyPage = $('monetizationApplyPage');
const monetizationRevenuePage = $('monetizationRevenuePage');
const submitMonetizationApplication = $('submitMonetizationApplication');
const applicationStatus = $('applicationStatus');
const verificationDocument = $('verificationDocument');
const monetizationEmail = $('monetizationEmail');
const totalRevenue = $('totalRevenue');
const withdrawRevenueBtn = $('withdrawRevenueBtn');
const withdrawHistory = $('withdrawHistory');
const withdrawPage = $('withdrawPage');
const withdrawBackBtn = $('withdrawBackBtn');
const watchPage = $('watchPage');
const watchBackBtn = $('watchBackBtn');
const watchHeaderTitle = $('watchHeaderTitle');
const watchBody = $('watchBody');
const channelViewPage = $('channelViewPage');
const channelViewBackBtn = $('channelViewBackBtn');
const channelViewHeaderTitle = $('channelViewHeaderTitle');
const channelViewBody = $('channelViewBody');
const channelSetupPage = $('channelSetupPage');
const channelSetupBackBtn = $('channelSetupBackBtn');
const setupBanner = $('setupBanner');
const bannerOverlay = $('bannerOverlay');
const setupAvatar = $('setupAvatar');
const setupAvatarEmoji = $('setupAvatarEmoji');
const setupChannelName = $('setupChannelName');
const setupUsername = $('setupUsername');
const setupCategory = $('setupCategory');
const setupLanguage = $('setupLanguage');
const setupCurrency = $('setupCurrency');
const setupRegion = $('setupRegion');
const setupDesc = $('setupDesc');
const channelSetupCancelBtn = $('channelSetupCancelBtn');
const channelSetupCreateBtn = $('channelSetupCreateBtn');
const editChannelPage = $('editChannelPage');
const editChannelBackBtn = $('editChannelBackBtn');
const editBanner = $('editBanner');
const editAvatar = $('editAvatar');
const editAvatarEmoji = $('editAvatarEmoji');
const editChannelName = $('editChannelName');
const editUsername = $('editUsername');
const editCategory = $('editCategory');
const editLanguage = $('editLanguage');
const editCurrency = $('editCurrency');
const editRegion = $('editRegion');
const editDesc = $('editDesc');
const editChannelCancelBtn = $('editChannelCancelBtn');
const editChannelSaveBtn = $('editChannelSaveBtn');
const settingsPage = $('settingsPage');
const settingsBackBtn = $('settingsBackBtn');
const settingsEmail = $('settingsEmail');
const settingsChannelStatus = $('settingsChannelStatus');
const settingsLanguage = $('settingsLanguage');
const settingsRegion = $('settingsRegion');
const settingsCurrency = $('settingsCurrency');
const settingsQuality = $('settingsQuality');
const toggleSubtitles = $('toggleSubtitles');
const toggleRestricted = $('toggleRestricted');
const toggleHistory = $('toggleHistory');
const toggleNotifications = $('toggleNotifications');
const clearCacheBtn = $('clearCacheBtn');
const termsBtn = $('termsBtn');
const contactBtn = $('contactBtn');
const deleteAccountBtn = $('deleteAccountBtn');
const logoutBtn = $('logoutBtn');
const toast = $('toast');
const navYou = $('navYou');
const navPlus = $('navPlus');
const notifBtn = $('notifBtn');
const settingsBtn = $('settingsBtn');
const notifDot = $('notifDot');
const cameraPanel = $('cameraPanel');
const cameraVideo = $('cameraVideo');
const cameraPlaceholder = $('cameraPlaceholder');
const camClose = $('camClose');
const camFlip = $('camFlip');
const recordBtn = $('recordBtn');
const recordTimer = $('recordTimer');
const longVideoBtn = $('longVideoBtn');
const shortVideoBtn = $('shortVideoBtn');
const galleryBtn = $('galleryBtn');
const galleryBtn2 = $('galleryBtn2');
const nativeGalleryInput = $('nativeGalleryInput');
const thumbnailInput = $('thumbnailInput');
const profilePicInput = $('profilePicInput');
const bannerInput = $('bannerInput');
const uploadDetailsModal = $('uploadDetailsModal');
const uploadPreviewBox = $('uploadPreviewBox');
const uploadPreviewDur = $('uploadPreviewDur');
const uploadTitle = $('uploadTitle');
const uploadCancel = $('uploadCancel');
const uploadNextBtn = $('uploadNextBtn');
const metadataPage = $('metadataPage');
const metadataBackBtn = $('metadataBackBtn');
const thumbnailPicker = $('thumbnailPicker');
const metaTitle = $('metaTitle');
const metaDescription = $('metaDescription');
const metaCategory = $('metaCategory');
const metaTagInput = $('metaTagInput');
const addTagBtn = $('addTagBtn');
const tagsContainer = $('tagsContainer');
const metadataCancelBtn = $('metadataCancelBtn');
const metadataPublishBtn = $('metadataPublishBtn');
const uploadProgressWrap = $('uploadProgressWrap');
const uploadProgressFill = $('uploadProgressFill');
const uploadProgressText = $('uploadProgressText');
const alertPopup = $('alertPopup');
const alertTitle = $('alertTitle');
const alertMessage = $('alertMessage');
const alertCloseBtn = $('alertCloseBtn');
const plusMenu = $('plusMenu');
const plusMenuOverlay = $('plusMenuOverlay');
const plusUploadBtn = $('plusUploadBtn');
const plusLiveBtn = $('plusLiveBtn');
const plusCreatedBtn = $('plusCreatedBtn');
const notificationsPage = $('notificationsPage');
const notificationsBackBtn = $('notificationsBackBtn');
const notificationsBody = $('notificationsBody');
const subscriptionsPage = $('subscriptionsPage');
const subsBackBtn = $('subsBackBtn');
const subscriptionsBody = $('subscriptionsBody');

// Shorts fullscreen
const shortsFullscreen = $('shortsFullscreen');
const shortsScrollContainer = $('shortsScrollContainer');
const shortsCloseBtn = $('shortsCloseBtn');

// Live watch
const liveWatchPage = $('liveWatchPage');
const liveWatchBackBtn = $('liveWatchBackBtn');
const liveWatchContainer = $('liveWatchContainer');
const liveWatchViewers = $('liveWatchViewers');
const liveWatchTitle = $('liveWatchTitle');
const liveWatchHostName = $('liveWatchHostName');
const liveLikeBtn = $('liveLikeBtn');
const liveLikeCount = $('liveLikeCount');
const liveShareBtn = $('liveShareBtn');
const liveGiftBtn = $('liveGiftBtn');
const liveLikeHeart = $('liveLikeHeart');
const liveLikeCounter = $('liveLikeCounter');
const liveGiftAnimation = $('liveGiftAnimation');

// Gift / Recharge
const giftPanel = $('giftPanel');
const giftCloseBtn = $('giftCloseBtn');
const giftGrid = $('giftGrid');
const giftCoinsBalance = $('giftCoinsBalance');
const giftRechargeBtn = $('giftRechargeBtn');
const rechargePage = $('rechargePage');
const rechargeBackBtn = $('rechargeBackBtn');
const rechargeAccountNumber = $('rechargeAccountNumber');
const copyAccountBtn = $('copyAccountBtn');
const coinPackages = $('coinPackages');
const customCoinAmount = $('customCoinAmount');
const rechargeTxnId = $('rechargeTxnId');
const submitRechargeBtn = $('submitRechargeBtn');
const rechargeStatus = $('rechargeStatus');

// Analytics
const analyticsPage = $('analyticsPage');
const analyticsBackBtn = $('analyticsBackBtn');
const analyticsTotalViews = $('analyticsTotalViews');
const analyticsTotalWatchTime = $('analyticsTotalWatchTime');
const analyticsTotalSubs = $('analyticsTotalSubs');
const analyticsTotalVideos = $('analyticsTotalVideos');
const analyticsCPM = $('analyticsCPM');
const analyticsRPM = $('analyticsRPM');
const analyticsCountries = $('analyticsCountries');

let currentEditVideoId = null;
let currentEditThumbnailData = null;
let currentUploadType = 'short';
let pendingUpload = null;
let metaTags = [];
let metaVisibility = 'public';
let selectedThumbnailData = null;
let currentVideoBlobUrl = null;
let currentFilter = 'home';
let liveTags = [];
let liveVisibility = 'public';
let previewStream = null;

// ==================== HELPERS ====================
function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function escapeHTML(str) {
  return String(str).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

function formatDuration(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${m}:${String(s).padStart(2,'0')}`;
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
  if (diff < 2592000) return Math.floor(diff / 86400) + ' days ago';
  if (diff < 31536000) return Math.floor(diff / 2592000) + ' months ago';
  return Math.floor(diff / 31536000) + ' years ago';
}

function showAlert(title, message, icon = 'fa-broadcast-tower') {
  if (!alertPopup) return;
  alertTitle.textContent = title;
  alertMessage.innerHTML = message;
  const iconEl = document.getElementById('alertIcon');
  if (iconEl) iconEl.innerHTML = `<i class="fas ${icon}"></i>`;
  alertPopup.classList.add('active');
}

function generateLiveChannelName() {
  return 'live_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
}

function isUserAdmin() {
  return state.email && ADMIN_EMAILS.includes(state.email.toLowerCase());
}

// ============================================================
// 🚫 CONTENT MODERATION (Copyright + Adult Content)
// ============================================================
const ADULT_KEYWORDS = ['sexy', 'xxx', 'porn', 'nude', 'naked', 'sex', '18+', 'adult', 'hot girl', 'hot boy', 'bf video', 'gf video', 'blue film'];

function checkAdultContent(title, description, tags) {
  const text = (title + ' ' + description + ' ' + (tags || []).join(' ')).toLowerCase();
  return ADULT_KEYWORDS.some(kw => text.includes(kw));
}

async function checkCopyright(title, videoBlobSize) {
  // Simple copyright check: same title + same file size = suspicious
  const { data } = await supabaseClient
    .from('videos')
    .select('id, title, file_size, owner_id')
    .ilike('title', title.trim());
  if (!data || data.length === 0) return false;
  return data.some(v => v.owner_id !== state.user.id && v.file_size && Math.abs(v.file_size - videoBlobSize) < 1000);
}

async function banChannel(reason) {
  if (!state.channel) return;
  await supabaseClient.from('channels').update({
    is_banned: true,
    ban_reason: reason,
    banned_at: new Date().toISOString()
  }).eq('id', state.channel.id);
  showAlert('🚫 Channel Banned', `Your channel has been banned.<br><br>Reason: <strong>${reason}</strong><br><br>Contact: syedtechnical63@gmail.com`, 'fa-ban');
  setTimeout(async () => {
    await supabaseClient.auth.signOut();
    location.reload();
  }, 5000);
}

// ============================================================
// 💰 REVENUE CALCULATION
// ============================================================
function calculateRevenue(subscribers, watchHours, totalViews) {
  const subRevenue = (subscribers / 500) * REVENUE_PER_500_SUBS;
  const watchRevenue = (watchHours / 1000) * REVENUE_PER_1000_HOURS;
  const viewBonus = totalViews * 0.00001;
  return {
    subRevenue, watchRevenue, viewBonus,
    total: subRevenue + watchRevenue + viewBonus
  };
}

// ============================================================
// 📊 ANIMATED GRAPH HELPER
// ============================================================
function drawAnimatedLineChart(canvas, data, color, label) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const W = rect.width, H = rect.height;
  const pad = { top: 15, right: 10, bottom: 25, left: 35 };
  const cw = W - pad.left - pad.right;
  const ch = H - pad.top - pad.bottom;

  const maxVal = Math.max(...data, 1);
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString('en', { weekday: 'short' }));
  }

  ctx.clearRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = '#1e3a2e';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (ch / 4) * i;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(W - pad.right, y);
    ctx.stroke();
  }

  // X labels
  ctx.fillStyle = '#64748b';
  ctx.font = '9px sans-serif';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    ctx.fillText(l, pad.left + (cw / 6) * i, H - 8);
  });

  // Y labels
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = Math.round(maxVal - (maxVal / 4) * i);
    ctx.fillText(v.toString(), pad.left - 5, pad.top + (ch / 4) * i + 3);
  }

  // Animated line
  let progress = 0;
  const animate = () => {
    progress += 0.04;
    if (progress > 1) progress = 1;

    // Clear chart area only
    ctx.clearRect(0, 0, W, H);

    // Grid redraw
    ctx.strokeStyle = '#1e3a2e';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad.top + (ch / 4) * i;
      ctx.beginPath();
      ctx.moveTo(pad.left, y);
      ctx.lineTo(W - pad.right, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#64748b';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'center';
    labels.forEach((l, i) => ctx.fillText(l, pad.left + (cw / 6) * i, H - 8));
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const v = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(v.toString(), pad.left - 5, pad.top + (ch / 4) * i + 3);
    }

    const points = data.map((v, i) => ({
      x: pad.left + (cw / 6) * i,
      y: pad.top + ch - (v / maxVal) * ch
    }));

    const upto = Math.floor(progress * (points.length - 1));

    // Fill
    ctx.beginPath();
    ctx.moveTo(points[0].x, pad.top + ch);
    for (let i = 0; i <= upto; i++) ctx.lineTo(points[i].x, points[i].y);
    if (upto < points.length - 1) {
      const frac = progress * (points.length - 1) - upto;
      const px = points[upto].x + (points[upto + 1].x - points[upto].x) * frac;
      const py = points[upto].y + (points[upto + 1].y - points[upto].y) * frac;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(points[upto].x, pad.top + ch);
    ctx.closePath();
    ctx.fillStyle = color + '22';
    ctx.fill();

    // Line
    ctx.beginPath();
    for (let i = 0; i <= upto; i++) {
      if (i === 0) ctx.moveTo(points[i].x, points[i].y);
      else ctx.lineTo(points[i].x, points[i].y);
    }
    if (upto < points.length - 1) {
      const frac = progress * (points.length - 1) - upto;
      const px = points[upto].x + (points[upto + 1].x - points[upto].x) * frac;
      const py = points[upto].y + (points[upto + 1].y - points[upto].y) * frac;
      ctx.lineTo(px, py);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Dots
    for (let i = 0; i <= upto; i++) {
      ctx.beginPath();
      ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = '#0f1a0f';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (progress < 1) requestAnimationFrame(animate);
  };
  animate();
}

function generateGrowthData(total, days = 7) {
  const arr = [];
  const inc = total / (days + 3);
  for (let i = 0; i < days; i++) {
    arr.push(Math.max(0, Math.round(inc * (i + 1) + (Math.random() * inc * 0.3 - inc * 0.15))));
  }
  return arr;
}
// ============================================================
// PASSWORD RESET
// ============================================================
async function resetPassword(email) {
  try {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) throw error;
    showToast('📧 Password reset link sent to ' + email);
    return true;
  } catch (e) {
    showToast('❌ ' + e.message);
    return false;
  }
}

// ============================================================
// NOTIFICATIONS
// ============================================================
async function createNotification(userId, message, type = 'info') {
  try {
    await supabaseClient.from('notifications').insert({
      user_id: userId, message, type
    });
  } catch (e) {}
}

// ============================================================
// iOS AUDIO UNLOCK
// ============================================================
function unlockAudioContext() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    if (ctx.state === 'suspended') ctx.resume().then(() => setTimeout(() => ctx.close(), 100));
    else ctx.close();
  } catch (e) {}
}
document.addEventListener('touchstart', unlockAudioContext, { once: true });
document.addEventListener('click', unlockAudioContext, { once: true });

// ============================================================
// VIDEO COMPRESSION
// ============================================================
async function compressVideo(inputBlob, maxSizeMB = 40) {
  return new Promise(async (resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.playsInline = true;
      video.muted = false;
      video.volume = 1;
      video.crossOrigin = 'anonymous';
      const url = URL.createObjectURL(inputBlob);
      video.src = url;

      await new Promise((res, rej) => {
        video.onloadedmetadata = res;
        video.onerror = () => rej(new Error('Cannot read video'));
        setTimeout(() => rej(new Error('Metadata timeout')), 20000);
      });

      const duration = video.duration;
      if (!isFinite(duration) || duration <= 0) {
        URL.revokeObjectURL(url);
        return resolve(inputBlob);
      }

      const targetBytes = maxSizeMB * 1024 * 1024;
      let targetBitrate = Math.floor((targetBytes * 8) / duration);
      targetBitrate = Math.min(targetBitrate, 1500000);
      targetBitrate = Math.max(targetBitrate, 400000);

      const canvas = document.createElement('canvas');
      let w = video.videoWidth || 640, h = video.videoHeight || 480;
      const maxDim = 854;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
        else { w = Math.round(w * maxDim / h); h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      const stream = canvas.captureStream(24);

      let audioCtx = null;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AC();
        if (audioCtx.state === 'suspended') await audioCtx.resume();
        const source = audioCtx.createMediaElementSource(video);
        const dest = audioCtx.createMediaStreamDestination();
        source.connect(dest);
        const silentGain = audioCtx.createGain();
        silentGain.gain.value = 0;
        source.connect(silentGain);
        silentGain.connect(audioCtx.destination);
        const audioTracks = dest.stream.getAudioTracks();
        if (audioTracks.length > 0) audioTracks.forEach(t => stream.addTrack(t));
      } catch (e) {}

      let mimeType = 'video/webm;codecs=vp8,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp9,opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';

      const recorder = new MediaRecorder(stream, {
        mimeType, videoBitsPerSecond: targetBitrate, audioBitsPerSecond: 128000
      });

      const chunks = [];
      recorder.ondataavailable = e => { if (e.data && e.data.size > 0) chunks.push(e.data); };

      const finish = () => {
        URL.revokeObjectURL(url);
        if (audioCtx) { try { audioCtx.close(); } catch (e) {} }
        if (chunks.length === 0) return resolve(inputBlob);
        resolve(new Blob(chunks, { type: mimeType }));
      };

      recorder.onstop = finish;
      recorder.onerror = () => finish();

      let animId;
      const draw = () => {
        if (video.paused || video.ended) return;
        try { ctx.drawImage(video, 0, 0, w, h); } catch (e) {}
        animId = requestAnimationFrame(draw);
      };

      video.onplay = () => draw();
      video.onended = () => {
        cancelAnimationFrame(animId);
        setTimeout(() => { if (recorder.state !== 'inactive') recorder.stop(); }, 300);
      };

      recorder.start(1000);

      try {
        video.currentTime = 0;
        await video.play();
      } catch (playErr) {
        video.muted = true;
        try { await video.play(); } catch (e) {
          if (recorder.state !== 'inactive') recorder.stop();
        }
      }

      const safetyTime = Math.max(duration * 3000, 60000);
      setTimeout(() => {
        if (recorder.state !== 'inactive') {
          cancelAnimationFrame(animId);
          recorder.stop();
        }
      }, safetyTime);
    } catch (err) { resolve(inputBlob); }
  });
}

// ============================================================
// THUMBNAIL GENERATOR
// ============================================================
async function generateThumbnailFromVideo(videoBlob, seekTime = 1) {
  return new Promise((resolve, reject) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(videoBlob);
      video.src = url;
      let done = false;
      const finish = (result, err) => {
        if (done) return;
        done = true;
        URL.revokeObjectURL(url);
        if (err) reject(err); else resolve(result);
      };
      video.onloadedmetadata = () => {
        const seek = Math.min(seekTime, video.duration * 0.1) || 0.5;
        video.currentTime = seek;
      };
      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          let w = video.videoWidth || 640, h = video.videoHeight || 360;
          const maxDim = 1280;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round(h * maxDim / w); w = maxDim; }
            else { w = Math.round(w * maxDim / h); h = maxDim; }
          }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d').drawImage(video, 0, 0, w, h);
          finish(canvas.toDataURL('image/jpeg', 0.85));
        } catch (err) { finish(null, err); }
      };
      video.onerror = () => finish(null, new Error('Video load failed'));
      setTimeout(() => finish(null, new Error('Thumbnail timeout')), 15000);
    } catch (err) { reject(err); }
  });
}

// ============================================================
// AUTH
// ============================================================
async function checkSession() {
  try {
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session && session.user) {
      state.loggedIn = true;
      state.user = session.user;
      state.email = session.user.email;
      await loadUserChannel();
      if (loginGate) loginGate.classList.add('hide');
      updateUI();
      await loadFeedFromSupabase();
      await loadNotifications();
      await checkActiveLiveStream();
    } else {
      if (loginGate) loginGate.classList.remove('hide');
    }
  } catch (e) {
    if (loginGate) loginGate.classList.remove('hide');
  }
}

async function loadUserChannel() {
  if (!state.user) return;
  try {
    const { data } = await supabaseClient
      .from('channels').select('*')
      .eq('owner_id', state.user.id).maybeSingle();
    state.channel = data || null;
  } catch (e) { state.channel = null; }
}

async function checkActiveLiveStream() {
  if (!state.channel) return;
  try {
    const { data } = await supabaseClient
      .from('live_streams').select('*')
      .eq('channel_id', state.channel.id).eq('is_active', true).maybeSingle();
    if (data) state.activeLiveStream = data;
  } catch (e) {}
}

// LOGIN
if (gateLoginBtn) {
  gateLoginBtn.addEventListener('click', async () => {
    const email = gateEmail.value.trim();
    const pass = gatePassword.value.trim();
    if (!email || !email.includes('@')) { showToast('Valid email enter karein'); return; }
    if (!pass || pass.length < 6) { showToast('Password min 6 characters'); return; }
    gateLoginBtn.disabled = true;
    gateLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
    try {
      let { data, error } = await supabaseClient.auth.signInWithPassword({ email, password: pass });
      if (error) {
        const signup = await supabaseClient.auth.signUp({ email, password: pass });
        if (signup.error) {
          showToast('❌ ' + signup.error.message);
          gateLoginBtn.disabled = false;
          gateLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login / Sign Up';
          return;
        }
        data = signup.data;
        if (!signup.data.session) {
          const retry = await supabaseClient.auth.signInWithPassword({ email, password: pass });
          if (retry.error) {
            showToast('📧 Email confirm karein');
            gateLoginBtn.disabled = false;
            gateLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login / Sign Up';
            return;
          }
          data = retry.data;
        }
        showToast('✅ Account created!');
      }
      if (data && data.user) {
        state.loggedIn = true;
        state.user = data.user;
        state.email = data.user.email;
        await loadUserChannel();
        if (loginGate) loginGate.classList.add('hide');
        showToast('✅ Welcome ' + email);
        updateUI();
        await loadFeedFromSupabase();
        await loadNotifications();
        await checkActiveLiveStream();
      }
    } catch (err) { showToast('❌ ' + err.message); }
    gateLoginBtn.disabled = false;
    gateLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login / Sign Up';
  });
}

document.addEventListener('click', (e) => {
  if (e.target.id === 'forgotPasswordLink') {
    e.preventDefault();
    const email = gateEmail.value.trim();
    if (!email || !email.includes('@')) { showToast('Pehle email enter karein'); return; }
    resetPassword(email);
  }
});

if (gatePassword) gatePassword.addEventListener('keydown', e => { if (e.key === 'Enter') gateLoginBtn.click(); });
if (gateEmail) gateEmail.addEventListener('keydown', e => { if (e.key === 'Enter') gatePassword.focus(); });

// LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    state.loggedIn = false;
    state.user = null;
    state.email = '';
    state.channel = null;
    state.allVideos = [];
    state.allChannels = [];
    state.notifications = [];
    state.subscriptions = [];
    if (settingsPage) settingsPage.classList.remove('open');
    if (profilePanel) profilePanel.classList.remove('open');
    if (loginGate) loginGate.classList.remove('hide');
    if (feed) feed.querySelectorAll('.video-card').forEach(c => c.remove());
    if (emptyFeed) emptyFeed.style.display = 'flex';
    showToast('👋 Logged out');
  });
}

// ============================================================
// FEED
// ============================================================
async function loadFeedFromSupabase() {
  try {
    const { data: videos, error } = await supabaseClient
      .from('videos').select('*')
      .order('created_at', { ascending: false });
    if (error) return;
    state.allVideos = videos || [];

    const { data: channels } = await supabaseClient.from('channels').select('*');
    state.allChannels = channels || [];

    if (state.user) {
      const { data: subs } = await supabaseClient
        .from('subscriptions').select('channel_id').eq('user_id', state.user.id);
      state.subscriptions = (subs || []).map(s => s.channel_id);

      // Load coins
      const { data: coinData } = await supabaseClient
        .from('user_coins').select('coins').eq('user_id', state.user.id).maybeSingle();
      state.userCoins = coinData ? (coinData.coins || 0) : 0;
    }

    renderFeed('', currentFilter);
  } catch (e) {}
}

function renderFeed(filterText = '', categoryFilter = null) {
  if (!feed) return;
  const cat = categoryFilter || currentFilter;
  feed.querySelectorAll('.video-card').forEach(c => c.remove());

  let sourceVideos = [...state.allVideos];

  if (cat === 'home') sourceVideos = sourceVideos.filter(v => v.type !== 'short' && !v.is_live);
  else if (cat === 'shorts') sourceVideos = sourceVideos.filter(v => v.type === 'short');
  else if (cat === 'live') sourceVideos = sourceVideos.filter(v => v.is_live === true);
  else if (cat === 'subs') {
    if (!state.subscriptions.length) sourceVideos = [];
    else sourceVideos = sourceVideos.filter(v => {
      const ch = state.allChannels.find(c => c.username === v.channel_username);
      return ch && state.subscriptions.includes(ch.id);
    });
  }
  else if (cat === 'gaming') sourceVideos = sourceVideos.filter(v => v.category === 'Gaming');
  else if (cat === 'sports') sourceVideos = sourceVideos.filter(v => v.category === 'Sports');
  else if (cat === 'music') sourceVideos = sourceVideos.filter(v => v.category === 'Music');
  else if (cat === 'news') sourceVideos = sourceVideos.filter(v => v.category === 'News');
  else if (cat === 'trending') sourceVideos = sourceVideos.sort((a, b) => (b.views || 0) - (a.views || 0));
  else if (cat === 'yourvideos') sourceVideos = sourceVideos.filter(v => v.owner_id === state.user?.id);

  if (filterText.trim()) {
    const q = filterText.toLowerCase();
    sourceVideos = sourceVideos.filter(v =>
      (v.title || '').toLowerCase().includes(q) ||
      (v.description && v.description.toLowerCase().includes(q)) ||
      (v.tags && v.tags.some(t => t.toLowerCase().includes(q)))
    );
  }

  const titleMap = {
    home: '<i class="fas fa-home"></i> Home',
    shorts: '<i class="fas fa-bolt"></i> Shorts',
    live: '<i class="fas fa-broadcast-tower"></i> Live Now',
    subs: '<i class="fas fa-users"></i> Subscriptions',
    gaming: '<i class="fas fa-gamepad"></i> Gaming',
    sports: '<i class="fas fa-futbol"></i> Sports',
    yourvideos: '<i class="fas fa-video"></i> Your Videos',
    trending: '<i class="fas fa-fire"></i> Trending',
    music: '<i class="fas fa-music"></i> Music',
    news: '<i class="fas fa-newspaper"></i> News'
  };
  if (feedTitle) feedTitle.innerHTML = titleMap[cat] || titleMap.home;

  if (sourceVideos.length === 0) {
    if (emptyFeed) {
      emptyFeed.style.display = 'flex';
      emptyFeed.innerHTML = `<i class="fas fa-video"></i><h3>No videos yet</h3><p>Tap + to upload your first video!</p>`;
    }
    return;
  }
  if (emptyFeed) emptyFeed.style.display = 'none';

  sourceVideos.forEach((vid, idx) => {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.style.animationDelay = (idx * 0.06) + 's';

    const ch = state.allChannels.find(c => c.username === vid.channel_username) || {};
    const isMine = vid.owner_id === state.user?.id;
    const isLive = vid.is_live === true;

    const chAvatarHTML = ch.avatar_url
      ? `<img src="${ch.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`
      : (ch.avatar_emoji || '👤');
    const thumbHTML = vid.thumbnail_url
      ? `<img src="${vid.thumbnail_url}" style="width:100%;height:100%;object-fit:cover;">`
      : `<i class="fas fa-play-circle" style="font-size:3.8rem;color:#22c55e;"></i>`;
    const menuBtnHTML = isMine && !isLive ? `<button class="my-video-menu-btn" data-mymenu="${vid.id}"><i class="fas fa-ellipsis-v"></i></button>` : '';

    card.innerHTML = `
      <div class="thumbnail-box">
        ${thumbHTML}
        <span class="duration-badge">${vid.duration || '0:00'}</span>
        ${isLive ? '<span class="live-badge">🔴 LIVE</span>' : ''}
        ${vid.type === 'short' ? '<span class="short-badge">⚡ SHORT</span>' : ''}
        ${menuBtnHTML}
      </div>
      <div class="video-details">
        <div class="channel-icon">${chAvatarHTML}</div>
        <div class="video-meta">
          <div class="video-title">${escapeHTML(vid.title)}</div>
          <div class="channel-name"><i class="fas fa-check-circle"></i> ${escapeHTML(ch.name || vid.channel_name || 'Unknown')}</div>
          <div class="video-stats">
            <span><i class="fas fa-eye"></i> ${vid.views || 0} views</span>
            <span><i class="fas fa-thumbs-up"></i> ${vid.likes || 0}</span>
            <span><i class="fas fa-clock"></i> ${timeAgo(vid.created_at)}</span>
          </div>
        </div>
      </div>
    `;

    card.addEventListener('click', (e) => {
      if (e.target.closest('.my-video-menu-btn')) {
        e.stopPropagation();
        openVideoActions(vid);
        return;
      }
      if (isLive) openLiveWatch(vid);
      else if (vid.type === 'short') openShortsFullscreen(vid.id);
      else openWatchPage(vid);
    });

    feed.appendChild(card);
  });
}

// ============================================================
// 🎬 SHORTS FULLSCREEN (9:16 TikTok style)
// ============================================================
async function openShortsFullscreen(startVideoId = null) {
  const shorts = state.allVideos.filter(v => v.type === 'short' && !v.is_live);
  if (shorts.length === 0) { showToast('No shorts yet'); return; }

  shortsScrollContainer.innerHTML = '';
  shortsFullscreen.classList.add('open');

  shorts.forEach((vid, idx) => {
    const ch = state.allChannels.find(c => c.username === vid.channel_username) || {};
    const isMine = vid.owner_id === state.user?.id;
    const isSub = state.subscriptions.includes(ch.id);

    const item = document.createElement('div');
    item.className = 'short-fullscreen-item';
    item.dataset.vid = vid.id;

    const chAvatarHTML = ch.avatar_url
      ? `<img src="${ch.avatar_url}">`
      : (ch.avatar_emoji || '👤');

    item.innerHTML = `
      <video src="${vid.video_url || ''}" loop playsinline preload="metadata"></video>
      <div class="short-overlay"></div>
      <div class="short-actions">
        <button class="short-action-btn like-btn" data-vid="${vid.id}">
          <i class="fas fa-heart"></i>
          <span class="action-count">${vid.likes || 0}</span>
        </button>
        <button class="short-action-btn comment-btn" data-vid="${vid.id}">
          <i class="fas fa-comment"></i>
          <span class="action-count">0</span>
        </button>
        <button class="short-action-btn share-btn" data-vid="${vid.id}">
          <i class="fas fa-share"></i>
          <span class="action-count">Share</span>
        </button>
      </div>
      <div class="short-info">
        <div class="short-channel-row">
          <div class="short-channel-avatar">${chAvatarHTML}</div>
          <div class="short-channel-name">${escapeHTML(ch.name || 'Unknown')}</div>
          ${!isMine ? `<button class="short-subscribe-btn ${isSub ? 'subscribed' : ''}" data-chid="${ch.id}">${isSub ? 'Subscribed' : 'Subscribe'}</button>` : ''}
        </div>
        <div class="short-title" data-vid="${vid.id}">${escapeHTML(vid.title)}</div>
      </div>
    `;

    shortsScrollContainer.appendChild(item);
  });

  // Setup video observation (play/pause on scroll)
  setupShortVideoObserver();

  // Setup like buttons
  shortsScrollContainer.querySelectorAll('.like-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const vid = state.allVideos.find(v => v.id === btn.dataset.vid);
      if (!vid) return;
      const newLikes = (vid.likes || 0) + 1;
      await supabaseClient.from('videos').update({ likes: newLikes }).eq('id', vid.id);
      vid.likes = newLikes;
      btn.querySelector('.action-count').textContent = newLikes;
      btn.classList.add('liked');
      showToast('❤️ Liked');
    });
  });

  // Share
  shortsScrollContainer.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Link copied'));
    });
  });

  // Comment
  shortsScrollContainer.querySelectorAll('.comment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const vid = state.allVideos.find(v => v.id === btn.dataset.vid);
      if (vid) openShortDetail(vid);
    });
  });

  // Title click -> open detail
  shortsScrollContainer.querySelectorAll('.short-title').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const vid = state.allVideos.find(v => v.id === el.dataset.vid);
      if (vid) openShortDetail(vid);
    });
  });

  // Subscribe
  shortsScrollContainer.querySelectorAll('.short-subscribe-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const chId = btn.dataset.chid;
      const ch = state.allChannels.find(c => c.id === chId);
      if (!ch || !state.user) return;
      if (btn.classList.contains('subscribed')) {
        await supabaseClient.from('subscriptions').delete().eq('user_id', state.user.id).eq('channel_id', chId);
        await supabaseClient.from('channels').update({ subscribers_count: Math.max(0, (ch.subscribers_count || 1) - 1) }).eq('id', chId);
        btn.classList.remove('subscribed');
        btn.textContent = 'Subscribe';
        state.subscriptions = state.subscriptions.filter(id => id !== chId);
      } else {
        await supabaseClient.from('subscriptions').insert({ user_id: state.user.id, channel_id: chId });
        await supabaseClient.from('channels').update({ subscribers_count: (ch.subscribers_count || 0) + 1 }).eq('id', chId);
        btn.classList.add('subscribed');
        btn.textContent = 'Subscribed';
        state.subscriptions.push(chId);
      }
    });
  });

  // Scroll to starting video
  if (startVideoId) {
    setTimeout(() => {
      const target = shortsScrollContainer.querySelector(`[data-vid="${startVideoId}"]`);
      if (target) target.scrollIntoView({ behavior: 'auto' });
    }, 100);
  }
}

function setupShortVideoObserver() {
  const videos = shortsScrollContainer.querySelectorAll('video');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.intersectionRatio > 0.6) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, { threshold: [0, 0.6, 1] });
  videos.forEach(v => observer.observe(v));
}

if (shortsCloseBtn) {
  shortsCloseBtn.addEventListener('click', () => {
    shortsScrollContainer.querySelectorAll('video').forEach(v => v.pause());
    shortsFullscreen.classList.remove('open');
  });
}

// SHORT DETAIL (half screen with views, date, likes, comments)
function openShortDetail(vid) {
  const existing = document.getElementById('shortDetailPage');
  if (existing) existing.remove();

  const page = document.createElement('div');
  page.id = 'shortDetailPage';
  page.className = 'short-detail-page open';

  const ch = state.allChannels.find(c => c.username === vid.channel_username) || {};

  page.innerHTML = `
    <div class="short-detail-inner">
      <div class="short-detail-title">${escapeHTML(vid.title)}</div>
      <div class="short-detail-stats">
        <span><i class="fas fa-eye"></i> ${vid.views || 0} views</span>
        <span><i class="fas fa-thumbs-up"></i> ${vid.likes || 0} likes</span>
        <span><i class="fas fa-clock"></i> ${timeAgo(vid.created_at)}</span>
        <span><i class="fas fa-user"></i> ${escapeHTML(ch.name || 'Unknown')}</span>
      </div>
      <div class="short-detail-desc">${escapeHTML(vid.description || 'No description.')}</div>
      <div class="short-detail-comments">
        <div class="comments-title"><i class="fas fa-comments"></i> Comments</div>
        <div class="short-detail-comment-input">
          <input type="text" id="shortCommentInput" placeholder="Add a comment...">
          <button class="comment-send-btn" id="shortCommentSend"><i class="fas fa-paper-plane"></i></button>
        </div>
        <div id="shortCommentsList"><div class="no-comments">Loading...</div></div>
      </div>
    </div>
  `;

  document.body.appendChild(page);

  page.addEventListener('click', (e) => {
    if (e.target === page) page.remove();
  });

  document.getElementById('shortCommentSend')?.addEventListener('click', async () => {
    const inp = document.getElementById('shortCommentInput');
    const text = inp.value.trim();
    if (!text || !state.user) return;
    await supabaseClient.from('comments').insert({
      video_id: vid.id,
      user_id: state.user.id,
      author_name: state.channel?.name || 'User',
      text
    });
    inp.value = '';
    loadShortComments(vid.id);
  });

  loadShortComments(vid.id);
}

async function loadShortComments(videoId) {
  const list = document.getElementById('shortCommentsList');
  if (!list) return;
  const { data } = await supabaseClient.from('comments').select('*')
    .eq('video_id', videoId).order('created_at', { ascending: false });
  if (!data || data.length === 0) {
    list.innerHTML = '<div class="no-comments">No comments yet</div>';
    return;
  }
  list.innerHTML = data.map(c => `
    <div class="comment-item">
      <div class="comment-avatar">${escapeHTML((c.author_name || 'U').charAt(0))}</div>
      <div class="comment-body">
        <div class="comment-author">${escapeHTML(c.author_name || 'User')}</div>
        <div class="comment-text">${escapeHTML(c.text)}</div>
        <div class="comment-time">${timeAgo(c.created_at)}</div>
      </div>
    </div>
  `).join('');
}

// ============================================================
// 🔥 WATCH PAGE - Views + Watch Time
// ============================================================
async function openWatchPage(vid) {
  if (!vid || !watchPage || !watchBody) return;
  if (watchHeaderTitle) watchHeaderTitle.textContent = vid.title;

  let videoUrl = vid.video_url;
  try {
    const cachedBlob = await getVideoFromIDB(vid.id);
    if (cachedBlob) videoUrl = URL.createObjectURL(cachedBlob);
    else if (vid.video_url) {
      try {
        const resp = await fetch(vid.video_url);
        if (resp.ok) {
          const blob = await resp.blob();
          await saveVideoToIDB(vid.id, blob);
          videoUrl = URL.createObjectURL(blob);
        }
      } catch (e) { videoUrl = vid.video_url; }
    }
  } catch (e) {}

  const ch = state.allChannels.find(c => c.username === vid.channel_username) || {};
  const isMine = vid.owner_id === state.user?.id;
  const chId = ch.id;
  const chAvatarHTML = ch.avatar_url
    ? `<img src="${ch.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`
    : (ch.avatar_emoji || '👤');

  let isSubscribed = state.subscriptions.includes(chId);
  let videoHTML = videoUrl
    ? `<video src="${videoUrl}" controls autoplay playsinline preload="metadata" id="watchVideoElement"></video>`
    : `<i class="fas fa-play-circle"></i>`;

  watchBody.innerHTML = `
    <div class="watch-video-area">${videoHTML}</div>
    <div class="watch-info">
      <div class="watch-title">${escapeHTML(vid.title)}</div>
      <div class="watch-meta">
        <span><i class="fas fa-eye"></i> <span id="watchViewCount">${vid.views || 0}</span> views</span>
        <span><i class="fas fa-clock"></i> ${timeAgo(vid.created_at)}</span>
        <span><i class="fas fa-user"></i> ${escapeHTML(ch.name || 'Unknown')}</span>
      </div>
      <div class="watch-channel-row">
        <div class="watch-channel-icon" id="watchChannelIcon" style="cursor:pointer;">${chAvatarHTML}</div>
        <div class="watch-channel-info" id="watchChannelInfo" style="cursor:pointer;">
          <div class="watch-channel-name"><i class="fas fa-check-circle"></i> ${escapeHTML(ch.name || 'Unknown')}</div>
          <div class="watch-channel-subs" id="watchSubsCount">${ch.subscribers_count || 0} subscribers</div>
        </div>
        ${!isMine && chId ? `
          <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" id="subBtn">
            ${isSubscribed ? '<i class="fas fa-check"></i> Subscribed' : '<i class="fas fa-plus"></i> Subscribe'}
          </button>
        ` : ''}
      </div>
      <div class="watch-actions">
        <button class="action-btn" id="likeBtn"><i class="fas fa-thumbs-up"></i> <span id="likeCount">${vid.likes || 0}</span></button>
        <button class="action-btn" id="shareBtn"><i class="fas fa-share"></i> Share</button>
        <button class="action-btn" id="saveBtn"><i class="fas fa-bookmark"></i> Save</button>
      </div>
      <div class="watch-desc">${escapeHTML(vid.description || 'No description.')}</div>
      <div class="comments-section">
        <div class="comments-title"><i class="fas fa-comments"></i> Comments (<span id="commentCount">0</span>)</div>
        <div class="comment-input-row">
          <input type="text" id="commentInput" placeholder="Add a comment...">
          <button class="comment-send-btn" id="commentSendBtn"><i class="fas fa-paper-plane"></i></button>
        </div>
        <div id="commentsList"><div class="no-comments">Loading comments...</div></div>
      </div>
    </div>
  `;

  // View count + watch time
  if (state.user && vid.owner_id !== state.user.id) {
    try {
      const newViews = (vid.views || 0) + 1;
      const { error } = await supabaseClient.from('videos').update({ views: newViews }).eq('id', vid.id);
      if (!error) {
        vid.views = newViews;
        const viewEl = document.getElementById('watchViewCount');
        if (viewEl) viewEl.textContent = newViews;
      }
    } catch (e) {}

    state.currentWatchStartTime = Date.now();
    state.currentWatchingVideoId = vid.id;

    const videoEl = document.getElementById('watchVideoElement');
    if (videoEl) {
      const watchTimeInterval = setInterval(async () => {
        if (!state.currentWatchStartTime || state.currentWatchingVideoId !== vid.id) {
          clearInterval(watchTimeInterval);
          return;
        }
        if (videoEl.paused || videoEl.ended || !watchPage.classList.contains('open')) return;
        await addWatchTime(vid.id, 10);
      }, 10000);
      videoEl.addEventListener('ended', async () => {
        clearInterval(watchTimeInterval);
        await saveWatchTimeNow(vid.id);
      });
    }
  }

  await loadComments(vid.id);

  document.getElementById('watchChannelIcon')?.addEventListener('click', () => {
    watchPage.classList.remove('open');
    openChannelView(vid.channel_username);
  });
  document.getElementById('watchChannelInfo')?.addEventListener('click', () => {
    watchPage.classList.remove('open');
    openChannelView(vid.channel_username);
  });

  document.getElementById('subBtn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (!state.user) { showToast('Login required'); return; }
    btn.disabled = true;
    try {
      if (btn.classList.contains('subscribed')) {
        await supabaseClient.from('subscriptions').delete().eq('user_id', state.user.id).eq('channel_id', chId);
        const newCount = Math.max(0, (ch.subscribers_count || 1) - 1);
        await supabaseClient.from('channels').update({ subscribers_count: newCount }).eq('id', chId);
        btn.classList.remove('subscribed');
        btn.innerHTML = '<i class="fas fa-plus"></i> Subscribe';
        const subsCountEl = document.getElementById('watchSubsCount');
        if (subsCountEl) subsCountEl.textContent = newCount + ' subscribers';
        state.subscriptions = state.subscriptions.filter(id => id !== chId);
        showToast('Unsubscribed');
      } else {
        const { error } = await supabaseClient.from('subscriptions').insert({ user_id: state.user.id, channel_id: chId });
        if (error) throw error;
        const newCount = (ch.subscribers_count || 0) + 1;
        await supabaseClient.from('channels').update({ subscribers_count: newCount }).eq('id', chId);
        btn.classList.add('subscribed');
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed';
        const subsCountEl = document.getElementById('watchSubsCount');
        if (subsCountEl) subsCountEl.textContent = newCount + ' subscribers';
        state.subscriptions.push(chId);
        showToast('✅ Subscribed!');
        if (ch.owner_id && ch.owner_id !== state.user.id) {
          await createNotification(ch.owner_id, `${state.channel?.name || 'Someone'} subscribed!`, 'subscribe');
        }
      }
    } catch (err) { showToast('❌ ' + err.message); }
    btn.disabled = false;
  });

  document.getElementById('likeBtn')?.addEventListener('click', async () => {
    const newLikes = (vid.likes || 0) + 1;
    await supabaseClient.from('videos').update({ likes: newLikes }).eq('id', vid.id);
    document.getElementById('likeCount').textContent = newLikes;
    document.getElementById('likeBtn').classList.add('liked');
    showToast('👍 Liked');
    if (ch.owner_id && ch.owner_id !== state.user?.id) {
      await createNotification(ch.owner_id, `${state.channel?.name || 'Someone'} liked "${vid.title}"`, 'like');
    }
  });

  document.getElementById('shareBtn')?.addEventListener('click', () => {
    navigator.clipboard.writeText(vid.video_url || window.location.href).then(() => showToast('🔗 Link copied'));
  });

  document.getElementById('saveBtn')?.addEventListener('click', () => showToast('📌 Saved'));

  document.getElementById('commentSendBtn')?.addEventListener('click', async () => {
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    if (!text) return;
    if (!state.user) { showToast('Login required'); return; }
    const { error } = await supabaseClient.from('comments').insert({
      video_id: vid.id,
      user_id: state.user.id,
      author_name: state.channel?.name || 'User',
      text
    });
    if (error) { showToast('❌ ' + error.message); return; }
    input.value = '';
    showToast('💬 Comment posted');
    await loadComments(vid.id);
  });

  document.getElementById('commentInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('commentSendBtn')?.click();
  });

  watchPage.classList.add('open');
}

async function addWatchTime(videoId, seconds) {
  try {
    const { data: video } = await supabaseClient.from('videos').select('watch_time_seconds').eq('id', videoId).single();
    if (video) {
      const newWatchTime = (video.watch_time_seconds || 0) + seconds;
      await supabaseClient.from('videos').update({ watch_time_seconds: newWatchTime }).eq('id', videoId);
    }
  } catch (e) {}
}

async function saveWatchTimeNow(videoId) {
  if (!state.currentWatchStartTime) return;
  const elapsed = Math.floor((Date.now() - state.currentWatchStartTime) / 1000);
  if (elapsed > 0) await addWatchTime(videoId, elapsed);
  state.currentWatchStartTime = null;
  state.currentWatchingVideoId = null;
}

async function loadComments(videoId) {
  const list = document.getElementById('commentsList');
  const countEl = document.getElementById('commentCount');
  if (!list) return;
  try {
    const { data, error } = await supabaseClient.from('comments').select('*')
      .eq('video_id', videoId).order('created_at', { ascending: false });
    if (error) { list.innerHTML = '<div class="no-comments">Comments load nahi hui</div>'; return; }
    if (countEl) countEl.textContent = (data || []).length;
    if (!data || data.length === 0) {
      list.innerHTML = '<div class="no-comments">No comments yet. Be the first!</div>';
      return;
    }
    list.innerHTML = data.map(c => `
      <div class="comment-item">
        <div class="comment-avatar">${escapeHTML((c.author_name || 'U').charAt(0))}</div>
        <div class="comment-body">
          <div class="comment-author">${escapeHTML(c.author_name || 'User')}</div>
          <div class="comment-text">${escapeHTML(c.text)}</div>
          <div class="comment-time">${new Date(c.created_at).toLocaleString()}</div>
        </div>
      </div>
    `).join('');
  } catch (e) {
    list.innerHTML = '<div class="no-comments">Error loading comments</div>';
  }
}

if (watchBackBtn) watchBackBtn.addEventListener('click', async () => {
  if (state.currentWatchingVideoId) await saveWatchTimeNow(state.currentWatchingVideoId);
  watchPage.classList.remove('open');
});

// ============================================================
// VIDEO ACTIONS
// ============================================================
function openVideoActions(vid) {
  if (!vid) return;
  currentEditVideoId = vid.id;
  currentEditThumbnailData = null;
  const thumbHTML = vid.thumbnail_url ? `<img src="${vid.thumbnail_url}">` : '';
  const vaThumb = document.getElementById('vaThumb');
  if (vaThumb) vaThumb.innerHTML = thumbHTML;
  const vaTitle = document.getElementById('vaTitle');
  if (vaTitle) vaTitle.textContent = vid.title;
  const vaMeta = document.getElementById('vaMeta');
  if (vaMeta) vaMeta.textContent = `${vid.views || 0} views · ${vid.likes || 0} likes`;
  const vaPrivacySub = document.getElementById('vaPrivacySub');
  const visLabels = { public: 'Public', unlisted: 'Unlisted', private: 'Private' };
  if (vaPrivacySub) vaPrivacySub.textContent = visLabels[vid.visibility || 'public'];
  const menu = document.getElementById('videoActionsMenu');
  const ov = document.getElementById('videoActionsOverlay');
  if (menu) menu.classList.add('open');
  if (ov) ov.classList.add('open');
}

function closeVideoActions() {
  const menu = document.getElementById('videoActionsMenu');
  const ov = document.getElementById('videoActionsOverlay');
  if (menu) menu.classList.remove('open');
  if (ov) ov.classList.remove('open');
}

document.getElementById('videoActionsOverlay')?.addEventListener('click', closeVideoActions);

document.getElementById('vaEditBtn')?.addEventListener('click', () => {
  const vid = state.allVideos.find(v => v.id === currentEditVideoId);
  if (!vid) return;
  closeVideoActions();
  openEditVideoPage(vid);
});

document.getElementById('vaPrivacyBtn')?.addEventListener('click', async () => {
  const vid = state.allVideos.find(v => v.id === currentEditVideoId);
  if (!vid) return;
  const current = vid.visibility || 'public';
  const next = current === 'public' ? 'unlisted' : (current === 'unlisted' ? 'private' : 'public');
  const labels = { public: 'Public', unlisted: 'Unlisted', private: 'Private' };
  const { error } = await supabaseClient.from('videos').update({ visibility: next }).eq('id', vid.id);
  if (error) { showToast('❌ ' + error.message); return; }
  vid.visibility = next;
  const vaPrivacySub = document.getElementById('vaPrivacySub');
  if (vaPrivacySub) vaPrivacySub.textContent = labels[next];
  showToast(`✅ Changed to ${labels[next]}`);
  await loadFeedFromSupabase();
});

document.getElementById('vaDeleteBtn')?.addEventListener('click', async () => {
  const vid = state.allVideos.find(v => v.id === currentEditVideoId);
  if (!vid) return;
  if (!confirm(`Delete "${vid.title}"?\n\nThis cannot be undone.`)) return;
  try {
    try {
      if (vid.video_url) {
        const parts = vid.video_url.split('/videos/');
        if (parts[1]) await supabaseClient.storage.from('videos').remove([decodeURIComponent(parts[1])]);
      }
      if (vid.thumbnail_url) {
        const parts = vid.thumbnail_url.split('/thumbnails/');
        if (parts[1]) await supabaseClient.storage.from('thumbnails').remove([decodeURIComponent(parts[1])]);
      }
    } catch (e) {}
    await supabaseClient.from('videos').delete().eq('id', vid.id);
    await deleteVideoFromIDB(vid.id);
    showToast('🗑 Video deleted');
    closeVideoActions();
    await loadFeedFromSupabase();
  } catch (err) { showToast('❌ ' + err.message); }
});

// ============================================================
// EDIT VIDEO
// ============================================================
function openEditVideoPage(vid) {
  currentEditVideoId = vid.id;
  currentEditThumbnailData = null;
  const t = document.getElementById('editVideoTitle');
  const d = document.getElementById('editVideoDesc');
  const c = document.getElementById('editVideoCategory');
  if (t) t.value = vid.title || '';
  if (d) d.value = vid.description || '';
  if (c) c.value = vid.category || 'Gaming';
  const thumb = document.getElementById('editVideoThumb');
  const thumbHTML = vid.thumbnail_url
    ? `<img src="${vid.thumbnail_url}" style="width:100%;height:100%;object-fit:cover;"><div class="thumb-overlay" style="opacity:0.7;"><i class="fas fa-camera-retro"></i><span>Tap to change</span></div>`
    : `<div class="thumb-overlay"><i class="fas fa-camera-retro"></i><span>Tap to add</span></div>`;
  if (thumb) thumb.innerHTML = thumbHTML;
  document.querySelectorAll('#editVideoPage .visibility-option').forEach(v => {
    v.classList.toggle('active', v.dataset.vis === (vid.visibility || 'public'));
  });
  document.getElementById('editVideoPage')?.classList.add('open');
}

document.getElementById('editVideoBackBtn')?.addEventListener('click', () => document.getElementById('editVideoPage').classList.remove('open'));
document.getElementById('editVideoCancelBtn')?.addEventListener('click', () => document.getElementById('editVideoPage').classList.remove('open'));

document.getElementById('editVideoThumb')?.addEventListener('click', () => {
  const inp = document.getElementById('editVideoThumbInput');
  if (inp) { inp.value = ''; inp.click(); }
});

document.getElementById('editVideoThumbInput')?.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    currentEditThumbnailData = ev.target.result;
    const thumb = document.getElementById('editVideoThumb');
    if (thumb) thumb.innerHTML = `<img src="${currentEditThumbnailData}" style="width:100%;height:100%;object-fit:cover;"><div class="thumb-overlay" style="opacity:0.7;"><i class="fas fa-check-circle"></i><span>Tap to change</span></div>`;
    showToast('🖼 New thumbnail ready');
  };
  reader.readAsDataURL(file);
});

document.querySelectorAll('#editVideoPage .visibility-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#editVideoPage .visibility-option').forEach(v => v.classList.remove('active'));
    opt.classList.add('active');
  });
});

document.getElementById('editVideoSaveBtn')?.addEventListener('click', async () => {
  if (!currentEditVideoId) return;
  const vid = state.allVideos.find(v => v.id === currentEditVideoId);
  if (!vid) return;
  const newTitle = document.getElementById('editVideoTitle').value.trim();
  if (!newTitle) { showToast('Title required'); return; }
  const btn = document.getElementById('editVideoSaveBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
  try {
    let newThumbnailUrl = vid.thumbnail_url;
    if (currentEditThumbnailData) {
      const thumbResp = await fetch(currentEditThumbnailData);
      const thumbBlob = await thumbResp.blob();
      const thumbPath = `${state.user.id}/${currentEditVideoId}_thumb_${Date.now()}.jpg`;
      const { error: thumbErr } = await supabaseClient.storage.from('thumbnails').upload(thumbPath, thumbBlob, { contentType: 'image/jpeg', upsert: false });
      if (!thumbErr) newThumbnailUrl = supabaseClient.storage.from('thumbnails').getPublicUrl(thumbPath).data.publicUrl;
    }
    const newVis = document.querySelector('#editVideoPage .visibility-option.active')?.dataset.vis || 'public';
    const { error } = await supabaseClient.from('videos').update({
      title: newTitle,
      description: document.getElementById('editVideoDesc').value.trim(),
      category: document.getElementById('editVideoCategory').value,
      visibility: newVis,
      thumbnail_url: newThumbnailUrl
    }).eq('id', currentEditVideoId);
    if (error) throw error;
    showToast('✅ Video updated!');
    document.getElementById('editVideoPage').classList.remove('open');
    await loadFeedFromSupabase();
  } catch (err) { showToast('❌ ' + err.message); }
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
});
// ============================================================
// TERMS + SUPPORT
// ============================================================
if (termsBtn) termsBtn.addEventListener('click', () => termsPage.classList.add('open'));
if (termsBackBtn) termsBackBtn.addEventListener('click', () => termsPage.classList.remove('open'));

if (contactBtn) {
  contactBtn.addEventListener('click', () => {
    supportPage.classList.add('open');
    if (supportInput) supportInput.focus();
  });
}
if (supportBackBtn) supportBackBtn.addEventListener('click', () => supportPage.classList.remove('open'));

const BOT_RESPONSES = {
  'upload': '📹 To upload:\n1. Tap + button\n2. Choose Upload / Created / Live\n3. Record or pick from gallery\n4. Fill details\n5. Publish',
  'go live': '🔴 To go live:\n1. You need 50+ subs\n2. Tap + → Live\n3. Fill title, tags\n4. Tap "Start Live"',
  'monetization': '💰 Revenue:\n• $1 per 500 subs\n• $0.50 per 1000 watch hours\n\nMin withdrawal: $10',
  'video not playing': '🎬 Fix:\n1. Check internet\n2. Refresh page\n3. Clear cache in Settings',
  'hello': 'Hi! 👋 How can I help?',
  'hi': 'Hello! 👋',
  'thanks': 'You\'re welcome! 😊',
  'help': 'I can help with:\n• Uploading\n• Going Live\n• Monetization\n• Account',
  'email': '📧 syedtechnical63@gmail.com'
};

function getBotResponse(userMsg) {
  const msg = userMsg.toLowerCase();
  for (const key of Object.keys(BOT_RESPONSES)) {
    if (msg.includes(key)) return BOT_RESPONSES[key];
  }
  return `Thanks! Our team will reply soon.`;
}

function addSupportMessage(text, isUser = false) {
  if (!supportBody) return;
  const msgDiv = document.createElement('div');
  msgDiv.className = 'support-message ' + (isUser ? 'user' : 'bot');
  const now = new Date();
  const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
  const avatarHTML = isUser ? `<div class="support-avatar"><i class="fas fa-user"></i></div>` : `<div class="support-avatar"><i class="fas fa-robot"></i></div>`;
  const formattedText = escapeHTML(text).replace(/\n/g, '<br>').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  msgDiv.innerHTML = `${avatarHTML}<div class="support-bubble"><div class="support-text">${formattedText}</div><div class="support-time">${timeStr}</div></div>`;
  supportBody.appendChild(msgDiv);
  supportBody.scrollTop = supportBody.scrollHeight;
}

async function sendSupportMessage() {
  if (!supportInput) return;
  const text = supportInput.value.trim();
  if (!text) return;
  supportInput.value = '';
  addSupportMessage(text, true);
  const typingDiv = document.createElement('div');
  typingDiv.className = 'support-message bot';
  typingDiv.innerHTML = `<div class="support-avatar"><i class="fas fa-robot"></i></div><div class="support-bubble"><div class="support-text">Typing...</div></div>`;
  supportBody.appendChild(typingDiv);
  supportBody.scrollTop = supportBody.scrollHeight;
  setTimeout(() => {
    typingDiv.remove();
    addSupportMessage(getBotResponse(text), false);
  }, 800);
}

if (supportSendBtn) supportSendBtn.addEventListener('click', sendSupportMessage);
if (supportInput) supportInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendSupportMessage(); });
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.quick-btn');
  if (btn && btn.dataset.msg) {
    if (supportInput) supportInput.value = btn.dataset.msg;
    sendSupportMessage();
  }
});

// ============================================================
// SUBSCRIPTIONS
// ============================================================
async function openSubscriptions() {
  if (!state.user) { showToast('Login first'); return; }
  if (subscriptionsPage) subscriptionsPage.classList.add('open');
  await renderSubscriptions();
}

async function renderSubscriptions() {
  if (!subscriptionsBody) return;
  if (!state.subscriptions.length) {
    subscriptionsBody.innerHTML = '<div class="no-subs">You haven\'t subscribed to any channel yet.</div>';
    return;
  }
  subscriptionsBody.innerHTML = '<div style="text-align:center;padding:20px;color:#64748b;">Loading...</div>';
  const subsChannels = state.allChannels.filter(c => state.subscriptions.includes(c.id));
  const subsVideos = state.allVideos.filter(v => {
    const ch = state.allChannels.find(c => c.username === v.channel_username);
    return ch && state.subscriptions.includes(ch.id);
  });
  let html = '<div class="subs-channels-row">';
  subsChannels.forEach(ch => {
    const avatarHTML = ch.avatar_url ? `<img src="${ch.avatar_url}" style="width:100%;height:100%;object-fit:cover;">` : (ch.avatar_emoji || '🎬');
    html += `<div class="subs-channel-chip" data-username="${escapeHTML(ch.username)}"><div class="subs-channel-avatar">${avatarHTML}</div><div class="subs-channel-name">${escapeHTML(ch.name)}</div></div>`;
  });
  html += '</div>';
  html += '<div class="profile-section-title" style="margin:20px 4px 10px;"><i class="fas fa-video"></i> Latest videos</div>';
  if (subsVideos.length === 0) {
    html += '<div class="no-subs">No videos from subscribed channels yet.</div>';
  } else {
    subsVideos.forEach(vid => {
      const ch = state.allChannels.find(c => c.username === vid.channel_username) || {};
      const thumbHTML = vid.thumbnail_url ? `<img src="${vid.thumbnail_url}" style="width:100%;height:100%;object-fit:cover;">` : `<i class="fas fa-play-circle" style="font-size:3.8rem;color:#22c55e;"></i>`;
      const chAvatarHTML = ch.avatar_url ? `<img src="${ch.avatar_url}" style="width:100%;height:100%;object-fit:cover;">` : (ch.avatar_emoji || '👤');
      html += `<div class="video-card" data-vid="${vid.id}" style="margin:0 0 14px;"><div class="thumbnail-box">${thumbHTML}<span class="duration-badge">${vid.duration || '0:00'}</span>${vid.is_live ? '<span class="live-badge">🔴 LIVE</span>' : ''}</div><div class="video-details"><div class="channel-icon">${chAvatarHTML}</div><div class="video-meta"><div class="video-title">${escapeHTML(vid.title)}</div><div class="channel-name">${escapeHTML(ch.name || '')}</div><div class="video-stats"><span><i class="fas fa-eye"></i> ${vid.views || 0}</span></div></div></div></div>`;
    });
  }
  subscriptionsBody.innerHTML = html;
  subscriptionsBody.querySelectorAll('.subs-channel-chip').forEach(el => {
    el.addEventListener('click', () => {
      subscriptionsPage.classList.remove('open');
      openChannelView(el.dataset.username);
    });
  });
  subscriptionsBody.querySelectorAll('[data-vid]').forEach(el => {
    el.addEventListener('click', () => {
      const vid = state.allVideos.find(v => v.id === el.dataset.vid);
      if (vid) {
        subscriptionsPage.classList.remove('open');
        if (vid.is_live) openLiveWatch(vid);
        else if (vid.type === 'short') openShortsFullscreen(vid.id);
        else openWatchPage(vid);
      }
    });
  });
}

if (subsBackBtn) subsBackBtn.addEventListener('click', () => subscriptionsPage.classList.remove('open'));

// ============================================================
// PLUS MENU (Live / Upload / Created)
// ============================================================
function openPlusMenu() {
  if (!state.loggedIn) { showToast('Please login first'); return; }
  if (plusMenu) plusMenu.classList.add('open');
  if (plusMenuOverlay) plusMenuOverlay.classList.add('open');
}
function closePlusMenu() {
  if (plusMenu) plusMenu.classList.remove('open');
  if (plusMenuOverlay) plusMenuOverlay.classList.remove('open');
}

if (navPlus) navPlus.addEventListener('click', openPlusMenu);
if (plusMenuOverlay) plusMenuOverlay.addEventListener('click', closePlusMenu);

// LIVE option
if (plusLiveBtn) {
  plusLiveBtn.addEventListener('click', () => {
    closePlusMenu();
    setTimeout(() => openLiveSetup(), 300);
  });
}

// UPLOAD option
if (plusUploadBtn) {
  plusUploadBtn.addEventListener('click', () => {
    closePlusMenu();
    if (!state.channel) { showToast('Create channel first'); openChannelSetup(); return; }
    currentUploadType = 'long';
    const inp = document.getElementById('nativeGalleryInput');
    if (inp) { inp.value = ''; inp.click(); }
  });
}

// CREATED option (camera record)
if (plusCreatedBtn) {
  plusCreatedBtn.addEventListener('click', () => {
    closePlusMenu();
    if (!state.channel) { showToast('Create channel first'); openChannelSetup(); return; }
    currentUploadType = 'short';
    setTimeout(() => openCameraPanel(), 300);
  });
}

// ============================================================
// LIVE STREAMING
// ============================================================
async function openLiveSetup() {
  if (!state.channel) { showToast('Create channel first'); openChannelSetup(); return; }
  const isAdmin = isUserAdmin();
  if (!isAdmin) {
    const subs = state.channel.subscribers_count || 0;
    if (subs < 50) {
      showAlert('Live Streaming Locked', `You need at least <strong>50 subscribers</strong> to start live streaming.<br><br>You currently have <strong>${subs}</strong> subscriber(s).`, 'fa-broadcast-tower');
      return;
    }
  }
  if (state.activeLiveStream) {
    showAlert('Already Live', 'You already have an active live stream.', 'fa-broadcast-tower');
    return;
  }

  const lt = document.getElementById('liveTitle');
  const ld = document.getElementById('liveDescription');
  const lc = document.getElementById('liveCategory');
  if (lt) lt.value = '';
  if (ld) ld.value = '';
  if (lc) lc.value = 'Entertainment';
  liveTags = [];
  liveVisibility = 'public';
  renderLiveTags();
  document.querySelectorAll('#liveSetupModal .visibility-option').forEach(v => v.classList.remove('active'));
  document.querySelector('#liveSetupModal .visibility-option[data-livevis="public"]')?.classList.add('active');

  document.getElementById('liveSetupModal').classList.add('open');

  try {
    previewStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 1280 }, aspectRatio: 9/16 },
      audio: true
    });
    const pv = document.getElementById('livePreviewVideo');
    if (pv) { pv.srcObject = previewStream; pv.play().catch(() => {}); }
  } catch (e) {
    showToast('❌ Camera access needed');
    document.getElementById('liveSetupModal').classList.remove('open');
  }
}

function closeLiveSetup() {
  if (previewStream) {
    previewStream.getTracks().forEach(t => t.stop());
    previewStream = null;
  }
  const pv = document.getElementById('livePreviewVideo');
  if (pv) pv.srcObject = null;
  document.getElementById('liveSetupModal').classList.remove('open');
}

function renderLiveTags() {
  const c = document.getElementById('liveTagsContainer');
  if (!c) return;
  c.innerHTML = liveTags.map((t, i) => `<span class="tag-chip">#${escapeHTML(t)}<i class="fas fa-times" data-idx="${i}"></i></span>`).join('');
  c.querySelectorAll('.tag-chip i').forEach(el => {
    el.addEventListener('click', () => { liveTags.splice(parseInt(el.dataset.idx), 1); renderLiveTags(); });
  });
}

async function startLiveStream() {
  const title = document.getElementById('liveTitle').value.trim();
  if (!title) { showToast('Live title enter karein'); return; }
  if (!previewStream) { showToast('Camera not ready'); return; }

  const btn = document.getElementById('liveStartBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';

  try {
    const channelName = generateLiveChannelName();
    const videoId = 'live_' + Date.now();

    const { data: liveData, error: liveError } = await supabaseClient
      .from('live_streams').insert({
        id: videoId,
        owner_id: state.user.id,
        channel_id: state.channel.id,
        channel_username: state.channel.username,
        channel_name: state.channel.name,
        title,
        description: document.getElementById('liveDescription').value.trim(),
        category: document.getElementById('liveCategory').value,
        tags: liveTags,
        visibility: liveVisibility,
        agora_channel: channelName,
        is_active: true,
        viewers_count: 0,
        views: 0,
        likes: 0,
        started_at: new Date().toISOString()
      }).select().single();
    if (liveError) throw liveError;

    await supabaseClient.from('videos').insert({
      id: videoId,
      owner_id: state.user.id,
      channel_id: state.channel.id,
      channel_username: state.channel.username,
      channel_name: state.channel.name,
      title,
      description: document.getElementById('liveDescription').value.trim(),
      duration: 'LIVE',
      category: document.getElementById('liveCategory').value,
      tags: liveTags,
      visibility: liveVisibility,
      video_url: '',
      thumbnail_url: state.channel.avatar_url || '',
      views: 0, likes: 0, watch_time_seconds: 0,
      type: 'live', is_live: true
    });

    state.activeLiveStream = liveData;
    state.liveStartTime = Date.now();

    const savedStream = previewStream;
    closeLiveSetup();
    document.getElementById('liveStreamPage').classList.add('open');
    document.getElementById('liveStreamTitle').textContent = title;
    document.getElementById('liveStreamChannel').textContent = state.channel.name;

    await setupAgoraBroadcaster(channelName, savedStream);

    state.liveDurationInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.liveStartTime) / 1000);
      document.getElementById('liveStreamDuration').textContent = formatDuration(elapsed);
    }, 1000);

    showToast('🔴 You are LIVE!');
    await loadFeedFromSupabase();
  } catch (err) {
    console.error('Start live error:', err);
    showToast('❌ ' + err.message);
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Start Live';
    return;
  }
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-broadcast-tower"></i> Start Live';
}

async function setupAgoraBroadcaster(channelName, stream) {
  try {
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    state.agoraClient = client;
    await client.setClientRole('host');
    await client.join(AGORA_APP_ID, channelName, null, null);
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    state.agoraTracks = [audioTrack, videoTrack];
    videoTrack.play(document.getElementById('liveBroadcastContainer'));
    await client.publish([audioTrack, videoTrack]);
    client.on('user-joined', () => updateLiveViewerCount());
    client.on('user-left', () => updateLiveViewerCount());
  } catch (err) {
    console.error('Agora error:', err);
    // Fallback to local video
    const container = document.getElementById('liveBroadcastContainer');
    container.innerHTML = '';
    const localVideo = document.createElement('video');
    localVideo.srcObject = stream;
    localVideo.autoplay = true;
    localVideo.muted = true;
    localVideo.playsInline = true;
    localVideo.style.cssText = 'width:100%;height:100%;object-fit:cover;';
    container.appendChild(localVideo);
  }
}

async function updateLiveViewerCount() {
  if (!state.activeLiveStream) return;
  try {
    const { data } = await supabaseClient.from('live_viewers').select('id')
      .eq('live_id', state.activeLiveStream.id).eq('is_watching', true);
    const count = data ? data.length : 0;
    document.getElementById('liveViewerCount').innerHTML = `<i class="fas fa-eye"></i> ${count} viewers`;
    await supabaseClient.from('live_streams').update({ viewers_count: count }).eq('id', state.activeLiveStream.id);
  } catch (e) {}
}

async function endLiveStream() {
  if (!confirm('End live stream?')) return;
  try {
    if (state.activeLiveStream) {
      const elapsed = Math.floor((Date.now() - state.liveStartTime) / 1000);
      await supabaseClient.from('live_streams').update({
        is_active: false, ended_at: new Date().toISOString(), duration_seconds: elapsed
      }).eq('id', state.activeLiveStream.id);
      await supabaseClient.from('videos').update({
        is_live: false, duration: formatDuration(elapsed), watch_time_seconds: elapsed
      }).eq('id', state.activeLiveStream.id);
    }
    if (state.agoraClient) {
      await state.agoraClient.leave();
      state.agoraClient = null;
    }
    state.agoraTracks.forEach(track => { try { track.stop(); track.close(); } catch (e) {} });
    state.agoraTracks = [];
    if (state.liveDurationInterval) {
      clearInterval(state.liveDurationInterval);
      state.liveDurationInterval = null;
    }
    state.activeLiveStream = null;
    state.liveStartTime = null;
    document.getElementById('liveStreamPage').classList.remove('open');
    showToast('✅ Live ended');
    await loadFeedFromSupabase();
  } catch (err) { showToast('❌ ' + err.message); }
}

// ============================================================
// LIVE WATCH (9:16 + Double tap like + Gifts)
// ============================================================
async function openLiveWatch(vid) {
  if (!vid || !vid.is_live) { showToast('Stream ended'); return; }

  const { data: liveData } = await supabaseClient.from('live_streams').select('*')
    .eq('id', vid.id).eq('is_active', true).maybeSingle();
  if (!liveData) {
    showToast('Stream ended');
    await loadFeedFromSupabase();
    return;
  }

  state.currentWatchingLive = liveData;

  const ch = state.allChannels.find(c => c.username === liveData.channel_username) || {};
  const isMine = liveData.owner_id === state.user?.id;

  document.getElementById('liveWatchHostName').textContent = liveData.channel_name;
  document.getElementById('liveWatchTitle').textContent = liveData.title;
  document.getElementById('liveLikeCount').textContent = liveData.likes || 0;

  await joinAgoraAsViewer(liveData.agora_channel);

  if (state.user && !isMine) {
    await supabaseClient.from('live_viewers').upsert({
      live_id: liveData.id,
      user_id: state.user.id,
      is_watching: true,
      joined_at: new Date().toISOString()
    }, { onConflict: 'live_id,user_id' });
    await supabaseClient.from('live_streams').update({ views: (liveData.views || 0) + 1 }).eq('id', liveData.id);
  }

  const startTime = new Date(liveData.started_at).getTime();
  const iv = setInterval(async () => {
    if (!state.currentWatchingLive) { clearInterval(iv); return; }
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const viewers = await supabaseClient.from('live_viewers').select('id')
      .eq('live_id', liveData.id).eq('is_watching', true);
    document.getElementById('liveWatchViewers').innerHTML = `<i class="fas fa-eye"></i> ${viewers?.data?.length || 0}`;
  }, 3000);

  document.getElementById('liveWatchPage').classList.add('open');
}

async function joinAgoraAsViewer(channelName) {
  try {
    const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
    state.agoraClient = client;

    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      if (mediaType === 'video') {
        const c = document.getElementById('liveWatchContainer');
        c.innerHTML = '';
        user.videoTrack.play(c);
      }
      if (mediaType === 'audio') user.audioTrack.play();
    });
    client.on('user-unpublished', () => {
      const c = document.getElementById('liveWatchContainer');
      if (c) c.innerHTML = '<div style="color:white;text-align:center;padding:20px;">Stream ended</div>';
    });

    await client.setClientRole('audience');
    await client.join(AGORA_APP_ID, channelName, null, null);
  } catch (err) {
    const c = document.getElementById('liveWatchContainer');
    if (c) c.innerHTML = '<div style="color:white;text-align:center;padding:20px;">Unable to connect.</div>';
  }
}

async function closeLiveWatch() {
  try {
    if (state.agoraClient) { await state.agoraClient.leave(); state.agoraClient = null; }
  } catch (e) {}
  if (state.currentWatchingLive && state.user) {
    try {
      await supabaseClient.from('live_viewers').update({ is_watching: false })
        .eq('live_id', state.currentWatchingLive.id).eq('user_id', state.user.id);
    } catch (e) {}
  }
  state.currentWatchingLive = null;
  const c = document.getElementById('liveWatchContainer');
  if (c) c.innerHTML = '';
  document.getElementById('liveWatchPage').classList.remove('open');
}

// LIVE - double tap like
let lastTap = 0;
const liveVideoArea = document.getElementById('liveWatchVideoArea');
if (liveVideoArea) {
  liveVideoArea.addEventListener('click', async (e) => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap
      if (!state.currentWatchingLive) return;
      const newLikes = (state.currentWatchingLive.likes || 0) + 1;
      state.currentWatchingLive.likes = newLikes;
      document.getElementById('liveLikeCount').textContent = newLikes;
      await supabaseClient.from('live_streams').update({ likes: newLikes }).eq('id', state.currentWatchingLive.id);
      await supabaseClient.from('videos').update({ likes: newLikes }).eq('id', state.currentWatchingLive.id);
      // Heart animation
      const h = document.getElementById('liveLikeHeart');
      if (h) {
        h.classList.remove('show');
        void h.offsetWidth;
        h.classList.add('show');
      }
      const lc = document.getElementById('liveLikeCounter');
      if (lc) lc.innerHTML = `<i class="fas fa-heart"></i> ${newLikes}`;
    }
    lastTap = now;
  });
}

// LIVE - buttons
document.getElementById('liveWatchBackBtn')?.addEventListener('click', closeLiveWatch);

document.getElementById('liveLikeBtn')?.addEventListener('click', async () => {
  if (!state.currentWatchingLive) return;
  const newLikes = (state.currentWatchingLive.likes || 0) + 1;
  state.currentWatchingLive.likes = newLikes;
  document.getElementById('liveLikeCount').textContent = newLikes;
  await supabaseClient.from('live_streams').update({ likes: newLikes }).eq('id', state.currentWatchingLive.id);
  await supabaseClient.from('videos').update({ likes: newLikes }).eq('id', state.currentWatchingLive.id);
});

document.getElementById('liveShareBtn')?.addEventListener('click', () => {
  navigator.clipboard.writeText(window.location.href).then(() => showToast('🔗 Link copied'));
});

// Live tags
document.getElementById('liveAddTagBtn')?.addEventListener('click', () => {
  const inp = document.getElementById('liveTagInput');
  const val = inp.value.trim().replace(/^#/, '').replace(/,/g, '');
  if (!val || liveTags.includes(val) || liveTags.length >= 10) return;
  liveTags.push(val);
  inp.value = '';
  renderLiveTags();
});
document.getElementById('liveTagInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); document.getElementById('liveAddTagBtn').click(); }
});

document.querySelectorAll('#liveSetupModal .visibility-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#liveSetupModal .visibility-option').forEach(v => v.classList.remove('active'));
    opt.classList.add('active');
    liveVisibility = opt.dataset.livevis;
  });
});

document.getElementById('liveSetupBackBtn')?.addEventListener('click', closeLiveSetup);
document.getElementById('liveSetupCancelBtn')?.addEventListener('click', closeLiveSetup);
document.getElementById('liveStartBtn')?.addEventListener('click', startLiveStream);
document.getElementById('liveEndBtn')?.addEventListener('click', endLiveStream);

// ============================================================
// GIFT SYSTEM
// ============================================================
function renderGiftGrid() {
  if (!giftGrid) return;
  giftGrid.innerHTML = GIFTS.map(g => `
    <div class="gift-item" data-giftid="${g.id}">
      <div class="gift-item-emoji">${g.emoji}</div>
      <div class="gift-item-name">${g.name}</div>
      <div class="gift-item-coins">${g.coins} 🪙</div>
    </div>
  `).join('');

  giftGrid.querySelectorAll('.gift-item').forEach(el => {
    el.addEventListener('click', async () => {
      const gift = GIFTS.find(g => g.id === el.dataset.giftid);
      if (!gift) return;
      if (state.userCoins < gift.coins) {
        showToast('❌ Not enough coins. Please recharge.');
        return;
      }
      if (!state.currentWatchingLive) return;

      // Deduct coins
      state.userCoins -= gift.coins;
      const balEl = document.getElementById('giftCoinsBalance');
      if (balEl) balEl.textContent = state.userCoins;

      await supabaseClient.from('user_coins').upsert({
        user_id: state.user.id,
        coins: state.userCoins,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

      // Record gift
      await supabaseClient.from('gifts').insert({
        sender_id: state.user.id,
        sender_name: state.channel?.name || 'User',
        receiver_channel_id: state.currentWatchingLive.channel_id,
        live_id: state.currentWatchingLive.id,
        gift_id: gift.id,
        gift_name: gift.name,
        gift_emoji: gift.emoji,
        coins: gift.coins
      });

      // Animate
      const anim = document.getElementById('liveGiftAnimation');
      if (anim) {
        const fly = document.createElement('div');
        fly.className = 'gift-fly';
        fly.textContent = gift.emoji;
        fly.style.left = (Math.random() * 60 + 20) + '%';
        fly.style.bottom = '100px';
        anim.appendChild(fly);
        setTimeout(() => fly.remove(), 2000);
      }
      showToast(`🎁 Sent ${gift.name}!`);
      document.getElementById('giftPanel').classList.remove('open');
    });
  });
}

if (liveGiftBtn) {
  liveGiftBtn.addEventListener('click', () => {
    if (!state.loggedIn) { showToast('Login first'); return; }
    const balEl = document.getElementById('giftCoinsBalance');
    if (balEl) balEl.textContent = state.userCoins;
    renderGiftGrid();
    document.getElementById('giftPanel').classList.add('open');
  });
}

document.getElementById('giftCloseBtn')?.addEventListener('click', () => {
  document.getElementById('giftPanel').classList.remove('open');
});

document.getElementById('giftRechargeBtn')?.addEventListener('click', () => {
  document.getElementById('giftPanel').classList.remove('open');
  document.getElementById('rechargePage').classList.add('open');
  renderCoinPackages();
});

// ============================================================
// RECHARGE
// ============================================================
function renderCoinPackages() {
  if (!coinPackages) return;
  const packages = [10, 50, 100, 250, 500, 1000, 2500, 5000, 10000, 25000, 50000];
  coinPackages.innerHTML = packages.map(p => `
    <div class="coin-package" data-coins="${p}">
      <div class="coin-package-coins">${p} 🪙</div>
      <div class="coin-package-price">Rs ${p * COIN_TO_RUPEE}</div>
    </div>
  `).join('');

  coinPackages.querySelectorAll('.coin-package').forEach(el => {
    el.addEventListener('click', () => {
      coinPackages.querySelectorAll('.coin-package').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      const inp = document.getElementById('customCoinAmount');
      if (inp) inp.value = el.dataset.coins;
    });
  });
}

document.getElementById('rechargeBackBtn')?.addEventListener('click', () => {
  document.getElementById('rechargePage').classList.remove('open');
});

document.getElementById('copyAccountBtn')?.addEventListener('click', () => {
  navigator.clipboard.writeText(RECHARGE_ACCOUNT).then(() => showToast('📋 Account number copied'));
});

document.getElementById('submitRechargeBtn')?.addEventListener('click', async () => {
  const amount = parseInt(document.getElementById('customCoinAmount').value);
  const txnId = document.getElementById('rechargeTxnId').value.trim();
  if (!amount || amount < MIN_COINS || amount > MAX_COINS) {
    showToast(`Coins ${MIN_COINS} - ${MAX_COINS} ke beech hone chahiye`);
    return;
  }
  if (!txnId) { showToast('Transaction ID enter karein'); return; }

  const btn = document.getElementById('submitRechargeBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

  try {
    await supabaseClient.from('recharge_requests').insert({
      user_id: state.user.id,
      user_email: state.email,
      amount_coins: amount,
      amount_rupees: amount * COIN_TO_RUPEE,
      transaction_id: txnId,
      account_number: RECHARGE_ACCOUNT,
      account_holder: RECHARGE_HOLDER,
      status: 'pending',
      created_at: new Date().toISOString()
    });

    const st = document.getElementById('rechargeStatus');
    st.style.display = 'block';
    st.style.background = 'rgba(34,197,94,0.15)';
    st.style.color = '#22c55e';
    st.textContent = '✅ Request submitted! Admin will verify soon.';
    showToast('✅ Recharge request sent');
    document.getElementById('customCoinAmount').value = '';
    document.getElementById('rechargeTxnId').value = '';
  } catch (err) {
    showToast('❌ ' + err.message);
  }

  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Recharge Request';
});

// ============================================================
// CAMERA
// ============================================================
let cameraStream = null;
let facingMode = 'user';
let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;
let recordTimerInterval = null;
let recordSeconds = 0;

async function openCameraPanel() {
  if (!state.loggedIn) { showToast('Please login first'); return; }
  if (!state.channel) { showToast('Create channel first'); openChannelSetup(); return; }

  if (currentUploadType === 'short') {
    shortVideoBtn.classList.add('active');
    longVideoBtn.classList.remove('active');
  } else {
    longVideoBtn.classList.add('active');
    shortVideoBtn.classList.remove('active');
  }

  cameraPanel.classList.add('open');
  cameraPlaceholder.style.display = 'flex';

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: true
    });
    cameraVideo.srcObject = cameraStream;
    cameraVideo.classList.toggle('no-mirror', facingMode === 'environment');
    cameraPlaceholder.style.display = 'none';
    showToast('📷 Camera ready');
  } catch (err) {
    cameraPlaceholder.innerHTML = `<i class="fas fa-exclamation-triangle"></i><div>Camera unavailable. Use gallery.</div>`;
    showToast('📷 Use gallery instead');
  }
}

function closeCameraPanel() {
  stopRecording();
  if (cameraStream) { cameraStream.getTracks().forEach(t => t.stop()); cameraStream = null; }
  cameraVideo.srcObject = null;
  cameraPanel.classList.remove('open');
}

if (camClose) camClose.addEventListener('click', closeCameraPanel);

if (camFlip) {
  camFlip.addEventListener('click', async () => {
    facingMode = facingMode === 'user' ? 'environment' : 'user';
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 720 }, height: { ideal: 1280 } }, audio: true
      });
      cameraVideo.srcObject = cameraStream;
      cameraVideo.classList.toggle('no-mirror', facingMode === 'environment');
    } catch (e) { showToast('Flip failed'); }
  });
}

if (longVideoBtn) longVideoBtn.addEventListener('click', () => {
  currentUploadType = 'long';
  longVideoBtn.classList.add('active');
  shortVideoBtn.classList.remove('active');
});
if (shortVideoBtn) shortVideoBtn.addEventListener('click', () => {
  currentUploadType = 'short';
  shortVideoBtn.classList.add('active');
  longVideoBtn.classList.remove('active');
});

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
  isRecording = false;
  if (recordBtn) recordBtn.classList.remove('recording');
  if (recordTimer) recordTimer.classList.remove('show');
  if (recordTimerInterval) { clearInterval(recordTimerInterval); recordTimerInterval = null; }
}

if (recordBtn) {
  recordBtn.addEventListener('click', () => {
    if (!cameraStream) { showToast('Camera unavailable'); return; }
    if (isRecording) { stopRecording(); showToast('⏹ Stopped'); return; }
    recordedChunks = [];
    try { mediaRecorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm;codecs=vp8,opus' }); }
    catch (e) { try { mediaRecorder = new MediaRecorder(cameraStream); } catch (e2) { showToast('Not supported'); return; } }
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recordedChunks.push(e.data); };
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      openUploadDetails('Recorded video', recordSeconds > 0 ? formatTime(recordSeconds) : '0:15', url);
    };
    mediaRecorder.start();
    isRecording = true;
    recordBtn.classList.add('recording');
    recordTimer.classList.add('show');
    recordSeconds = 0;
    recordTimer.textContent = '00:00';
    recordTimerInterval = setInterval(() => {
      recordSeconds++;
      recordTimer.textContent = formatTime(recordSeconds);
      if (currentUploadType === 'short' && recordSeconds >= 60) { stopRecording(); showToast('Max 60s'); }
      if (currentUploadType === 'long' && recordSeconds >= 600) { stopRecording(); showToast('Max 10min'); }
    }, 1000);
  });
}

function openNativeGallery() { nativeGalleryInput.value = ''; nativeGalleryInput.click(); }
if (galleryBtn) galleryBtn.addEventListener('click', openNativeGallery);
if (galleryBtn2) galleryBtn2.addEventListener('click', openNativeGallery);

if (nativeGalleryInput) {
  nativeGalleryInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('video/')) { showToast('Video file select karein'); return; }
    const url = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = url;
    tempVideo.onloadedmetadata = () => {
      const dur = tempVideo.duration;
      let durationStr = '0:00';
      if (isFinite(dur) && dur > 0) durationStr = Math.floor(dur / 60) + ':' + String(Math.floor(dur % 60)).padStart(2, '0');
      if (isFinite(dur) && dur <= 60 && currentUploadType !== 'long') currentUploadType = 'short';
      openUploadDetails(file.name.replace(/\.[^/.]+$/, ''), durationStr, url);
    };
    tempVideo.onerror = () => openUploadDetails(file.name, '0:00', url);
  });
}

function openUploadDetails(title, duration, url) {
  pendingUpload = { title, duration, url };
  currentVideoBlobUrl = url;
  uploadTitle.value = title.startsWith('Recorded') ? '' : title;
  uploadPreviewDur.textContent = duration;
  uploadPreviewBox.innerHTML = url
    ? `<video src="${url}" muted autoplay loop playsinline></video><span class="preview-dur">${duration}</span>`
    : `<i class="fas fa-play-circle"></i><span class="preview-dur">${duration}</span>`;
  uploadDetailsModal.classList.add('active');
}

if (uploadCancel) {
  uploadCancel.addEventListener('click', () => {
    uploadDetailsModal.classList.remove('active');
    pendingUpload = null;
    currentVideoBlobUrl = null;
  });
}

if (uploadNextBtn) {
  uploadNextBtn.addEventListener('click', () => {
    const title = uploadTitle.value.trim();
    if (!title) { showToast('Title enter karein'); return; }
    pendingUpload.title = title;
    uploadDetailsModal.classList.remove('active');
    openMetadataPage();
  });
}

// ============================================================
// METADATA PAGE
// ============================================================
async function openMetadataPage() {
  metaTags = [];
  metaVisibility = 'public';
  selectedThumbnailData = null;
  metaTitle.value = pendingUpload ? pendingUpload.title : '';
  metaDescription.value = '';
  metaCategory.value = 'Gaming';
  document.querySelectorAll('.visibility-option').forEach(v => v.classList.remove('active'));
  document.querySelector('.visibility-option[data-vis="public"]').classList.add('active');
  renderTags();
  uploadProgressWrap.style.display = 'none';

  thumbnailPicker.innerHTML = `
    <video id="thumbPreviewVideo" muted playsinline></video>
    <div class="thumb-overlay" id="thumbOverlay">
      <i class="fas fa-camera-retro"></i><span>Loading thumbnail...</span>
    </div>
  `;
  const newThumbVideo = document.getElementById('thumbPreviewVideo');
  if (currentVideoBlobUrl) { newThumbVideo.src = currentVideoBlobUrl; newThumbVideo.style.display = 'block'; }

  metadataPage.classList.add('open');

  if (currentVideoBlobUrl) {
    try {
      showToast('🎨 Auto-generating thumbnail...');
      const resp = await fetch(currentVideoBlobUrl);
      const blob = await resp.blob();
      const autoThumb = await generateThumbnailFromVideo(blob, 1);
      selectedThumbnailData = autoThumb;
      thumbnailPicker.innerHTML = `
        <img src="${autoThumb}" style="width:100%;height:100%;object-fit:cover;">
        <div class="thumb-status" style="display:flex;">
          <i class="fas fa-check-circle"></i> <span>Auto-generated</span>
        </div>
      `;
      showToast('✅ Auto thumbnail ready!');
    } catch (err) {
      thumbnailPicker.innerHTML = `
        <video id="thumbPreviewVideo" muted playsinline src="${currentVideoBlobUrl}"></video>
        <div class="thumb-overlay">
          <i class="fas fa-camera-retro"></i><span>Tap to set thumbnail</span>
        </div>
      `;
    }
  }
}

if (metadataBackBtn) {
  metadataBackBtn.addEventListener('click', () => {
    metadataPage.classList.remove('open');
    if (pendingUpload) uploadDetailsModal.classList.add('active');
  });
}

if (metadataCancelBtn) {
  metadataCancelBtn.addEventListener('click', () => {
    metadataPage.classList.remove('open');
    pendingUpload = null;
    currentVideoBlobUrl = null;
  });
}

if (thumbnailPicker) {
  thumbnailPicker.addEventListener('click', (e) => {
    if (e.target.closest('.thumb-action-btn')) return;
    if (e.target.closest('.thumb-status')) return;
    thumbnailInput.value = '';
    thumbnailInput.click();
  });
}

document.getElementById('autoThumbBtn')?.addEventListener('click', async (e) => {
  e.stopPropagation();
  if (!currentVideoBlobUrl) { showToast('No video'); return; }
  showToast('🎨 Generating...');
  try {
    const resp = await fetch(currentVideoBlobUrl);
    const blob = await resp.blob();
    const thumb = await generateThumbnailFromVideo(blob, 1);
    selectedThumbnailData = thumb;
    thumbnailPicker.innerHTML = `
      <img src="${thumb}" style="width:100%;height:100%;object-fit:cover;">
      <div class="thumb-status" style="display:flex;">
        <i class="fas fa-check-circle"></i> <span>Auto-generated</span>
      </div>
    `;
    showToast('✅ Auto thumbnail ready!');
  } catch (err) { showToast('❌ ' + err.message); }
});

document.getElementById('customThumbBtn')?.addEventListener('click', (e) => {
  e.stopPropagation();
  thumbnailInput.value = '';
  thumbnailInput.click();
});

if (thumbnailInput) {
  thumbnailInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { showToast('Image file select karein'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      selectedThumbnailData = ev.target.result;
      thumbnailPicker.innerHTML = `
        <img src="${selectedThumbnailData}" style="width:100%;height:100%;object-fit:cover;">
        <div class="thumb-status" style="display:flex;">
          <i class="fas fa-check-circle"></i> <span>Custom thumbnail</span>
        </div>
      `;
      showToast('🖼 Custom thumbnail set');
    };
    reader.readAsDataURL(file);
  });
}

function renderTags() {
  tagsContainer.innerHTML = metaTags.map((t, i) => `<span class="tag-chip">#${escapeHTML(t)}<i class="fas fa-times" data-idx="${i}"></i></span>`).join('');
  tagsContainer.querySelectorAll('.tag-chip i').forEach(el => {
    el.addEventListener('click', () => { metaTags.splice(parseInt(el.dataset.idx), 1); renderTags(); });
  });
}

if (addTagBtn) {
  addTagBtn.addEventListener('click', () => {
    const val = metaTagInput.value.trim().replace(/^#/, '').replace(/,/g, '');
    if (!val || metaTags.includes(val) || metaTags.length >= 10) return;
    metaTags.push(val);
    metaTagInput.value = '';
    renderTags();
  });
}

if (metaTagInput) {
  metaTagInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTagBtn.click(); }
  });
}

document.querySelectorAll('#metadataPage .visibility-option').forEach(opt => {
  opt.addEventListener('click', () => {
    document.querySelectorAll('#metadataPage .visibility-option').forEach(v => v.classList.remove('active'));
    opt.classList.add('active');
    metaVisibility = opt.dataset.vis;
  });
});

// ============================================================
// PUBLISH (with Copyright + Adult check)
// ============================================================
if (metadataPublishBtn) {
  metadataPublishBtn.addEventListener('click', async () => {
    const title = metaTitle.value.trim();
    if (!title) { showToast('Title enter karein'); return; }
    if (!pendingUpload || !currentVideoBlobUrl) { showToast('Video missing'); return; }

    // 🚫 Adult content check
    if (checkAdultContent(title, metaDescription.value, metaTags)) {
      showAlert('🚫 Content Blocked', 'Your video contains inappropriate content.<br><br>Your channel will be banned if you continue.', 'fa-ban');
      return;
    }

    metadataPublishBtn.disabled = true;
    metadataPublishBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';
    uploadProgressWrap.style.display = 'block';
    uploadProgressFill.style.width = '2%';
    uploadProgressText.textContent = 'Preparing video... 2%';

    try {
      const videoId = 'vid_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
      const user = state.user;
      const ch = state.channel;

      const resp = await fetch(currentVideoBlobUrl);
      let videoBlob = await resp.blob();
      if (videoBlob.size === 0) throw new Error('Video file empty');

      // 🚫 Copyright check
      const isCopyright = await checkCopyright(title, videoBlob.size);
      if (isCopyright) {
        showAlert('🚫 Copyright Detected', 'This video appears to be copied from another channel.<br><br>Copied videos are automatically deleted.', 'fa-copyright');
        metadataPublishBtn.disabled = false;
        metadataPublishBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Publish';
        uploadProgressWrap.style.display = 'none';
        return;
      }

      const originalSizeMB = videoBlob.size / (1024 * 1024);
      const MAX_SIZE_MB = 40;

      if (originalSizeMB > MAX_SIZE_MB) {
        uploadProgressText.textContent = `Compressing ${originalSizeMB.toFixed(1)} MB...`;
        uploadProgressFill.style.width = '10%';
        videoBlob = await compressVideo(videoBlob, MAX_SIZE_MB);
        uploadProgressText.textContent = `Compressed: ${(videoBlob.size / (1024 * 1024)).toFixed(1)} MB`;
        uploadProgressFill.style.width = '30%';
        await new Promise(r => setTimeout(r, 500));
      } else {
        uploadProgressFill.style.width = '30%';
        uploadProgressText.textContent = `Video: ${originalSizeMB.toFixed(1)} MB`;
      }

      await saveVideoToIDB(videoId, videoBlob);
      uploadProgressFill.style.width = '35%';
      uploadProgressText.textContent = 'Caching... 35%';

      const videoPath = `${user.id}/${videoId}.webm`;
      const { data: { session } } = await supabaseClient.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('Not authenticated');

      const uploadUrl = `${SUPABASE_URL}/storage/v1/object/videos/${videoPath}`;

      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadUrl, true);
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
        xhr.setRequestHeader('x-upsert', 'false');
        xhr.setRequestHeader('Content-Type', 'video/webm');
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const percent = 35 + Math.round((e.loaded / e.total) * 50);
            uploadProgressFill.style.width = percent + '%';
            uploadProgressText.textContent = `Uploading... ${percent}%`;
          }
        };
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve();
          else {
            let msg = `Upload failed (${xhr.status})`;
            try { const e = JSON.parse(xhr.responseText); if (e.message) msg = e.message; } catch (er) {}
            reject(new Error(msg));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        xhr.timeout = 300000;
        xhr.send(videoBlob);
      });

      uploadProgressFill.style.width = '85%';
      uploadProgressText.textContent = 'Uploaded! 85%';
      const { data: { publicUrl: videoPublicUrl } } = supabaseClient.storage.from('videos').getPublicUrl(videoPath);

      let thumbnailUrl = null;
      if (selectedThumbnailData) {
        uploadProgressText.textContent = 'Uploading thumbnail... 90%';
        const thumbResp = await fetch(selectedThumbnailData);
        const thumbBlob = await thumbResp.blob();
        const thumbPath = `${user.id}/${videoId}_thumb.jpg`;
        const { error: thumbErr } = await supabaseClient.storage.from('thumbnails').upload(thumbPath, thumbBlob, { contentType: 'image/jpeg', upsert: false });
        if (!thumbErr) thumbnailUrl = supabaseClient.storage.from('thumbnails').getPublicUrl(thumbPath).data.publicUrl;
        uploadProgressFill.style.width = '95%';
      }

      uploadProgressText.textContent = 'Saving... 95%';
      const { error: insertErr } = await supabaseClient.from('videos').insert({
        id: videoId,
        owner_id: user.id,
        channel_id: ch.id,
        channel_username: ch.username,
        channel_name: ch.name,
        title,
        description: metaDescription.value.trim(),
        duration: pendingUpload.duration,
        category: metaCategory.value,
        tags: metaTags,
        visibility: metaVisibility,
        video_url: videoPublicUrl,
        thumbnail_url: thumbnailUrl,
        views: 0, likes: 0, watch_time_seconds: 0,
        type: currentUploadType,
        file_size: videoBlob.size,
        status: 'approved'
      });

      if (insertErr) throw insertErr;

      uploadProgressFill.style.width = '100%';
      uploadProgressText.textContent = '✅ Published!';
      showToast('✅ Video published!');
      metadataPage.classList.remove('open');
      closeCameraPanel();

      pendingUpload = null;
      currentVideoBlobUrl = null;
      selectedThumbnailData = null;
      metaTags = [];
      setTimeout(() => { uploadProgressWrap.style.display = 'none'; }, 1500);

      await loadFeedFromSupabase();

      const { data: subs } = await supabaseClient.from('subscriptions').select('user_id').eq('channel_id', ch.id);
      if (subs && subs.length > 0) {
        const notifications = subs.map(sub => ({
          user_id: sub.user_id,
          message: `${ch.name} uploaded: "${title}"`,
          type: 'new_video'
        }));
        for (let i = 0; i < notifications.length; i += 100) {
          await supabaseClient.from('notifications').insert(notifications.slice(i, i + 100));
        }
      }
    } catch (err) {
      uploadProgressText.textContent = '❌ ' + (err.message || 'Upload failed');
      showToast('❌ ' + (err.message || 'Upload failed'));
    }

    metadataPublishBtn.disabled = false;
    metadataPublishBtn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Publish';
  });
}

// ============================================================
// CHANNEL SETUP
// ============================================================
let setupBannerData = null;
let setupAvatarData = null;

function openChannelSetup() {
  setupChannelName.value = '';
  setupUsername.value = '';
  setupDesc.value = '';
  setupAvatarEmoji.textContent = '👤';
  setupBannerData = null;
  setupAvatarData = null;
  const existingBannerImg = setupBanner.querySelector('img');
  if (existingBannerImg) existingBannerImg.remove();
  setupBanner.dataset.bannerData = '';
  bannerOverlay.innerHTML = '<i class="fas fa-image"></i><span>Tap to add banner</span>';
  channelSetupPage.classList.add('open');
}

document.addEventListener('click', e => {
  if (e.target.closest('#noChannelBtn')) openChannelSetup();
});

if (channelSetupBackBtn) channelSetupBackBtn.addEventListener('click', () => channelSetupPage.classList.remove('open'));
if (channelSetupCancelBtn) channelSetupCancelBtn.addEventListener('click', () => channelSetupPage.classList.remove('open'));

if (setupBanner) {
  setupBanner.addEventListener('click', () => {
    bannerInput.value = '';
    bannerInput.dataset.target = 'setup';
    bannerInput.click();
  });
}
if (setupAvatar) {
  setupAvatar.addEventListener('click', () => {
    profilePicInput.value = '';
    profilePicInput.dataset.target = 'setup';
    profilePicInput.click();
  });
}

if (bannerInput) {
  bannerInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const target = bannerInput.dataset.target;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target.result;
      if (target === 'edit') {
        editBannerData = data;
        const existingImg = editBanner.querySelector('img');
        if (existingImg) existingImg.remove();
        const img = document.createElement('img');
        img.src = data;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        editBanner.insertBefore(img, editBanner.firstChild);
        showToast('🖼 Banner ready');
      } else {
        setupBannerData = data;
        const existingImg = setupBanner.querySelector('img');
        if (existingImg) existingImg.remove();
        const img = document.createElement('img');
        img.src = data;
        img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
        setupBanner.insertBefore(img, setupBanner.firstChild);
        bannerOverlay.style.opacity = '0.5';
        showToast('🖼 Banner set');
      }
    };
    reader.readAsDataURL(file);
  });
}

if (profilePicInput) {
  profilePicInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const target = profilePicInput.dataset.target;
    const reader = new FileReader();
    reader.onload = ev => {
      const data = ev.target.result;
      if (target === 'edit') {
        editAvatarData = data;
        editAvatarEmoji.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover;">`;
        showToast('🖼 Avatar ready');
      } else {
        setupAvatarData = data;
        setupAvatarEmoji.innerHTML = `<img src="${data}" style="width:100%;height:100%;object-fit:cover;">`;
        showToast('🖼 Avatar set');
      }
    };
    reader.readAsDataURL(file);
  });
}

if (channelSetupCreateBtn) {
  channelSetupCreateBtn.addEventListener('click', async () => {
    const name = setupChannelName.value.trim();
    const username = setupUsername.value.trim();
    if (!name || !username) { showToast('Name & username required'); return; }
    const finalUsername = username.startsWith('@') ? username : '@' + username;
    channelSetupCreateBtn.disabled = true;
    channelSetupCreateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating...';
    try {
      let bannerUrl = null;
      if (setupBannerData) {
        const bResp = await fetch(setupBannerData);
        const bBlob = await bResp.blob();
        const bPath = `${state.user.id}/banner_${Date.now()}.jpg`;
        const { error: bErr } = await supabaseClient.storage.from('thumbnails').upload(bPath, bBlob, { contentType: 'image/jpeg', upsert: true });
        if (!bErr) bannerUrl = supabaseClient.storage.from('thumbnails').getPublicUrl(bPath).data.publicUrl;
      }
      let avatarUrl = null;
      if (setupAvatarData) {
        const aResp = await fetch(setupAvatarData);
        const aBlob = await aResp.blob();
        const aPath = `${state.user.id}/avatar_${Date.now()}.jpg`;
        const { error: aErr } = await supabaseClient.storage.from('thumbnails').upload(aPath, aBlob, { contentType: 'image/jpeg', upsert: true });
        if (!aErr) avatarUrl = supabaseClient.storage.from('thumbnails').getPublicUrl(aPath).data.publicUrl;
      }
      const { data, error } = await supabaseClient.from('channels').insert({
        owner_id: state.user.id,
        name, username: finalUsername,
        category: setupCategory.value,
        description: setupDesc.value.trim(),
        avatar_emoji: '🎬',
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
        language: setupLanguage.value,
        currency: setupCurrency.value,
        region: setupRegion.value,
        subscribers_count: 0
      }).select().single();
      if (error) throw error;
      state.channel = data;
      channelSetupPage.classList.remove('open');
      showToast('🎉 Channel created!');
      updateUI();
    } catch (err) { showToast('❌ ' + err.message); }
    channelSetupCreateBtn.disabled = false;
    channelSetupCreateBtn.innerHTML = '<i class="fas fa-check-circle"></i> Create Channel';
  });
}

// ============================================================
// EDIT CHANNEL
// ============================================================
let editBannerData = null;
let editAvatarData = null;

document.addEventListener('click', e => {
  if (e.target.closest('#openEditChannelBtn')) {
    if (!state.channel) return;
    editChannelName.value = state.channel.name || '';
    editUsername.value = state.channel.username || '';
    editCategory.value = state.channel.category || 'Gaming';
    editLanguage.value = state.channel.language || 'English';
    editCurrency.value = state.channel.currency || 'USD';
    editRegion.value = state.channel.region || 'Global';
    editDesc.value = state.channel.description || '';
    editBannerData = null;
    editAvatarData = null;
    const existingBannerImg = editBanner.querySelector('img');
    if (existingBannerImg) existingBannerImg.remove();
    if (state.channel.banner_url) {
      const img = document.createElement('img');
      img.src = state.channel.banner_url;
      img.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      editBanner.insertBefore(img, editBanner.firstChild);
    }
    if (state.channel.avatar_url) {
      editAvatarEmoji.innerHTML = `<img src="${state.channel.avatar_url}" style="width:100%;height:100%;object-fit:cover;">`;
    } else {
      editAvatarEmoji.textContent = state.channel.avatar_emoji || '🎬';
    }
    editChannelPage.classList.add('open');
  }
});

if (editChannelBackBtn) editChannelBackBtn.addEventListener('click', () => editChannelPage.classList.remove('open'));
if (editChannelCancelBtn) editChannelCancelBtn.addEventListener('click', () => editChannelPage.classList.remove('open'));

if (editBanner) {
  editBanner.addEventListener('click', () => {
    bannerInput.value = '';
    bannerInput.dataset.target = 'edit';
    bannerInput.click();
  });
}
if (editAvatar) {
  editAvatar.addEventListener('click', () => {
    profilePicInput.value = '';
    profilePicInput.dataset.target = 'edit';
    profilePicInput.click();
  });
}

if (editChannelSaveBtn) {
  editChannelSaveBtn.addEventListener('click', async () => {
    const name = editChannelName.value.trim();
    const username = editUsername.value.trim();
    if (!name || !username) { showToast('Name & username required'); return; }
    const finalUsername = username.startsWith('@') ? username : '@' + username;
    editChannelSaveBtn.disabled = true;
    editChannelSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    try {
      let bannerUrl = state.channel.banner_url;
      let avatarUrl = state.channel.avatar_url;
      if (editBannerData) {
        const resp = await fetch(editBannerData);
        const blob = await resp.blob();
        const path = `${state.user.id}/banner_${Date.now()}.jpg`;
        await supabaseClient.storage.from('thumbnails').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
        bannerUrl = supabaseClient.storage.from('thumbnails').getPublicUrl(path).data.publicUrl;
      }
      if (editAvatarData) {
        const resp = await fetch(editAvatarData);
        const blob = await resp.blob();
        const path = `${state.user.id}/avatar_${Date.now()}.jpg`;
        await supabaseClient.storage.from('thumbnails').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
        avatarUrl = supabaseClient.storage.from('thumbnails').getPublicUrl(path).data.publicUrl;
      }
      const { error } = await supabaseClient.from('channels').update({
        name, username: finalUsername,
        category: editCategory.value,
        description: editDesc.value.trim(),
        language: editLanguage.value,
        currency: editCurrency.value,
        region: editRegion.value,
        banner_url: bannerUrl,
        avatar_url: avatarUrl
      }).eq('id', state.channel.id);
      if (error) throw error;
      await loadUserChannel();
      editChannelPage.classList.remove('open');
      showToast('✅ Channel updated!');
      updateUI();
    } catch (err) { showToast('❌ ' + err.message); }
    editChannelSaveBtn.disabled = false;
    editChannelSaveBtn.innerHTML = '<i class="fas fa-save"></i> Save';
  });
}

// ============================================================
// CHANNEL VIEW
// ============================================================
async function openChannelView(username) {
  const ch = state.allChannels.find(c => c.username === username);
  if (!ch) { showToast('Channel not found'); return; }
  const { data: chVideos } = await supabaseClient.from('videos').select('*')
    .eq('channel_username', username).order('created_at', { ascending: false });
  const videos = chVideos || [];
  const bannerHTML = ch.banner_url ? `<img src="${ch.banner_url}">` : '';
  const avatarHTML = ch.avatar_url ? `<img src="${ch.avatar_url}">` : (ch.avatar_emoji || '🎬');
  const isSubscribed = state.subscriptions.includes(ch.id);
  const isMine = ch.owner_id === state.user?.id;

  channelViewHeaderTitle.textContent = ch.name;
  channelViewBody.innerHTML = `
    <div class="channel-banner-display">${bannerHTML}</div>
    <div class="channel-view-info">
      <div class="channel-view-avatar">${avatarHTML}</div>
      <div class="channel-view-name"><i class="fas fa-check-circle"></i> ${escapeHTML(ch.name)}</div>
      <div class="channel-view-handle">${escapeHTML(ch.username)} · ${escapeHTML(ch.category || '')}</div>
      <div class="channel-view-stats">
        <span><strong>${ch.subscribers_count || 0}</strong> subscribers</span>
        <span><strong>${videos.length}</strong> videos</span>
      </div>
      ${ch.description ? `<div class="channel-view-desc">${escapeHTML(ch.description)}</div>` : ''}
      ${!isMine ? `
        <div class="channel-view-subscribe-row">
          <button class="subscribe-btn ${isSubscribed ? 'subscribed' : ''}" id="channelSubBtn" style="flex:1;justify-content:center;padding:12px;font-size:0.85rem;">
            ${isSubscribed ? '<i class="fas fa-check"></i> Subscribed' : '<i class="fas fa-plus"></i> Subscribe'}
          </button>
        </div>
      ` : ''}
    </div>
    <div class="channel-view-videos-title"><i class="fas fa-video"></i> Videos</div>
    <div class="channel-video-grid" id="channelVideoGrid"></div>
  `;

  const grid = document.getElementById('channelVideoGrid');
  if (videos.length === 0) {
    grid.innerHTML = '<div class="no-comments" style="padding:30px;">No videos yet.</div>';
  } else {
    videos.forEach(vid => {
      const card = document.createElement('div');
      card.className = 'video-card';
      const thumbHTML = vid.thumbnail_url ? `<img src="${vid.thumbnail_url}" style="width:100%;height:100%;object-fit:cover;">` : `<i class="fas fa-play-circle" style="font-size:3.8rem;color:#22c55e;"></i>`;
      const isMineVid = vid.owner_id === state.user?.id;
      const menuBtnHTML = isMineVid && !vid.is_live ? `<button class="my-video-menu-btn" data-mymenu="${vid.id}"><i class="fas fa-ellipsis-v"></i></button>` : '';
      card.innerHTML = `
        <div class="thumbnail-box">
          ${thumbHTML}
          <span class="duration-badge">${vid.duration || '0:00'}</span>
          ${vid.is_live ? '<span class="live-badge">🔴 LIVE</span>' : ''}
          ${menuBtnHTML}
        </div>
        <div class="video-details">
          <div class="video-meta">
            <div class="video-title">${escapeHTML(vid.title)}</div>
            <div class="video-stats">
              <span><i class="fas fa-eye"></i> ${vid.views || 0}</span>
              <span><i class="fas fa-thumbs-up"></i> ${vid.likes || 0}</span>
            </div>
          </div>
        </div>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.closest('.my-video-menu-btn')) { e.stopPropagation(); openVideoActions(vid); return; }
        if (vid.is_live) openLiveWatch(vid);
        else if (vid.type === 'short') openShortsFullscreen(vid.id);
        else openWatchPage(vid);
      });
      grid.appendChild(card);
    });
  }

  document.getElementById('channelSubBtn')?.addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    if (btn.classList.contains('subscribed')) {
      await supabaseClient.from('subscriptions').delete().eq('user_id', state.user.id).eq('channel_id', ch.id);
      const newCount = Math.max(0, (ch.subscribers_count || 1) - 1);
      await supabaseClient.from('channels').update({ subscribers_count: newCount }).eq('id', ch.id);
      btn.classList.remove('subscribed');
      btn.innerHTML = '<i class="fas fa-plus"></i> Subscribe';
      state.subscriptions = state.subscriptions.filter(id => id !== ch.id);
      showToast('Unsubscribed');
    } else {
      await supabaseClient.from('subscriptions').insert({ user_id: state.user.id, channel_id: ch.id });
      const newCount = (ch.subscribers_count || 0) + 1;
      await supabaseClient.from('channels').update({ subscribers_count: newCount }).eq('id', ch.id);
      btn.classList.add('subscribed');
      btn.innerHTML = '<i class="fas fa-check"></i> Subscribed';
      state.subscriptions.push(ch.id);
      showToast('✅ Subscribed!');
    }
    await loadFeedFromSupabase();
  });

  channelViewPage.classList.add('open');
}

if (channelViewBackBtn) channelViewBackBtn.addEventListener('click', () => channelViewPage.classList.remove('open'));

// ============================================================
// NOTIFICATIONS
// ============================================================
async function loadNotifications() {
  if (!state.user) return;
  const { data } = await supabaseClient.from('notifications').select('*')
    .eq('user_id', state.user.id).order('created_at', { ascending: false }).limit(50);
  state.notifications = data || [];
  if (notifDot) notifDot.style.display = state.notifications.length > 0 ? 'block' : 'none';
}

if (notifBtn) {
  notifBtn.addEventListener('click', () => {
    if (!state.user) { showToast('Login first'); return; }
    renderNotifications();
    notificationsPage.classList.add('open');
  });
}
if (notificationsBackBtn) notificationsBackBtn.addEventListener('click', () => notificationsPage.classList.remove('open'));

function renderNotifications() {
  if (!notificationsBody) return;
  if (state.notifications.length === 0) {
    notificationsBody.innerHTML = '<div class="no-notif">No notifications yet</div>';
    return;
  }
  notificationsBody.innerHTML = state.notifications.map(n => `
    <div class="notif-item">
      <div class="notif-icon"><i class="fas fa-heart"></i></div>
      <div class="notif-text">${escapeHTML(n.message)}</div>
      <div class="notif-time">${new Date(n.created_at).toLocaleString()}</div>
    </div>
  `).join('');
}

// ============================================================
// PROFILE / UI
// ============================================================
function updateUI() {
  if (state.loggedIn) {
    if (drawerUserEmail) drawerUserEmail.textContent = state.email;
    if (profileEmail) profileEmail.textContent = state.email;
    if (profileName) profileName.textContent = state.channel ? state.channel.name : 'ForTube User';
    if (settingsEmail) settingsEmail.textContent = state.email;
    if (settingsChannelStatus) settingsChannelStatus.textContent = state.channel ? state.channel.name : 'None';

    if (state.channel && channelStatusArea) {
      const avatarHTML = state.channel.avatar_url
        ? `<img src="${state.channel.avatar_url}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;">`
        : `<div style="width:48px;height:48px;border-radius:50%;background:#1a2e1a;display:flex;align-items:center;justify-content:center;font-size:1.6rem;">${state.channel.avatar_emoji || '🎬'}</div>`;
      channelStatusArea.innerHTML = `
        <div class="channel-stats-row" style="display:flex;align-items:center;gap:10px;">
          ${avatarHTML}
          <div style="text-align:left;">
            <div style="font-weight:800;color:#22c55e;">${escapeHTML(state.channel.name)}</div>
            <div style="font-size:0.7rem;color:#94a3b8;">${escapeHTML(state.channel.username)}</div>
          </div>
        </div>
        <button class="edit-channel-btn" id="openEditChannelBtn"><i class="fas fa-edit"></i> Edit Channel</button>
      `;
    } else if (channelStatusArea) {
      channelStatusArea.innerHTML = `<button class="no-channel-btn" id="noChannelBtn"><i class="fas fa-plus-circle"></i> No Channel — Create one</button>`;
    }
  }
  renderRecentlyWatched();
  updateMonetizationUI();
}

function renderRecentlyWatched() {
  if (!recentlyWatched) return;
  if (state.recentlyWatchedList.length === 0) {
    recentlyWatched.innerHTML = `<i class="fas fa-clock" style="font-size:1.4rem;color:#64748b;"></i><br>No recently watched videos.`;
  } else {
    recentlyWatched.innerHTML = state.recentlyWatchedList.map(t =>
      `<div style="padding:6px 0;border-bottom:1px solid #1e3a2e;text-align:left;">${escapeHTML(t)}</div>`
    ).join('');
  }
}

// ============================================================
// MONETIZATION UI
// ============================================================
async function updateMonetizationUI() {
  if (!state.channel) return;
  const isAdmin = isUserAdmin();
  const { data: videos } = await supabaseClient.from('videos').select('views, watch_time_seconds').eq('owner_id', state.user.id);
  const { data: liveStreams } = await supabaseClient.from('live_streams').select('views, duration_seconds').eq('channel_id', state.channel.id);

  const videoViews = (videos || []).reduce((sum, v) => sum + (v.views || 0), 0);
  const liveViews = (liveStreams || []).reduce((sum, l) => sum + (l.views || 0), 0);
  const totalViews = videoViews + liveViews;

  const videoWatchSeconds = (videos || []).reduce((sum, v) => sum + (v.watch_time_seconds || 0), 0);
  const liveWatchSeconds = (liveStreams || []).reduce((sum, l) => sum + ((l.duration_seconds || 0) * (l.views || 0)), 0);
  const totalWatchSeconds = videoWatchSeconds + liveWatchSeconds;
  const watchHours = Math.floor(totalWatchSeconds / 3600);
  const subs = state.channel.subscribers_count || 0;
  const revenue = calculateRevenue(subs, watchHours, totalViews);

  if (totalRevenue) totalRevenue.textContent = revenue.total.toFixed(2);

  if (isAdmin) {
    if (viewsProgress) viewsProgress.textContent = `1000/1000`;
    if (watchProgress) watchProgress.textContent = `4000/4000`;
    if (subsProgress) subsProgress.textContent = `1000/1000`;
    if (check1) check1.className = 'fas fa-check-circle ci-check';
    if (check2) check2.className = 'fas fa-check-circle ci-check';
    if (check3) check3.className = 'fas fa-check-circle ci-check';
    if (progressFill) progressFill.style.width = '100%';
    if (verifyBtn) {
      verifyBtn.disabled = false;
      verifyBtn.classList.add('eligible');
      verifyBtn.textContent = '✅ Verify & Apply';
    }
    return;
  }

  if (viewsProgress) viewsProgress.textContent = `${totalViews}/1000`;
  if (watchProgress) watchProgress.textContent = `${watchHours}/4000`;
  if (subsProgress) subsProgress.textContent = `${subs}/1000`;

  const vDone = totalViews >= 1000;
  const wDone = watchHours >= 4000;
  const sDone = subs >= 1000;

  if (check1) check1.className = 'fas fa-check-circle ci-check' + (vDone ? '' : ' pending');
  if (check2) check2.className = 'fas fa-check-circle ci-check' + (wDone ? '' : ' pending');
  if (check3) check3.className = 'fas fa-check-circle ci-check' + (sDone ? '' : ' pending');

  const done = [vDone, wDone, sDone].filter(Boolean).length;
  if (progressFill) progressFill.style.width = (done / 3 * 100) + '%';

  if (done === 3 && verifyBtn) {
    verifyBtn.disabled = false;
    verifyBtn.classList.add('eligible');
    verifyBtn.textContent = '✅ Verify & Apply';
  } else if (verifyBtn) {
    verifyBtn.disabled = true;
    verifyBtn.classList.remove('eligible');
    verifyBtn.textContent = `Not Eligible Yet (${done}/3)`;
  }
}

// ============================================================
// MONETIZATION CARD CLICK
// ============================================================
if (monetizationCard) {
  monetizationCard.addEventListener('click', async () => {
    await loadUserChannel();
    if (!state.channel) { showToast('Create channel first'); return; }
    monetizationPage.classList.add('open');
    const { data: applications } = await supabaseClient.from('monetization_applications').select('*')
      .eq('user_id', state.user.id).order('created_at', { ascending: false }).limit(1);
    const latestApp = applications && applications[0];
    const isApproved = latestApp && latestApp.status === 'approved';
    const isAdmin = isUserAdmin();
    if (isApproved || isAdmin) {
      eligibilityCard.style.display = 'none';
      monetizationApplyPage.style.display = 'none';
      monetizationRevenuePage.style.display = 'block';
      await updateMonetizationUI();
      loadWithdrawHistory();
    } else {
      eligibilityCard.style.display = 'block';
      monetizationApplyPage.style.display = 'none';
      monetizationRevenuePage.style.display = 'none';
      await updateMonetizationUI();
    }
  });
}

if (monetizationBackBtn) monetizationBackBtn.addEventListener('click', () => monetizationPage.classList.remove('open'));

if (verifyBtn) {
  verifyBtn.addEventListener('click', async () => {
    if (!verifyBtn.classList.contains('eligible')) return;
    const { data: applications } = await supabaseClient.from('monetization_applications').select('*')
      .eq('user_id', state.user.id).order('created_at', { ascending: false }).limit(1);
    const latestApp = applications && applications[0];
    const isApproved = latestApp && latestApp.status === 'approved';
    const isAdmin = isUserAdmin();
    if (isApproved || isAdmin) {
      eligibilityCard.style.display = 'none';
      monetizationApplyPage.style.display = 'none';
      monetizationRevenuePage.style.display = 'block';
      await updateMonetizationUI();
      loadWithdrawHistory();
    } else {
      eligibilityCard.style.display = 'none';
      monetizationApplyPage.style.display = 'block';
      monetizationRevenuePage.style.display = 'none';
      monetizationEmail.value = state.email;
    }
  });
}

if (submitMonetizationApplication) {
  submitMonetizationApplication.addEventListener('click', async () => {
    const email = monetizationEmail.value.trim();
    const file = verificationDocument.files[0];
    if (!email || !email.includes('@')) { showToast('Valid email'); return; }
    if (!file) { showToast('Document upload karein'); return; }
    submitMonetizationApplication.disabled = true;
    submitMonetizationApplication.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    try {
      const docPath = `${state.user.id}/${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabaseClient.storage.from('verification-documents').upload(docPath, file);
      if (uploadErr) throw uploadErr;
      const isAdmin = isUserAdmin();
      const status = isAdmin ? 'approved' : 'pending';
      const { error } = await supabaseClient.from('monetization_applications').insert({
        user_id: state.user.id, email, status, document_path: docPath
      });
      if (error) throw error;
      applicationStatus.style.display = 'block';
      applicationStatus.style.background = 'rgba(34,197,94,0.15)';
      applicationStatus.style.color = '#22c55e';
      applicationStatus.style.padding = '15px';
      applicationStatus.style.borderRadius = '15px';
      applicationStatus.style.marginTop = '15px';
      applicationStatus.textContent = isAdmin ? '✅ Admin — Auto-approved!' : '✅ Application submitted!';
      showToast('🎉 Sent!');
      if (isAdmin) {
        setTimeout(() => {
          monetizationApplyPage.style.display = 'none';
          eligibilityCard.style.display = 'none';
          monetizationRevenuePage.style.display = 'block';
          updateMonetizationUI();
          loadWithdrawHistory();
        }, 1500);
      }
    } catch (err) { showToast('❌ ' + err.message); }
    submitMonetizationApplication.disabled = false;
    submitMonetizationApplication.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Application';
  });
}

// ============================================================
// WITHDRAW (Min $10 + history show)
// ============================================================
async function loadWithdrawHistory() {
  if (!withdrawHistory) return;
  const { data } = await supabaseClient.from('withdraw_requests').select('*')
    .eq('user_id', state.user.id).order('created_at', { ascending: false }).limit(10);
  if (!data || data.length === 0) {
    withdrawHistory.innerHTML = '<div style="text-align:center;font-size:0.75rem;color:#64748b;padding:10px;">No withdrawal requests yet</div>';
    return;
  }
  withdrawHistory.innerHTML = `
    <div style="font-size:0.85rem;font-weight:800;color:#22c55e;margin-bottom:10px;">📜 Withdrawal History</div>
    ${data.map(w => `
      <div style="background:#0f1a0f;border-radius:12px;padding:12px;margin-bottom:8px;border:1px solid #1e3a2e;font-size:0.78rem;">
        <div style="display:flex;justify-content:space-between;">
          <span style="color:#e2e8f0;font-weight:700;">$${(w.amount || 0).toFixed(2)}</span>
          <span style="color:${w.status === 'approved' ? '#22c55e' : w.status === 'rejected' ? '#ef4444' : '#fbbf24'};font-weight:800;text-transform:uppercase;">${w.status || 'pending'}</span>
        </div>
        <div style="color:#64748b;font-size:0.7rem;margin-top:4px;">${new Date(w.created_at).toLocaleString()}</div>
      </div>
    `).join('')}
  `;
}

if (withdrawRevenueBtn) withdrawRevenueBtn.addEventListener('click', () => withdrawPage.classList.add('open'));
if (withdrawBackBtn) withdrawBackBtn.addEventListener('click', () => withdrawPage.classList.remove('open'));

document.getElementById('continueWithdrawBtn')?.addEventListener('click', () => {
  const country = document.getElementById('withdrawCountry').value;
  if (!country) { showToast('Select country'); return; }
  document.getElementById('withdrawCountryText').textContent = 'Bank info for ' + country;
  document.getElementById('withdrawBankForm').style.display = 'block';
  document.getElementById('continueWithdrawBtn').parentElement.style.display = 'none';
});

document.getElementById('submitWithdrawBtn')?.addEventListener('click', async () => {
  const holder = document.getElementById('withdrawAccountHolder').value.trim();
  const bank = document.getElementById('withdrawBankName').value.trim();
  const acc = document.getElementById('withdrawAccountNumber').value.trim();
  const amount = parseFloat(document.getElementById('withdrawAmount').value);
  const country = document.getElementById('withdrawCountry').value;
  if (!holder || !bank || !acc || !amount || amount <= 0) { showToast('All fields required'); return; }
  if (amount < MIN_WITHDRAWAL) { showToast(`Minimum: $${MIN_WITHDRAWAL}`); return; }

  try {
    await supabaseClient.from('withdraw_requests').insert({
      user_id: state.user.id,
      user_email: state.email,
      amount,
      country,
      account_holder: holder,
      bank_name: bank,
      account_number: acc,
      status: 'pending',
      created_at: new Date().toISOString()
    });
    const status = document.getElementById('withdrawStatus');
    status.style.display = 'block';
    status.style.background = 'rgba(34,197,94,0.15)';
    status.style.color = '#22c55e';
    status.style.padding = '15px';
    status.style.borderRadius = '15px';
    status.style.marginTop = '15px';
    status.textContent = `✅ Withdrawal request of $${amount.toFixed(2)} submitted! Admin will review.`;
    showToast('💰 Request sent!');
    document.getElementById('withdrawAccountHolder').value = '';
    document.getElementById('withdrawBankName').value = '';
    document.getElementById('withdrawAccountNumber').value = '';
    document.getElementById('withdrawAmount').value = '';
  } catch (err) { showToast('❌ ' + err.message); }
});

// ============================================================
// ANALYTICS (Separate page with graphs + CPM/RPM + Countries)
// ============================================================
if (analyticsCard) {
  analyticsCard.addEventListener('click', async () => {
    if (!state.channel) { showToast('Create channel first'); return; }
    document.getElementById('analyticsPage').classList.add('open');
    await loadAnalyticsData();
  });
}
if (analyticsBackBtn) analyticsBackBtn.addEventListener('click', () => document.getElementById('analyticsPage').classList.remove('open'));

async function loadAnalyticsData() {
  const { data: videos } = await supabaseClient.from('videos')
    .select('views, watch_time_seconds, created_at, likes').eq('owner_id', state.user.id);

  const totalViews = (videos || []).reduce((s, v) => s + (v.views || 0), 0);
  const totalWatchSec = (videos || []).reduce((s, v) => s + (v.watch_time_seconds || 0), 0);
  const watchHours = Math.floor(totalWatchSec / 3600);
  const subs = state.channel.subscribers_count || 0;

  if (analyticsTotalViews) analyticsTotalViews.textContent = totalViews.toLocaleString();
  if (analyticsTotalWatchTime) analyticsTotalWatchTime.textContent = watchHours.toLocaleString();
  if (analyticsTotalSubs) analyticsTotalSubs.textContent = subs.toLocaleString();
  if (analyticsTotalVideos) analyticsTotalVideos.textContent = (videos || []).length;

  // CPM / RPM
  const revenue = calculateRevenue(subs, watchHours, totalViews);
  const cpm = totalViews > 0 ? (revenue.total / totalViews) * 1000 : 0;
  const rpm = totalViews > 0 ? (revenue.total * 0.55 / totalViews) * 1000 : 0;
  if (analyticsCPM) analyticsCPM.textContent = '$' + cpm.toFixed(2);
  if (analyticsRPM) analyticsRPM.textContent = '$' + rpm.toFixed(2);

  // Graphs (animated)
  drawAnimatedLineChart(document.getElementById('analyticsViewsChart'), generateGrowthData(totalViews), '#22c55e', 'Views');
  drawAnimatedLineChart(document.getElementById('analyticsWatchChart'), generateGrowthData(watchHours), '#0ea5e9', 'Watch');
  drawAnimatedLineChart(document.getElementById('analyticsSubsChart'), generateGrowthData(subs), '#fbbf24', 'Subs');

  // Countries (simulated from views)
  if (analyticsCountries) {
    const countries = [
      { name: '🇵🇰 Pakistan', percent: 42 },
      { name: '🇮🇳 India', percent: 23 },
      { name: '🇺🇸 United States', percent: 12 },
      { name: '🇬🇧 United Kingdom', percent: 8 },
      { name: '🇦🇪 UAE', percent: 6 },
      { name: '🌍 Others', percent: 9 }
    ];
    analyticsCountries.innerHTML = countries.map(c => `
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;font-size:0.8rem;color:#e2e8f0;border-bottom:1px solid #1e3a2e;">
        <span>${c.name}</span>
        <span style="color:#22c55e;font-weight:800;">${c.percent}%</span>
      </div>
    `).join('');
  }
}

// ============================================================
// DRAWER
// ============================================================
if (hamburgerBtn) {
  hamburgerBtn.addEventListener('click', () => {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
  });
}
function closeDrawer() {
  if (drawer) drawer.classList.remove('open');
  if (drawerOverlay) drawerOverlay.classList.remove('open');
}
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', function () {
    const type = this.dataset.drawer;
    closeDrawer();
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.querySelector('.nav-item[data-tab="home"]').classList.add('active');
    if (type === 'home') { currentFilter = 'home'; renderFeed('', 'home'); }
    else if (type === 'live') { currentFilter = 'live'; renderFeed('', 'live'); }
    else if (type === 'gaming') { currentFilter = 'gaming'; renderFeed('', 'gaming'); }
    else if (type === 'sports') { currentFilter = 'sports'; renderFeed('', 'sports'); }
    else if (type === 'yourvideos') { currentFilter = 'yourvideos'; renderFeed('', 'yourvideos'); }
    else if (type === 'trending') { currentFilter = 'trending'; renderFeed('', 'trending'); }
    else if (type === 'music') { currentFilter = 'music'; renderFeed('', 'music'); }
    else if (type === 'news') { currentFilter = 'news'; renderFeed('', 'news'); }
    else if (type === 'settings') { settingsPage.classList.add('open'); }
    else if (type === 'help') { supportPage.classList.add('open'); }
  });
});

// ============================================================
// NAV
// ============================================================
if (navYou) {
  navYou.addEventListener('click', () => {
    if (!state.loggedIn) { showToast('Login first'); return; }
    profilePanel.classList.add('open');
    updateUI();
  });
}
if (profileBackBtn) profileBackBtn.addEventListener('click', () => profilePanel.classList.remove('open'));

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', function () {
    if (this.id === 'navYou') return;
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    this.classList.add('active');
    const tab = this.dataset.tab;
    if (tab === 'home') { currentFilter = 'home'; renderFeed('', 'home'); }
    else if (tab === 'shorts') {
      currentFilter = 'shorts';
      renderFeed('', 'shorts');
      setTimeout(() => openShortsFullscreen(), 200);
    }
    else if (tab === 'subs') {
      currentFilter = 'subs';
      renderFeed('', 'subs');
      openSubscriptions();
    }
  });
});

// ============================================================
// SETTINGS
// ============================================================
if (settingsBackBtn) settingsBackBtn.addEventListener('click', () => settingsPage.classList.remove('open'));
if (settingsBtn) {
  settingsBtn.addEventListener('click', () => {
    if (!state.loggedIn) { showToast('Login first'); return; }
    settingsPage.classList.add('open');
  });
}

if (settingsLanguage) settingsLanguage.addEventListener('change', () => { state.preferences.language = settingsLanguage.value; showToast('🌐 ' + settingsLanguage.value); });
if (settingsRegion) settingsRegion.addEventListener('change', () => { state.preferences.region = settingsRegion.value; showToast('📍 ' + settingsRegion.value); });
if (settingsCurrency) settingsCurrency.addEventListener('change', () => { state.preferences.currency = settingsCurrency.value; showToast('💱 ' + settingsCurrency.value); });
if (settingsQuality) settingsQuality.addEventListener('change', () => { state.preferences.quality = settingsQuality.value; showToast('🎬 ' + settingsQuality.value); });

if (toggleSubtitles) toggleSubtitles.addEventListener('click', () => { toggleSubtitles.classList.toggle('active'); showToast(toggleSubtitles.classList.contains('active') ? 'Subtitles ON' : 'Subtitles OFF'); });
if (toggleRestricted) toggleRestricted.addEventListener('click', () => { toggleRestricted.classList.toggle('active'); showToast(toggleRestricted.classList.contains('active') ? 'Restricted ON' : 'Restricted OFF'); });
if (toggleHistory) toggleHistory.addEventListener('click', () => { toggleHistory.classList.toggle('active'); showToast(toggleHistory.classList.contains('active') ? 'History ON' : 'History OFF'); });
if (toggleNotifications) toggleNotifications.addEventListener('click', () => { toggleNotifications.classList.toggle('active'); showToast(toggleNotifications.classList.contains('active') ? 'Notifications ON' : 'Notifications OFF'); });

if (clearCacheBtn) {
  clearCacheBtn.addEventListener('click', () => {
    indexedDB.deleteDatabase(IDB_NAME);
    idbInstance = null;
    showToast('🧹 Cache cleared');
  });
}

document.getElementById('changePasswordBtn')?.addEventListener('click', () => {
  if (!state.email) { showToast('Login first'); return; }
  resetPassword(state.email);
});

if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener('click', () => {
    if (confirm('Are you sure?')) showToast('⚠️ Contact: syedtechnical63@gmail.com');
  });
}

// ============================================================
// SEARCH
// ============================================================
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const q = searchInput.value.trim();
    renderFeed(q, currentFilter);
  });
}
if (searchInput) {
  searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchBtn.click(); });
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim();
    if (!q) renderFeed('', currentFilter);
    else if (q.length >= 2) renderFeed(q, currentFilter);
  });
}

// MIC
if (micBtn) {
  micBtn.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      showToast('🎤 Voice not supported'); return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SR();
    recog.lang = 'en-US';
    micBtn.classList.add('recording');
    showToast('🎤 Listening...');
    recog.start();
    recog.onresult = e => {
      searchInput.value = e.results[0][0].transcript;
      searchBtn.click();
    };
    recog.onerror = () => showToast('🎤 Try again');
    recog.onend = () => micBtn.classList.remove('recording');
  });
}

if (alertCloseBtn) alertCloseBtn.addEventListener('click', () => alertPopup.classList.remove('active'));

// ============================================================
// INIT
// ============================================================
checkSession();

window.addEventListener('beforeunload', async () => {
  if (state.currentWatchingVideoId) await saveWatchTimeNow(state.currentWatchingVideoId);
  if (state.agoraClient) { try { state.agoraClient.leave(); } catch (e) {} }
});

setInterval(() => {
  if (state.loggedIn && watchPage && !watchPage.classList.contains('open') && !liveWatchPage.classList.contains('open')) {
    loadFeedFromSupabase();
    loadNotifications();
  }
}, 30000);

console.log('✅ ForTube v15 loaded - Green/Black theme, $10 min withdrawal, gifts enabled');