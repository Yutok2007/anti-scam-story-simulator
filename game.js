// ===== 遊戲狀態 =====
const state = {
  playerIdentity: null,
  currentRegion: null,
  playerStats: {},
  currentScenario: null,
  currentSceneId: null,
  sceneHistory: [],
  choiceLog: [],
  sceneCount: 0,
  totalScenes: 6,   // 固定6關
  xp: 0,
  level: 1,
  achievements: [],
  goodChoices: 0,
  badChoices: 0,
  streakGood: 0     // 連續好選擇
};

// ===== localStorage 持久化 =====
const SAVE_KEY = 'antiscam_save_data';
const ENDINGS_KEY = 'antiscam_endings_unlocked';

function saveGame() {
  if (!state.playerIdentity || !state.currentRegion || !state.currentScenario) return;
  const data = {
    playerIdentity: state.playerIdentity,
    currentRegion: state.currentRegion,
    playerStats: state.playerStats,
    currentScenarioId: state.currentScenario.id,
    currentSceneId: state.currentSceneId,
    sceneHistory: state.sceneHistory,
    choiceLog: state.choiceLog,
    sceneCount: state.sceneCount,
    totalScenes: state.totalScenes,
    xp: state.xp,
    level: state.level,
    achievements: state.achievements,
    goodChoices: state.goodChoices,
    badChoices: state.badChoices,
    streakGood: state.streakGood
  };
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch (e) { /* ignore quota error */ }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

function hasSavedGame() {
  return localStorage.getItem(SAVE_KEY) !== null;
}

// ===== 結局收集系統 =====
function getUnlockedEndings() {
  try {
    const raw = localStorage.getItem(ENDINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}

function unlockEnding(endingId) {
  const list = getUnlockedEndings();
  if (!list.includes(endingId)) {
    list.push(endingId);
    localStorage.setItem(ENDINGS_KEY, JSON.stringify(list));
  }
}

function getEndingProgressHtml() {
  const allIds = endings.map(e => e.id);
  const unlocked = getUnlockedEndings();
  const total = allIds.length;
  const count = unlocked.length;
  const pct = Math.round((count / total) * 100);
  return `
    <div class="ending-progress">
      <h4>${t('endingProgressTitle')}</h4>
      <div class="ending-progress-bar-wrap">
        <div class="ending-progress-bar" style="width:${pct}%"></div>
      </div>
      <div class="ending-progress-text">${t('endingProgressText')} ${count} ${t('endingProgressOf')} ${total} ${t('endingProgressEndings')}</div>
      <div class="ending-grid">
        ${allIds.map(id => {
          const e = endings.find(ed => ed.id === id);
          const isUnlocked = unlocked.includes(id);
          return `<div class="ending-cell ${isUnlocked ? 'unlocked' : 'locked'}">
            ${isUnlocked ? e.icon : '❓'}
            <span>${isUnlocked ? tField(e, 'title') : t('endingLocked')}</span>
          </div>`;
        }).join('')}
      </div>
    </div>`;
}

const baseStats = {
  money: 100, alertness: 50, trust: 50, stress: 20,
  information: 30, localFamiliarity: 50,
  languagePressure: 20, identityAnxiety: 20,
  socialPressure: 20, riskScore: 0
};

// ===== XP 與等級系統 =====
const levelThresholds = [0, 100, 250, 450, 700, 1000];
const levelTitles = ['新手偵探', '初級反詐師', '反詐達人', '資深鑑定家', '反詐宗師', '傳奇守護者'];
const levelTitlesEn = ['Rookie Detective', 'Junior Scam Spotter', 'Anti-Scam Pro', 'Senior Investigator', 'Anti-Scam Master', 'Legendary Guardian'];
const levelIcons = ['🔰', '🥉', '🥈', '🥇', '🏆', '👑'];

function getLevelTitle(level = state.level) {
  const titles = getCurrentLang() === 'en' ? levelTitlesEn : levelTitles;
  return titles[Math.max(0, level - 1)] || '';
}

function addXP(amount, label) {
  state.xp += amount;
  // 升級檢查
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (state.xp >= levelThresholds[i]) {
      if (state.level !== i + 1) {
        state.level = i + 1;
        showXPToast(getCurrentLang() === 'en'
          ? `⬆️ Level up! You are now a “${levelTitlesEn[i]}” ${levelIcons[i]}`
          : `⬆️ 升級！你現在是「${levelTitles[i]}」${levelIcons[i]}`, true);
      }
      break;
    }
  }
  if (label) showXPToast(`+${amount} XP  ${label}`);
  updateXPBar();
}

function showXPToast(msg, isLevelUp = false) {
  const toast = document.getElementById('xpToast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'xp-toast' + (isLevelUp ? ' level-up' : '');
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-12px)';
  }, 2200);
}

function updateXPBar() {
  const lvl = Math.min(state.level - 1, levelThresholds.length - 2);
  const xpStart = levelThresholds[lvl] || 0;
  const xpEnd = levelThresholds[lvl + 1] || levelThresholds[levelThresholds.length - 1];
  const pct = Math.min(100, ((state.xp - xpStart) / (xpEnd - xpStart)) * 100);

  const bar = document.getElementById('xpBar');
  const valEl = document.getElementById('xpVal');
  const lvlEl = document.getElementById('playerLevel');
  const titleEl = document.getElementById('playerTitle');
  if (bar) bar.style.width = pct + '%';
  if (valEl) valEl.textContent = state.xp + ' XP';
  if (lvlEl) lvlEl.textContent = levelIcons[state.level - 1] + ' Lv.' + state.level;
  if (titleEl) titleEl.textContent = getLevelTitle();
}

