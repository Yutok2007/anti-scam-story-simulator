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
  totalScenes: 4,   // 固定4關
  xp: 0,
  level: 1,
  achievements: [],
  goodChoices: 0,
  badChoices: 0,
  streakGood: 0     // 連續好選擇
};

const baseStats = {
  money: 100, alertness: 50, trust: 50, stress: 20,
  information: 30, localFamiliarity: 50,
  languagePressure: 20, identityAnxiety: 20,
  socialPressure: 20, riskScore: 0
};

// ===== XP 與等級系統 =====
const levelThresholds = [0, 100, 250, 450, 700, 1000];
const levelTitles = ['新手偵探', '初級反詐師', '反詐達人', '資深鑑定家', '反詐宗師', '傳奇守護者'];
const levelIcons = ['🔰', '🥉', '🥈', '🥇', '🏆', '👑'];

function addXP(amount, label) {
  state.xp += amount;
  // 升級檢查
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (state.xp >= levelThresholds[i]) {
      if (state.level !== i + 1) {
        state.level = i + 1;
        showXPToast(`⬆️ 升級！你現在是「${levelTitles[i]}」${levelIcons[i]}`, true);
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
  if (titleEl) titleEl.textContent = levelTitles[state.level - 1];
}

// ===== 成就系統 =====
const achievementDefs = [
  { id: 'first_good', icon: '🌟', name: '初心者', desc: '第一次做出正確選擇' },
  { id: 'no_risk', icon: '🛡️', name: '零風險', desc: '全程風險分保持 0' },
  { id: 'streak3', icon: '🔥', name: '三連好', desc: '連續3次做出好選擇' },
  { id: 'detective', icon: '🔍', name: '偵探模式', desc: '資訊值達到 80 以上' },
  { id: 'calm', icon: '🧘', name: '泰山崩前', desc: '壓力場景中選擇了核實' },
  { id: 'reporter', icon: '📢', name: '熱心市民', desc: '選擇舉報了詐騙' },
  { id: 'speedrun', icon: '⚡', name: '秒識詐騙', desc: '首個場景即識破詐騙' },
  { id: 'perfect', icon: '💎', name: '完美通關', desc: '全程 0 損失 0 風險' }
];

function unlockAchievement(id) {
  if (state.achievements.includes(id)) return;
  const def = achievementDefs.find(a => a.id === id);
  if (!def) return;
  state.achievements.push(id);
  addXP(50, `成就解鎖：${def.name}`);
  showAchievementPopup(def);
}

function showAchievementPopup(def) {
  const el = document.getElementById('achievementPopup');
  if (!el) return;
  el.innerHTML = `<span class="ach-icon">${def.icon}</span><div><div class="ach-name">成就解鎖！${def.name}</div><div class="ach-desc">${def.desc}</div></div>`;
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
  }
}

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
  const iName = identityNames[state.playerIdentity];
  const rName = regionNames[state.currentRegion];
  const text = (introTexts[state.playerIdentity] || {})[state.currentRegion] || "";

  document.getElementById('introBadge').innerHTML = `🎭 ${iName} &nbsp;·&nbsp; 📍 ${rName}`;
  document.getElementById('introTitle').textContent = '你的冒險開始了！';
  document.getElementById('introText').textContent = text;

  // 關卡預覽
  const missionEl = document.getElementById('missionPreview');
  if (missionEl) {
    missionEl.innerHTML = `
      <div class="mission-row">
        <span class="mission-step done">🔒 關卡 1</span>
        <span class="mission-step">🔒 關卡 2</span>
        <span class="mission-step">🔒 關卡 3</span>
        <span class="mission-step">🔒 關卡 4</span>
      </div>
      <p class="mission-hint">完成所有關卡，解鎖你的反詐等級和成就！</p>
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
    money: '💰 金錢', alertness: '👁️ 警覺', trust: '🤝 信任',
    stress: '😰 壓力', information: '📋 資訊', localFamiliarity: '🏠 本地熟悉度',
    languagePressure: '🔤 語言壓力', identityAnxiety: '🪪 身份焦慮', riskScore: '⚠️ 風險分'
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
    miniStats.innerHTML = '<div class="mini-stat-chip">標準初始狀態</div>';
  }

  showScreen('introScreen');
}

// ===== 開始遊戲 =====
function startGame() {
  const scenarios = scenarioLibrary[state.currentRegion] || [];
  if (scenarios.length === 0) {
    alert('此地區暫無劇情，請選擇其他地區。');
    return;
  }
  const suitable = scenarios.filter(s =>
    !s.suitableIdentities || s.suitableIdentities.includes(state.playerIdentity)
  );
  state.currentScenario = suitable[0] || scenarios[0];
  state.sceneHistory = [];
  state.choiceLog = [];
  state.sceneCount = 0;
  state.totalScenes = 4;
  state.xp = 0;
  state.level = 1;
  state.achievements = [];
  state.goodChoices = 0;
  state.badChoices = 0;
  state.streakGood = 0;

  updateAllStatBars();
  updateXPBar();
  updateStageDots(0);
  document.getElementById('scenarioTitle').textContent = state.currentScenario.title;

  showScreen('gameScreen');
  renderScene(state.currentScenario.scenes[0].id);
}

// ===== 更新關卡點（Stage dots）=====
function updateStageDots(current) {
  for (let i = 1; i <= 4; i++) {
    const dot = document.getElementById('stage-' + i);
    if (!dot) continue;
    dot.className = 'stage-dot' + (i < current ? ' done' : i === current ? ' active' : '');
  }
  const label = document.getElementById('stageLabel');
  if (label && current >= 1) {
    const stageNames = ['', '第一關', '第二關', '第三關', '第四關'];
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
function startCountdown(scene) {
  clearCountdown();
  const wrapper = document.getElementById('countdownWrapper');
  if (!wrapper) return;
  wrapper.style.display = 'flex';
  countdownSeconds = 10;
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
  const btns = document.querySelectorAll('.choice-btn');
  btns.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.trim() === worstChoice.text.trim()) btn.classList.add('auto-selected');
  });
  const fb = document.getElementById('feedbackBox');
  fb.textContent = '⏰ 時間到！你猶豫了太久，壓力之下做了衝動決定……';
  fb.className = 'feedback-box bad';
  fb.style.display = 'block';
  state.choiceLog.push({
    sceneId: scene.id, choiceId: worstChoice.id, choiceText: worstChoice.text,
    effects: worstChoice.effects || {}, feedback: '⏰ 限時壓力衝動決定', feedbackType: 'bad'
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
function renderScene(sceneId) {
  clearCountdown();
  const scenario = state.currentScenario;
  const scene = scenario.scenes.find(s => s.id === sceneId);
  if (!scene) { console.error('Scene not found:', sceneId); return; }

  state.currentSceneId = sceneId;

  // 更新進度（只計非 ending/result 場景）
  if (scene.type !== 'ending' && scene.type !== 'result') {
    state.sceneCount = Math.min(state.sceneCount + 1, state.totalScenes);
    updateStageDots(state.sceneCount);
  }

  document.getElementById('sceneProgress').textContent = `關卡 ${state.sceneCount} / ${state.totalScenes}`;

  const sceneCard = document.getElementById('sceneCard');
  sceneCard.className = 'scene-card';
  if (state.playerStats.riskScore >= 60) sceneCard.classList.add('high-risk');
  else if (state.playerStats.riskScore <= 20 && state.playerStats.information >= 50) sceneCard.classList.add('safe');

  const typeBadge = document.getElementById('sceneTypeBadge');
  const typeIcons = {
    message: '📱 訊息通知', chat: '💬 聊天', phone_call: '📞 來電',
    email: '📧 電郵', webpage: '🌐 網頁', social_post: '📣 社交貼文',
    result: '✅ 核實結果', ending: '🏁 通關'
  };
  typeBadge.textContent = typeIcons[scene.type] || scene.type;

  if (isPressureScene(scene)) {
    typeBadge.textContent = '🚨 警報！' + (typeIcons[scene.type] || scene.type);
    typeBadge.style.background = 'rgba(248,113,113,0.15)';
    typeBadge.style.color = '#F87171';
  } else {
    typeBadge.style.background = '';
    typeBadge.style.color = '';
  }

  renderVisual(scene, isPressureScene(scene));
  document.getElementById('sceneText').innerHTML = scene.text ? `<p>${scene.text}</p>` : '';

  const fb = document.getElementById('feedbackBox');
  fb.style.display = 'none';
  fb.textContent = '';
  fb.className = 'feedback-box';

  renderChoices(scene);

  if (isPressureScene(scene) && scene.type !== 'ending') {
    setTimeout(() => startCountdown(scene), 500);
  }
}

// ===== 渲染視覺 =====
function renderVisual(scene, isPressure) {
  const visualEl = document.getElementById('sceneVisual');
  if (!scene.visual) { visualEl.innerHTML = ''; return; }
  const v = scene.visual;

  if (v.type === 'sms') {
    visualEl.innerHTML = `
      <div class="phone-frame">
        <div class="header-bar"><span>💬 訊息</span><span>${new Date().toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}</span></div>
        <div class="sms-bubble">
          <div class="sms-sender">${escHtml(v.sender)}</div>
          <div>${escHtml(v.content)}</div>
          ${v.link ? `<div class="sms-link">🔗 ${escHtml(v.link)}</div>` : ''}
        </div>
      </div>`;
  } else if (v.type === 'chat') {
    const msgs = (v.messages || []).map(m => `
      <div class="chat-msg ${m.type}">
        ${m.type === 'incoming' ? `<div class="chat-name">${escHtml(m.name)}</div>` : ''}
        <div class="chat-bubble">${escHtml(m.text)}</div>
        ${m.type === 'outgoing' ? `<div class="chat-name" style="text-align:right">${escHtml(m.name)}</div>` : ''}
      </div>`).join('');
    visualEl.innerHTML = `
      <div class="chat-frame">
        <div class="chat-app-header">
          <span class="chat-app-icon">${escHtml(v.appIcon || '💬')}</span>
          <span class="chat-app-name">${escHtml(v.app || 'Chat')}</span>
        </div>
        ${msgs}
      </div>`;
  } else if (v.type === 'phone_call') {
    const dangerClass = isPressure ? 'danger-call' : '';
    visualEl.innerHTML = `
      <div class="phone-call-frame ${dangerClass}">
        <span class="call-icon">📞</span>
        <div class="call-from">來電</div>
        <div class="call-name">${escHtml(v.caller || '未知號碼')}</div>
        <div class="call-msg">${escHtml(v.content || '')}</div>
      </div>`;
  } else if (v.type === 'warning_page') {
    visualEl.innerHTML = `
      <div class="email-frame" style="border-left:3px solid #F87171;">
        <div class="email-header">
          <div class="email-from" style="color:#F87171;font-weight:700;">⚠️ 可疑頁面</div>
        </div>
        <div class="email-body" style="white-space:pre-line;font-size:0.85rem;">${escHtml(v.content || '')}</div>
      </div>`;
  } else if (v.type === 'safe_result') {
    visualEl.innerHTML = `
      <div class="email-frame" style="border-left:3px solid #34D399;">
        <div class="email-header">
          <div class="email-from" style="color:#34D399;font-weight:700;">✅ 核實結果</div>
        </div>
        <div class="email-body" style="white-space:pre-line;font-size:0.9rem;">${escHtml(v.content || '')}</div>
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
    btn.textContent = choice.text;
    btn.onclick = () => handleChoice(choice, scene);
    container.appendChild(btn);
  });
}