// ===== 成就系統 =====
const achievementDefs = [
  { id: 'first_good', icon: '🌟', name: '初心者', nameEn: 'First Step', desc: '第一次做出正確選擇', descEn: 'Made your first safe choice' },
  { id: 'no_risk', icon: '🛡️', name: '零風險', nameEn: 'Zero Risk', desc: '全程風險分保持 0', descEn: 'Kept the risk score at zero' },
  { id: 'streak3', icon: '🔥', name: '三連好', nameEn: 'Triple Streak', desc: '連續3次做出好選擇', descEn: 'Made three safe choices in a row' },
  { id: 'detective', icon: '🔍', name: '偵探模式', nameEn: 'Detective Mode', desc: '資訊值達到 80 以上', descEn: 'Raised information to 80 or above' },
  { id: 'calm', icon: '🧘', name: '泰山崩前', nameEn: 'Calm Under Pressure', desc: '壓力場景中選擇了核實', descEn: 'Chose to verify under pressure' },
  { id: 'reporter', icon: '📢', name: '熱心市民', nameEn: 'Community Reporter', desc: '選擇舉報了詐騙', descEn: 'Reported a scam' },
  { id: 'speedrun', icon: '⚡', name: '秒識詐騙', nameEn: 'Instant Detection', desc: '首個場景即識破詐騙', descEn: 'Spotted the scam in the first scene' },
  { id: 'perfect', icon: '💎', name: '完美通關', nameEn: 'Perfect Run', desc: '全程 0 損失 0 風險', descEn: 'Finished with zero loss and zero risk' }
];

function unlockAchievement(id) {
  if (state.achievements.includes(id)) return;
  const def = achievementDefs.find(a => a.id === id);
  if (!def) return;
  state.achievements.push(id);
  addXP(50, `${t('achievementUnlock')}${tField(def, 'name')}`);
  showAchievementPopup(def);
}

function showAchievementPopup(def) {
  const el = document.getElementById('achievementPopup');
  if (!el) return;
  el.innerHTML = `<span class="ach-icon">${def.icon}</span><div><div class="ach-name">${t('achievementUnlock')}${tField(def, 'name')}</div><div class="ach-desc">${tField(def, 'desc')}</div></div>`;
  el.style.opacity = '1';
  el.style.transform = 'translateX(0)';
  clearTimeout(el._timeout);
  el._timeout = setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateX(120px)';
  }, 3000);
}

function checkAchievements(choice, scene) {
  const e = choice.effects || {};
  // 首次好選擇
  if (choice.feedbackType === 'good' && state.goodChoices === 1) unlockAchievement('first_good');
  // 連續3好
  if (state.streakGood >= 3) unlockAchievement('streak3');
  // 偵探
  if (state.playerStats.information >= 80) unlockAchievement('detective');
  // 壓力場景核實
  if (isPressureScene(scene) && choice.feedbackType === 'good') unlockAchievement('calm');
  // 舉報
  if (choice.id && choice.id.includes('report')) unlockAchievement('reporter');
  // 首場景識破
  if (state.sceneCount === 1 && choice.feedbackType === 'good') unlockAchievement('speedrun');
}

// ===== 倒計時狀態 =====
let countdownTimer = null;
let countdownSeconds = 0;

// ===== 畫面切換 =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = '';
  });
  const screen = document.getElementById(id);
  if (screen) {
    screen.classList.add('active');
    screen.scrollTop = 0;
    window.scrollTo(0, 0);
    resetHorizontalScroll();
    requestAnimationFrame(resetHorizontalScroll);
  }
}

function resetHorizontalScroll() {
  document.documentElement.scrollLeft = 0;
  document.body.scrollLeft = 0;
  const statsPanel = document.querySelector('.stats-panel');
  const gameMain = document.querySelector('.game-main');
  if (statsPanel) statsPanel.scrollLeft = 0;
  if (gameMain) gameMain.scrollLeft = 0;
}

// 舊版曾讓語言壓力條與頂部語言工具欄共用 lang-bar 類名。
// 即使瀏覽器混用了新舊快取，也要在執行時移除會造成全高遮罩的舊類名。
function normalizeLanguagePressureBar() {
  const pressureBar = document.getElementById('bar-languagePressure');
  if (!pressureBar) return;
  pressureBar.classList.remove('lang-bar');
  pressureBar.classList.add('language-pressure-bar');
}

normalizeLanguagePressureBar();

// ===== 選擇身份 =====
function selectIdentity(identityId) {
  state.playerIdentity = identityId;
  document.querySelectorAll('.identity-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  setTimeout(() => showScreen('regionScreen'), 300);
}

// ===== 選擇地區 =====
function selectRegion(regionId) {
  state.currentRegion = regionId;
  document.querySelectorAll('.region-card').forEach(c => c.classList.remove('selected'));
  event.currentTarget.classList.add('selected');
  setTimeout(() => buildIntroScreen(), 300);
}

// ===== 計算並應用初始修正 =====
function applyInitialModifiers() {
  const stats = Object.assign({}, baseStats);
  const idMod = identityModifiers[state.playerIdentity] || {};
  const regMod = (regionModifiers[state.playerIdentity] || {})[state.currentRegion] || {};
  for (const key in idMod) stats[key] = clamp(stats[key] + idMod[key]);
  for (const key in regMod) stats[key] = clamp(stats[key] + regMod[key]);
  state.playerStats = stats;
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }
function clampStats() {
  for (const key in state.playerStats) state.playerStats[key] = clamp(state.playerStats[key]);
}

// ===== 構建開場頁 =====
function buildIntroScreen() {
  applyInitialModifiers();
  const iName = getIdentityName(state.playerIdentity);
  const rName = getRegionName(state.currentRegion);
  const introSource = getCurrentLang() === 'en' && typeof introTextsEn !== 'undefined' ? introTextsEn : introTexts;
  const text = (introSource[state.playerIdentity] || {})[state.currentRegion] || "";

  document.getElementById('introBadge').innerHTML = `🎭 ${iName} &nbsp;·&nbsp; 📍 ${rName}`;
  document.getElementById('introTitle').textContent = t('introTitle');
  document.getElementById('introText').textContent = text;

  // 關卡預覽
  const missionEl = document.getElementById('missionPreview');
  if (missionEl) {
    missionEl.innerHTML = `
      <div class="mission-row">
        <span class="mission-step done">🔒 ${t('stageNames')[1]}</span>
        <span class="mission-step">🔒 ${t('stageNames')[2]}</span>
        <span class="mission-step">🔒 ${t('stageNames')[3]}</span>
        <span class="mission-step">🔒 ${t('stageNames')[4]}</span>
        <span class="mission-step">🔒 ${t('stageNames')[5]}</span>
        <span class="mission-step">🔒 ${t('stageNames')[6]}</span>
      </div>
      <p class="mission-hint">${t('missionPreview')}</p>
    `;
  }

  const miniStats = document.getElementById('miniStats');
  miniStats.innerHTML = '';
  const idMod = identityModifiers[state.playerIdentity] || {};
  const regMod = (regionModifiers[state.playerIdentity] || {})[state.currentRegion] || {};
  const allMods = {};
  for (const k in idMod) allMods[k] = (allMods[k] || 0) + idMod[k];
  for (const k in regMod) allMods[k] = (allMods[k] || 0) + regMod[k];

  const statLabels = {
    money: t('statMoney'), alertness: t('statAlertness'), trust: t('statTrust'),
    stress: t('statStress'), information: t('statInfo'), localFamiliarity: t('statLocal'),
    languagePressure: t('statLang'), identityAnxiety: t('statIdentity'), riskScore: t('statRisk')
  };

  const shown = new Set();
  for (const k in allMods) {
    if (allMods[k] === 0 || shown.has(k)) continue;
    shown.add(k);
    const chip = document.createElement('div');
    const total = allMods[k];
    chip.className = 'mini-stat-chip ' + (total > 0 ? 'positive' : 'negative');
    chip.textContent = `${statLabels[k] || k} ${total > 0 ? '+' : ''}${total}`;
    miniStats.appendChild(chip);
  }
  if (shown.size === 0) {
    miniStats.innerHTML = `<div class="mini-stat-chip">${t('standardInit')}</div>`;
  }

  showScreen('introScreen');
}

// ===== 開始遊戲 =====
function startGame() {
  const scenarios = scenarioLibrary[state.currentRegion] || [];
  if (scenarios.length === 0) {
    alert(t('noScenario'));
    return;
  }
  const suitable = scenarios.filter(s =>
    !s.suitableIdentities || s.suitableIdentities.includes(state.playerIdentity)
  );
  state.currentScenario = suitable[0] || scenarios[0];
  state.sceneHistory = [];
  state.choiceLog = [];
  state.sceneCount = 0;
  state.totalScenes = 6;
  state.xp = 0;
  state.level = 1;
  state.achievements = [];
  state.goodChoices = 0;
  state.badChoices = 0;
  state.streakGood = 0;

  updateAllStatBars();
  updateXPBar();
  updateStageDots(0);
  document.getElementById('scenarioTitle').textContent = tField(state.currentScenario, 'title');

  showScreen('gameScreen');
  renderScene(state.currentScenario.scenes[0].id);
}

// ===== 更新關卡點（Stage dots）=====
function updateStageDots(current) {
  for (let i = 1; i <= 6; i++) {
    const dot = document.getElementById('stage-' + i);
    if (!dot) continue;
    dot.className = 'stage-dot' + (i < current ? ' done' : i === current ? ' active' : '');
  }
  const label = document.getElementById('stageLabel');
  if (label && current >= 1) {
    const stageNames = t('stageNames');
    label.textContent = stageNames[current] || '';
  }
}

// ===== 判斷場景是否為高壓場景（需要倒計時）=====
function isPressureScene(scene) {
  if (scene.speaker === 'scammer') return true;
  if (scene.type === 'phone_call' && scene.pressure === true) return true;
  return false;
}

// ===== 倒計時系統 =====
function startCountdown(scene, initialSeconds = 10) {
  clearCountdown();
  const wrapper = document.getElementById('countdownWrapper');
  if (!wrapper) return;
  wrapper.style.display = 'flex';
  countdownSeconds = Math.max(1, Math.min(10, initialSeconds));
  updateCountdownDisplay(countdownSeconds);
  countdownTimer = setInterval(() => {
    countdownSeconds--;
    updateCountdownDisplay(countdownSeconds);
    if (countdownSeconds <= 0) {
      clearCountdown();
      handleTimeUp(scene);
    }
  }, 1000);
}

function updateCountdownDisplay(sec) {
  const bar = document.getElementById('countdownBar');
  const num = document.getElementById('countdownNum');
  if (!bar || !num) return;
  const pct = (sec / 10) * 100;
  bar.style.width = pct + '%';
  num.textContent = sec;
  if (sec <= 3) {
    bar.classList.add('urgent');
    num.style.color = '#EF4444';
    num.style.filter = 'drop-shadow(0 0 10px rgba(239,68,68,0.9))';
  } else {
    bar.classList.remove('urgent');
    num.style.color = '';
    num.style.filter = '';
  }
}

function clearCountdown() {
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  const wrapper = document.getElementById('countdownWrapper');
  if (wrapper) wrapper.style.display = 'none';
}

// ===== 時間到自動選最壞選項 =====
function handleTimeUp(scene) {
  const choices = scene.choices || [];
  if (choices.length === 0) return;
  let worstChoice = choices[0];
  let maxRisk = -Infinity;
  choices.forEach(c => {
    const risk = (c.effects && c.effects.riskScore) || 0;
    if (risk > maxRisk) { maxRisk = risk; worstChoice = c; }
  });
  const worstText = tText(worstChoice);
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.trim() === worstText.trim()) btn.classList.add('auto-selected');
  });
  const fb = document.getElementById('feedbackBox');
  fb.textContent = t('timeUpMsg');
  fb.className = 'feedback-box bad';
  fb.style.display = 'block';
  state.choiceLog.push({
    sceneId: scene.id, choiceId: worstChoice.id, choiceText: worstText,
    effects: worstChoice.effects || {}, feedback: t('timeUpMsg'), feedbackType: 'bad'
  });
  state.badChoices++;
  state.streakGood = 0;
  addXP(0);
  applyEffects(worstChoice.effects || {});
  updateAllStatBars();
  setTimeout(() => {
    const nextId = worstChoice.nextSceneId;
    if (nextId === '__ending__') triggerEnding();
    else renderScene(nextId);
  }, 2000);
}