// ===== 處理選擇 =====
function handleChoice(choice, scene) {
  clearCountdown();
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.textContent === choice.text) b.classList.add('selected');
  });

  state.choiceLog.push({
    sceneId: scene.id, choiceId: choice.id, choiceText: choice.text,
    effects: choice.effects || {}, feedback: choice.feedback || '',
    feedbackType: choice.feedbackType || 'mid'
  });

  // XP 計算
  const feedType = choice.feedbackType || 'mid';
  if (feedType === 'good') {
    state.goodChoices++;
    state.streakGood++;
    const xpGain = 30 + (state.streakGood > 1 ? 10 * (state.streakGood - 1) : 0);
    addXP(Math.min(xpGain, 80), feedType === 'good' ? '✅ 好選擇！' : '');
  } else if (feedType === 'bad') {
    state.badChoices++;
    state.streakGood = 0;
    addXP(5, '學到了！');
  } else {
    state.streakGood = 0;
    addXP(15, '');
  }

  checkAchievements(choice, scene);
  applyEffects(choice.effects || {});
  updateAllStatBars();

  if (choice.feedback) {
    const fb = document.getElementById('feedbackBox');
    fb.textContent = choice.feedback;
    fb.className = 'feedback-box ' + feedType;
    fb.style.display = 'block';
  }

  setTimeout(() => {
    const nextId = choice.nextSceneId;
    if (nextId === '__ending__') triggerEnding();
    else renderScene(nextId);
  }, choice.feedback ? 1800 : 500);
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
  document.getElementById('endingTitle').textContent = ending.title;
  document.getElementById('endingTitle').style.color = ending.color;
  document.getElementById('endingDesc').textContent = ending.description;

  // 分數展示
  const scoreEl = document.getElementById('endingScore');
  if (scoreEl) {
    scoreEl.innerHTML = `
      <div class="score-display">
        <div class="score-grade" style="color:${grade.color}">${grade.icon} ${grade.grade}</div>
        <div class="score-num">${finalScore} <span class="score-unit">分</span></div>
        <div class="score-level">${levelIcons[state.level-1]} ${levelTitles[state.level-1]}  ·  ${state.xp} XP</div>
      </div>`;
  }

  // 最終數值chips
  const statsEl = document.getElementById('endingFinalStats');
  const s = state.playerStats;
  const chips = [
    { label: '💰 金錢', val: s.money, good: s.money >= 70, bad: s.money <= 30 },
    { label: '👁️ 警覺', val: s.alertness, good: s.alertness >= 65, bad: s.alertness < 40 },
    { label: '📋 資訊', val: s.information, good: s.information >= 60, bad: s.information < 35 },
    { label: '⚠️ 風險', val: s.riskScore, good: s.riskScore <= 30, bad: s.riskScore >= 60 }
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
        <h4>🏅 本局成就</h4>
        <div class="ach-list">
          ${achDefs.map(a => `<div class="ach-badge"><span>${a.icon}</span><span>${a.name}</span></div>`).join('')}
        </div>`;
    } else {
      achEl.innerHTML = `<p class="no-ach">這局沒有解鎖成就，再玩一次試試！</p>`;
    }
  }

  const adviceEl = document.getElementById('endingAdvice');
  adviceEl.innerHTML = `
    <h4>💡 反詐小知識</h4>
    <ul>${ending.advice.map(a => `<li>${a}</li>`).join('')}</ul>`;

  showScreen('endingScreen');
}

// ===== 反詐回顧頁 =====
function renderReview() {
  const scenario = state.currentScenario;
  const identity = identityNames[state.playerIdentity] || state.playerIdentity;
  const region = regionNames[state.currentRegion] || state.currentRegion;
  const s = state.playerStats;

  let worstChoice = null, bestChoice = null;
  let worstScore = -Infinity, bestScore = Infinity;
  for (const log of state.choiceLog) {
    const e = log.effects || {};
    const dangerScore = (e.riskScore || 0) - (e.information || 0) - (e.alertness || 0) + (-(e.money || 0));
    if (dangerScore > worstScore) { worstScore = dangerScore; worstChoice = log; }
    if (dangerScore < bestScore) { bestScore = dangerScore; bestChoice = log; }
  }

  const reviewHtml = `
    <div class="review-card">
      <h4>🎮 本局資料</h4>
      <p><strong>身份：</strong>${identity}</p>
      <p><strong>地區：</strong>${region}</p>
      <p><strong>遇到的騙局：</strong>${scenario ? scenario.scamType : '—'}</p>
      <p><strong>好選擇：</strong>${state.goodChoices} 次 &nbsp;|&nbsp; <strong>危險選擇：</strong>${state.badChoices} 次</p>
      <p><strong>獲得 XP：</strong>${state.xp} &nbsp;|&nbsp; <strong>等級：</strong>${levelTitles[state.level-1]}</p>
    </div>

    <div class="review-card">
      <h4>⚠️ 這局的詐騙紅旗</h4>
      <ul>
        ${(scenario && scenario.redFlags || []).map(f => `<li>${f}</li>`).join('')}
      </ul>
    </div>

    <div class="review-card">
      <h4>🔍 你的選擇分析</h4>
      ${worstChoice ? `
        <p style="margin-bottom:6px;font-size:0.82rem;color:var(--text-muted);">最危險的一關：</p>
        <div class="review-highlight">「${worstChoice.choiceText}」<br><small>${worstChoice.feedback || ''}</small></div>
      ` : ''}
      ${bestChoice && bestChoice !== worstChoice ? `
        <p style="margin-top:10px;margin-bottom:6px;font-size:0.82rem;color:var(--text-muted);">最漂亮的操作：</p>
        <div class="review-good">「${bestChoice.choiceText}」<br><small>${bestChoice.feedback || ''}</small></div>
      ` : ''}
    </div>

    <div class="review-card">
      <h4>✅ 正確查證方式</h4>
      <ul>
        ${(scenario && scenario.officialChannels || []).map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>

    <div class="review-card">
      <h4>📊 最終數值</h4>
      <p>💰 金錢：${Math.round(s.money)} &nbsp;|&nbsp; 👁️ 警覺：${Math.round(s.alertness)} &nbsp;|&nbsp; 📋 資訊：${Math.round(s.information)}</p>
      <p>⚠️ 風險分：${Math.round(s.riskScore)} &nbsp;|&nbsp; 😰 壓力：${Math.round(s.stress)}</p>
    </div>

    <div class="review-reminder">
      <p>💡 越是催你立刻操作，越要先停下來查。<br>真正的官方機構，不怕你核實。</p>
    </div>
  `;

  document.getElementById('reviewContent').innerHTML = reviewHtml;
}

// ===== 重新開始 =====
function restartGame() {
  clearCountdown();
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

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  const reviewBtn = document.querySelector('#endingScreen .btn-primary');
  if (reviewBtn) {
    reviewBtn.onclick = () => { renderReview(); showScreen('reviewScreen'); };
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