// ===== 渲染場景 =====
function renderScene(sceneId, options = {}) {
  const countProgress = options.countProgress !== false;
  const preserveCountdown = options.preserveCountdown === true;
  const previousCountdown = countdownSeconds;
  const wasCounting = countdownTimer !== null;
  const choicesWereDisabled = Array.from(document.querySelectorAll('.choice-btn')).some(button => button.disabled);
  clearCountdown();
  const scenario = state.currentScenario;
  const scene = scenario.scenes.find(s => s.id === sceneId);
  if (!scene) { console.error('Scene not found:', sceneId); return; }

  state.currentSceneId = sceneId;

  // 更新進度（只計非 ending/result 場景）
  if (countProgress && scene.type !== 'ending' && scene.type !== 'result') {
    state.sceneCount = Math.min(state.sceneCount + 1, state.totalScenes);
    updateStageDots(state.sceneCount);
  }

  document.getElementById('sceneProgress').textContent = `${t('sceneProgress')} ${state.sceneCount} / ${state.totalScenes}`;

  const sceneCard = document.getElementById('sceneCard');
  sceneCard.className = 'scene-card';
  if (state.playerStats.riskScore >= 60) sceneCard.classList.add('high-risk');
  else if (state.playerStats.riskScore <= 20 && state.playerStats.information >= 50) sceneCard.classList.add('safe');

  const typeBadge = document.getElementById('sceneTypeBadge');
  const typeIcons = {
    message: t('sceneTypeMessage'), chat: t('sceneTypeChat'), phone_call: t('sceneTypePhone'),
    email: t('sceneTypeEmail'), webpage: t('sceneTypeWebpage'), social_post: t('sceneTypeSocial'),
    result: t('sceneTypeResult'), ending: t('sceneTypeEnding')
  };
  typeBadge.textContent = typeIcons[scene.type] || scene.type;

  if (isPressureScene(scene)) {
    typeBadge.textContent = t('sceneAlert') + (typeIcons[scene.type] || scene.type);
    typeBadge.style.background = 'rgba(248,113,113,0.15)';
    typeBadge.style.color = '#F87171';
  } else {
    typeBadge.style.background = '';
    typeBadge.style.color = '';
  }

  renderVisual(scene, isPressureScene(scene));
  document.getElementById('sceneText').innerHTML = scene.text ? `<p>${tText(scene)}</p>` : '';

  const fb = document.getElementById('feedbackBox');
  fb.style.display = 'none';
  fb.textContent = '';
  fb.className = 'feedback-box';

  renderChoices(scene);

  // 語言切換只重繪文字，不應讓已提交的選項再次可點。
  if (choicesWereDisabled && !countProgress) {
    const lastChoice = [...state.choiceLog].reverse().find(log => log.sceneId === scene.id);
    document.querySelectorAll('.choice-btn').forEach(button => {
      button.disabled = true;
      if (lastChoice && button.dataset.choiceId === lastChoice.choiceId) button.classList.add('selected');
    });
    if (lastChoice) {
      const choice = (scene.choices || []).find(item => item.id === lastChoice.choiceId);
      if (choice && tField(choice, 'feedback')) {
        fb.textContent = tField(choice, 'feedback');
        fb.className = 'feedback-box ' + (choice.feedbackType || 'mid');
        fb.style.display = 'block';
      }
    }
  }

  if (isPressureScene(scene) && scene.type !== 'ending' && !(choicesWereDisabled && !countProgress)) {
    if (preserveCountdown && wasCounting) startCountdown(scene, previousCountdown);
    else setTimeout(() => startCountdown(scene), 500);
  }

  resetHorizontalScroll();
}

// ===== 渲染視覺 =====
function tVisualField(obj, field, fallbackKey) {
  const value = tField(obj, field);
  const hasEnglishValue = obj && obj[`${field}En`] !== undefined;
  if (getCurrentLang() === 'en' && !hasEnglishValue && /[\u3400-\u9fff]/.test(String(value))) {
    return t(fallbackKey);
  }
  return value;
}

function renderVisual(scene, isPressure) {
  const visualEl = document.getElementById('sceneVisual');
  if (!scene.visual) { visualEl.innerHTML = ''; return; }
  const v = scene.visual;

  if (v.type === 'sms') {
    visualEl.innerHTML = `
      <div class="phone-frame">
        <div class="header-bar"><span>💬 ${t('sceneTypeMessage')}</span><span>${new Date().toLocaleTimeString(currentLang === 'en' ? 'en-US' : 'zh-TW',{hour:'2-digit',minute:'2-digit'})}</span></div>
        <div class="sms-bubble">
          <div class="sms-sender">${escHtml(tVisualField(v, 'sender', 'visualSenderFallback'))}</div>
          <div>${escHtml(tVisualField(v, 'content', 'visualContentFallback'))}</div>
          ${v.link ? `<div class="sms-link">🔗 ${escHtml(v.link)}</div>` : ''}
        </div>
      </div>`;
  } else if (v.type === 'chat') {
    const msgs = (v.messages || []).map(m => `
      <div class="chat-msg ${m.type}">
        ${m.type === 'incoming' ? `<div class="chat-name">${escHtml(tVisualField(m, 'name', 'visualSenderFallback'))}</div>` : ''}
        <div class="chat-bubble">${escHtml(tVisualField(m, 'text', 'visualChatFallback'))}</div>
        ${m.type === 'outgoing' ? `<div class="chat-name" style="text-align:right">${escHtml(tVisualField(m, 'name', 'visualSenderFallback'))}</div>` : ''}
      </div>`).join('');
    visualEl.innerHTML = `
      <div class="chat-frame">
        <div class="chat-app-header">
          <span class="chat-app-icon">${escHtml(v.appIcon || '💬')}</span>
          <span class="chat-app-name">${escHtml(tVisualField(v, 'app', 'visualAppFallback') || (currentLang === 'en' ? 'Chat' : '聊天'))}</span>
        </div>
        ${msgs}
      </div>`;
  } else if (v.type === 'phone_call') {
    const dangerClass = isPressure ? 'danger-call' : '';
    visualEl.innerHTML = `
      <div class="phone-call-frame ${dangerClass}">
        <span class="call-icon">📞</span>
        <div class="call-from">${t('sceneTypePhone')}</div>
        <div class="call-name">${escHtml(tVisualField(v, 'caller', 'visualCallerFallback') || (currentLang === 'en' ? 'Unknown Number' : '未知號碼'))}</div>
        <div class="call-msg">${escHtml(tVisualField(v, 'content', 'visualContentFallback'))}</div>
      </div>`;
  } else if (v.type === 'warning_page') {
    visualEl.innerHTML = `
      <div class="email-frame" style="border-left:3px solid #F87171;">
        <div class="email-header">
          <div class="email-from" style="color:#F87171;font-weight:700;">⚠️ ${currentLang === 'en' ? 'Suspicious Page' : '可疑頁面'}</div>
        <div class="email-subject">${currentLang === 'en' ? '⚠️ Security Warning' : '⚠️ 安全警告'}</div>
        </div>
        <div class="email-body" style="white-space:pre-line;font-size:0.85rem;">${escHtml(tVisualField(v, 'content', 'visualContentFallback'))}</div>
      </div>`;
  } else if (v.type === 'safe_result') {
    visualEl.innerHTML = `
      <div class="email-frame" style="border-left:3px solid #34D399;">
        <div class="email-header">
          <div class="email-from" style="color:#34D399;font-weight:700;">${t('sceneTypeResult')}</div>
        </div>
        <div class="email-body" style="white-space:pre-line;font-size:0.9rem;">${escHtml(tVisualField(v, 'content', 'visualContentFallback'))}</div>
      </div>`;
  } else {
    visualEl.innerHTML = '';
  }
}

// ===== 渲染選項 =====
function renderChoices(scene) {
  const container = document.getElementById('choicesContainer');
  container.innerHTML = '';
  (scene.choices || []).forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.dataset.choiceId = choice.id;
    btn.textContent = tText(choice);
    btn.onclick = () => handleChoice(choice, scene);
    container.appendChild(btn);
  });
}

// ===== 處理選擇 =====
function handleChoice(choice, scene) {
  clearCountdown();
  const choiceText = tText(choice);
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === choiceText) b.classList.add('selected');
  });

  state.choiceLog.push({
    sceneId: scene.id, choiceId: choice.id, choiceText: choiceText,
    effects: choice.effects || {}, feedback: tField(choice, 'feedback'),
    feedbackType: choice.feedbackType || 'mid'
  });

  // XP 計算
  const feedType = choice.feedbackType || 'mid';
  if (feedType === 'good') {
    state.goodChoices++;
    state.streakGood++;
    const xpGain = 30 + (state.streakGood > 1 ? 10 * (state.streakGood - 1) : 0);
    addXP(Math.min(xpGain, 80), feedType === 'good' ? t('xpGoodChoice') : '');
  } else if (feedType === 'bad') {
    state.badChoices++;
    state.streakGood = 0;
    addXP(5, t('xpGain'));
  } else {
    state.streakGood = 0;
    addXP(15, '');
  }

  checkAchievements(choice, scene);
  applyEffects(choice.effects || {});
  updateAllStatBars();
  saveGame();  // 每次選擇後自動保存

  const localizedFeedback = tField(choice, 'feedback');
  if (localizedFeedback) {
    const fb = document.getElementById('feedbackBox');
    fb.textContent = localizedFeedback;
    fb.className = 'feedback-box ' + feedType;
    fb.style.display = 'block';
  }

  setTimeout(() => {
    const nextId = choice.nextSceneId;
    if (nextId === '__ending__') triggerEnding();
    else renderScene(nextId);
  }, localizedFeedback ? 1800 : 500);
}

// ===== 應用數值效果 =====
function applyEffects(effects) {
  for (const key in effects) {
    if (key in state.playerStats) {
      state.playerStats[key] = clamp(state.playerStats[key] + effects[key]);
    }
  }
}

// ===== 更新狀態欄 =====
function updateAllStatBars() {
  normalizeLanguagePressureBar();
  const stats = state.playerStats;
  const barMap = {
    money: 'money', alertness: 'alertness', stress: 'stress',
    information: 'information', riskScore: 'riskScore',
    localFamiliarity: 'localFamiliarity',
    languagePressure: 'languagePressure', identityAnxiety: 'identityAnxiety'
  };
  for (const [key, barId] of Object.entries(barMap)) {
    const bar = document.getElementById(`bar-${barId}`);
    const val = document.getElementById(`val-${barId}`);
    if (bar) bar.style.width = stats[key] + '%';
    if (val) val.textContent = Math.round(stats[key]);
  }
}

// ===== 判定結局 =====
function determineEnding() {
  const s = state.playerStats;
  for (const ending of endings) {
    if (ending.condition(s)) return ending;
  }
  return endings[endings.length - 1];
}

// ===== 觸發結局 =====
function triggerEnding() {
  clearCountdown();
  // 完美通關成就
  if (state.playerStats.riskScore === 0 && state.playerStats.money === 100) {
    unlockAchievement('perfect');
  }
  if (state.playerStats.riskScore === 0) {
    unlockAchievement('no_risk');
  }
  const ending = determineEnding();
  unlockEnding(ending.id);  // 記錄解鎖的結局
  clearSave();              // 遊戲結束，清除進度存檔
  setTimeout(() => renderEnding(ending), 500);
}

// ===== 計算最終分數 =====
function calcFinalScore() {
  const s = state.playerStats;
  let score = 0;
  score += s.money;                         // 金錢保留
  score += s.alertness * 0.5;              // 警覺
  score += s.information * 0.5;           // 資訊
  score -= s.riskScore * 0.8;             // 風險扣分
  score += state.xp * 0.1;               // XP加成
  score += state.achievements.length * 20; // 成就加分
  return Math.max(0, Math.round(score));
}

function getScoreGrade(score) {
  if (score >= 200) return { grade: 'S', color: '#FBBF24', icon: '🏆' };
  if (score >= 150) return { grade: 'A', color: '#34D399', icon: '🥇' };
  if (score >= 100) return { grade: 'B', color: '#60A5FA', icon: '🥈' };
  if (score >= 60)  return { grade: 'C', color: '#A78BFA', icon: '🥉' };
  return { grade: 'D', color: '#F87171', icon: '💀' };
}

// ===== 渲染結局（遊戲化版本）=====
function renderEnding(ending) {
  const finalScore = calcFinalScore();
  const grade = getScoreGrade(finalScore);

  document.getElementById('endingIcon').textContent = ending.icon;
  document.getElementById('endingTitle').textContent = tField(ending, 'title');
  document.getElementById('endingTitle').style.color = ending.color;
  document.getElementById('endingDesc').textContent = tField(ending, 'description');

  // 分數展示
  const scoreEl = document.getElementById('endingScore');
  if (scoreEl) {
    scoreEl.innerHTML = `
      <div class="score-display">
        <div class="score-grade" style="color:${grade.color}">${grade.icon} ${grade.grade}</div>
        <div class="score-num">${finalScore} <span class="score-unit">${t('endingScoreUnit')}</span></div>
        <div class="score-level">${levelIcons[state.level-1]} ${getLevelTitle()}  ·  ${state.xp} XP</div>
      </div>`;
  }

  // 最終數值chips
  const statsEl = document.getElementById('endingFinalStats');
  const s = state.playerStats;
  const chips = [
    { label: t('statMoney'), val: s.money, good: s.money >= 70, bad: s.money <= 30 },
    { label: t('statAlertness'), val: s.alertness, good: s.alertness >= 65, bad: s.alertness < 40 },
    { label: t('statInfo'), val: s.information, good: s.information >= 60, bad: s.information < 35 },
    { label: t('statRisk'), val: s.riskScore, good: s.riskScore <= 30, bad: s.riskScore >= 60 }
  ];
  statsEl.innerHTML = chips.map(c => `
    <div class="stat-chip ${c.bad ? 'bad' : c.good ? 'good' : 'mid'}">
      ${c.label}: ${Math.round(c.val)}
    </div>`).join('');

  // 成就展示
  const achEl = document.getElementById('endingAchievements');
  if (achEl) {
    if (state.achievements.length > 0) {
      const achDefs = state.achievements.map(id => achievementDefs.find(a => a.id === id)).filter(Boolean);
      achEl.innerHTML = `
        <h4>${t('endingAchievements')}</h4>
        <div class="ach-list">
          ${achDefs.map(a => `<div class="ach-badge"><span>${a.icon}</span><span>${tField(a, 'name')}</span></div>`).join('')}
        </div>`;
    } else {
      achEl.innerHTML = `<p class="no-ach">${t('endingNoAchievement')}</p>`;
    }
  }

  const adviceEl = document.getElementById('endingAdvice');
  const endingAdvice = getCurrentLang() === 'en' && !ending.adviceEn ? t('endingAdviceItems') : tField(ending, 'advice');
  adviceEl.innerHTML = `
    <h4>${t('endingAdvice')}</h4>
    <ul>${endingAdvice.map(a => `<li>${a}</li>`).join('')}</ul>`;

  // 結局收集進度
  const progressEl = document.getElementById('endingProgress');
  if (progressEl) {
    progressEl.innerHTML = getEndingProgressHtml();
  }

  showScreen('endingScreen');
}

// ===== 反詐回顧頁 =====
function renderReview() {
  const scenario = state.currentScenario;
  const identity = getIdentityName(state.playerIdentity);
  const region = getRegionName(state.currentRegion);
  const s = state.playerStats;

  let worstChoice = null, bestChoice = null;
  let worstScore = -Infinity, bestScore = Infinity;
  for (const log of state.choiceLog) {
    const e = log.effects || {};
    const dangerScore = (e.riskScore || 0) - (e.information || 0) - (e.alertness || 0) + (-(e.money || 0));
    if (dangerScore > worstScore) { worstScore = dangerScore; worstChoice = log; }
    if (dangerScore < bestScore) { bestScore = dangerScore; bestChoice = log; }
  }
  const localizedWorstChoice = worstChoice ? findScenarioChoice(worstChoice.choiceId) : null;
  const localizedBestChoice = bestChoice ? findScenarioChoice(bestChoice.choiceId) : null;

  const reviewHtml = `
    <div class="review-card">
      <h4>${t('reviewGameData')}</h4>
      <p><strong>${t('reviewIdentity')}</strong>${identity}</p>
      <p><strong>${t('reviewRegion')}</strong>${region}</p>
      <p><strong>${t('reviewScamType')}</strong>${scenario ? tField(scenario, 'scamType') : '—'}</p>
      <p><strong>${t('reviewGoodChoices')}</strong>${state.goodChoices} ${t('reviewBadChoices')} &nbsp;|&nbsp; <strong>${t('reviewBadChoicesLabel')}</strong>${state.badChoices} ${t('reviewBadChoices')}</p>
      <p><strong>${t('reviewXP')}</strong>${state.xp} &nbsp;|&nbsp; <strong>${t('reviewLevel')}</strong>${getLevelTitle()}</p>
    </div>

    <div class="review-card">
      <h4>${t('reviewRedFlags')}</h4>
      <ul>
        ${(scenario ? tField(scenario, 'redFlags') : []).map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="review-card">
      <h4>${t('reviewChoiceAnalysis')}</h4>
      ${worstChoice ? `
        <p style="margin-bottom:6px;font-size:0.82rem;color:var(--text-muted);">${t('reviewWorstChoice')}</p>
        <div class="review-highlight">「${localizedWorstChoice ? tText(localizedWorstChoice) : worstChoice.choiceText}」<br><small>${localizedWorstChoice ? tField(localizedWorstChoice, 'feedback') : (worstChoice.feedback || '')}</small></div>
      ` : ''}
      ${bestChoice && bestChoice !== worstChoice ? `
        <p style="margin-top:10px;margin-bottom:6px;font-size:0.82rem;color:var(--text-muted);">${t('reviewBestChoice')}</p>
        <div class="review-good">「${localizedBestChoice ? tText(localizedBestChoice) : bestChoice.choiceText}」<br><small>${localizedBestChoice ? tField(localizedBestChoice, 'feedback') : (bestChoice.feedback || '')}</small></div>
      ` : ''}
    </div>

    <div class="review-card">
      <h4>${t('reviewVerifyMethod')}</h4>
      <ul>
        ${(scenario ? tField(scenario, 'officialChannels') : []).map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>

    <div class="review-card">
      <h4>${t('reviewFinalStats')}</h4>
      <p>${t('reviewMoney')}${Math.round(s.money)} &nbsp;|&nbsp; ${t('reviewAlertness')}${Math.round(s.alertness)} &nbsp;|&nbsp; ${t('reviewInfo')}${Math.round(s.information)}</p>
      <p>${t('reviewRisk')}${Math.round(s.riskScore)} &nbsp;|&nbsp; ${t('reviewStress')}${Math.round(s.stress)}</p>
    </div>

    <div class="review-reminder">
      <p>${t('reviewReminder')}</p>
    </div>
  `;

  document.getElementById('reviewContent').innerHTML = reviewHtml;
}

function findScenarioChoice(choiceId) {
  if (!choiceId || !state.currentScenario) return null;
  for (const scene of state.currentScenario.scenes || []) {
    const choice = (scene.choices || []).find(item => item.id === choiceId);
    if (choice) return choice;
  }
  return null;
}

// 語言切換後只重繪目前頁面的文案，不改變玩家進度或分數。
function refreshLocalizedContent() {
  const activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;

  if (activeScreen.id === 'introScreen' && state.playerIdentity && state.currentRegion) {
    buildIntroScreen();
  } else if (activeScreen.id === 'gameScreen' && state.currentScenario && state.currentSceneId) {
    document.getElementById('scenarioTitle').textContent = tField(state.currentScenario, 'title');
    updateXPBar();
    updateStageDots(state.sceneCount);
    renderScene(state.currentSceneId, { countProgress: false, preserveCountdown: true });
  } else if (activeScreen.id === 'endingScreen' && state.currentScenario) {
    renderEnding(determineEnding());
  } else if (activeScreen.id === 'reviewScreen') {
    renderReview();
  }

  const overlay = document.getElementById('endingCollectionOverlay');
  if (overlay && overlay.style.display !== 'none') showEndingCollection();
}

// ===== 重新開始 =====
function restartGame() {
  clearCountdown();
  clearSave();
  state.playerIdentity = null;
  state.currentRegion = null;
  state.playerStats = {};
  state.currentScenario = null;
  state.currentSceneId = null;
  state.sceneHistory = [];
  state.choiceLog = [];
  state.sceneCount = 0;
  state.xp = 0;
  state.level = 1;
  state.achievements = [];
  state.goodChoices = 0;
  state.badChoices = 0;
  state.streakGood = 0;
  document.querySelectorAll('.identity-card, .region-card').forEach(c => c.classList.remove('selected'));
  showScreen('startScreen');
}

// ===== 繼續上次進度 =====
function continueGame() {
  const data = loadGame();
  if (!data) return;

  state.playerIdentity = data.playerIdentity;
  state.currentRegion = data.currentRegion;
  state.playerStats = data.playerStats;
  state.currentSceneId = data.currentSceneId;
  state.sceneHistory = data.sceneHistory || [];
  state.choiceLog = data.choiceLog || [];
  state.sceneCount = data.sceneCount || 0;
  state.totalScenes = data.totalScenes || 6;
  state.xp = data.xp || 0;
  state.level = data.level || 1;
  state.achievements = data.achievements || [];
  state.goodChoices = data.goodChoices || 0;
  state.badChoices = data.badChoices || 0;
  state.streakGood = data.streakGood || 0;

  // 恢復場景數據
  const scenarios = scenarioLibrary[state.currentRegion] || [];
  const scenario = scenarios.find(s => s.id === data.currentScenarioId);
  if (!scenario) { restartGame(); return; }
  state.currentScenario = scenario;

  // 恢復 UI
  updateAllStatBars();
  updateXPBar();
  updateStageDots(state.sceneCount);
  document.getElementById('scenarioTitle').textContent = tField(state.currentScenario, 'title');
  showScreen('gameScreen');
  renderScene(state.currentSceneId, { countProgress: false });
}

// ===== 顯示結局收集頁 =====
function showEndingCollection() {
  const overlay = document.getElementById('endingCollectionOverlay');
  const content = document.getElementById('endingCollectionContent');
  if (!overlay || !content) return;
  content.innerHTML = `<h2 style="text-align:center;margin-bottom:20px;font-size:1.3rem;">${t('endingCollectionTitle')}</h2>` + getEndingProgressHtml();
  overlay.style.display = 'flex';
}

function closeEndingCollection() {
  const overlay = document.getElementById('endingCollectionOverlay');
  if (overlay) overlay.style.display = 'none';
}

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  const reviewBtn = document.querySelector('#endingScreen .btn-primary');
  if (reviewBtn) {
    reviewBtn.onclick = () => { renderReview(); showScreen('reviewScreen'); };
  }

  // 檢查是否有存檔
  if (hasSavedGame()) {
    const btn = document.getElementById('continueBtn');
    if (btn) btn.style.display = 'inline-block';
  }

  // 檢查是否有已解鎖結局
  const unlocked = getUnlockedEndings();
  if (unlocked.length > 0) {
    const btn = document.getElementById('endingCollectionBtn');
    if (btn) btn.style.display = 'inline-block';
  }

  showScreen('startScreen');
});

// ===== HTML 轉義 =====
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
