// ===== 多語言系統 =====
const LANG_KEY = 'antiscam_lang';

// 當前語言
let currentLang = localStorage.getItem(LANG_KEY) || 'zh';

// ===== 翻譯字典 =====
const translations = {
  zh: {
    // 開始頁
    gameTitle: '別急，先查證',
    gameSubtitle: '反詐騙互動闖關遊戲',
    gameDesc: '騙子最怕你花3秒鐘查一查。<br>在真實情境中做選擇——你能識破幾關？',
    tag6Levels: '🎮 6關闖關模式',
    tagXP: '⚡ XP 成就系統',
    tag5Regions: '🌍 5大地區場景',
    btnStart: '開始闖關！',
    btnContinue: '▶ 繼續上次進度',
    btnViewEndings: '🏅 查看已解鎖結局',
    gameNote: '免登入 · 約 12 分鐘 · 新生必玩',

    // 身份選擇頁
    step1of2: '第 1 步 / 2',
    selectRole: '選擇你的角色',
    selectRoleDesc: '不同身份會遇到不同的騙局套路，影響初始屬性',
    identityMainland: '中國大陸學生',
    identityMainlandDesc: '微信、支付寶、快遞、電商是日常。在境外可能面對語言壓力和身份焦慮，是騙子最愛盯上的目標。',
    identityMainlandTag1: '微信/支付寶',
    identityMainlandTag2: '快遞/電商',
    identityMainlandTag3: '校園環境',
    identityHMT: '港澳台學生',
    identityHMTDesc: '熟悉本地銀行、LINE 和學校電郵。但假銀行短訊、假客服電話依然可以偽裝得非常真實。',
    identityHMTTag1: 'WhatsApp/LINE',
    identityHMTTag2: '銀行 App',
    identityHMTTag3: '學校電郵',

    // 地區選擇頁
    step2of2: '第 2 步 / 2',
    selectMap: '選擇你的地圖',
    selectMapDesc: '不同地區解鎖不同的騙局劇情，每局 6 關',
    regionMainland: '中國大陸',
    regionMainlandDesc: '快遞釣魚、冒充客服',
    regionMainlandTag: '🆓 基礎關卡',
    regionHK: '港澳',
    regionHKDesc: '假銀行短訊、釣魚網站',
    regionHKTag: '💳 金融場景',
    regionTaiwan: '台灣',
    regionTaiwanDesc: 'ATM 解除分期詐騙',
    regionTaiwanTag: '🏧 高壓場景',
    regionWest: '歐美',
    regionWestDesc: '假移民局電話詐騙',
    regionWestTag: '🌐 語言挑戰',
    regionSEA: '東南亞',
    regionSEADesc: '旅遊訂房釣魚詐騙',
    regionSEATag: '🧳 旅行場景',
    btnBack: '← 返回',

    // 開場頁
    introTitle: '你的冒險開始了！',
    missionPreview: '完成所有關卡，解鎖你的反詐等級和成就！',
    initialStats: '初始屬性加成',
    standardInit: '標準初始狀態',
    btnGo: '出發！→',

    // 遊戲頁
    stageNames: ['', '第一關', '第二關', '第三關', '第四關', '第五關', '第六關'],
    sceneProgress: '關卡',
    statMoney: '💰 金錢',
    statAlertness: '👁️ 警覺',
    statTrust: '🤝 信任',
    statStress: '😰 壓力',
    statInfo: '📋 資訊',
    statRisk: '⚠️ 風險分',
    statLocal: '🏠 本地熟悉',
    statLang: '🔤 語言壓力',
    statIdentity: '🪪 身份焦慮',
    countdownLabel: '⏱ 限時選擇',
    timeUpMsg: '⏰ 時間到！你猶豫了太久，壓力之下做了衝動決定……',
    noScenario: '此地區暫無劇情，請選擇其他地區。',
    feedbackGoodFallback: '✅ 正確。你選擇了更安全、可核實的官方渠道。',
    feedbackBadFallback: '⚠️ 這個選擇會增加風險。先停下來，再從官方渠道核實。',
    feedbackMidFallback: '🤔 這能避開部分風險，但主動查證會更安全。',

    // 場景類型
    sceneTypeMessage: '📱 訊息通知',
    sceneTypeChat: '💬 聊天',
    sceneTypePhone: '📞 來電',
    sceneTypeEmail: '📧 電郵',
    sceneTypeWebpage: '🌐 網頁',
    sceneTypeSocial: '📣 社交貼文',
    sceneTypeResult: '✅ 核實結果',
    sceneTypeEnding: '🏁 通關',
    sceneAlert: '🚨 警報！',
    visualSenderFallback: '未核實的發件人',
    visualCallerFallback: '未知來電',
    visualAppFallback: '聊天',
    visualContentFallback: '此訊息以當地語言顯示；翻譯內容請參考上方場景說明。',
    visualChatFallback: '此對話以當地語言顯示；翻譯內容請參考上方場景說明。',

    // 結局頁
    endingScoreUnit: '分',
    endingAchievements: '🏅 本局成就',
    endingNoAchievement: '這局沒有解鎖成就，再玩一次試試！',
    endingAdvice: '💡 反詐小知識',
    endingAdviceItems: ['遇到催促時先停下來，不要立即付款或提交資料。', '關閉對方提供的連結，再自行打開官方 App 或撥打官方電話核實。', '如果已經付款或洩露資料，立即聯絡銀行和警方並保留記錄。'],
    endingProgressTitle: '🏅 結局收集進度',
    endingProgressText: '已解鎖',
    endingProgressOf: '/',
    endingProgressEndings: '種結局',
    endingLocked: '???',
    btnReview: '📋 查看回顧',
    btnReplay: '🔄 再玩一次',

    // 回顧頁
    reviewTitle: '🔍 反詐回顧',
    reviewGameData: '🎮 本局資料',
    reviewIdentity: '身份：',
    reviewRegion: '地區：',
    reviewScamType: '遇到的騙局：',
    reviewGoodChoices: '好選擇：',
    reviewBadChoices: '次',
    reviewBadChoicesLabel: '危險選擇：',
    reviewXP: '獲得 XP：',
    reviewLevel: '等級：',
    reviewRedFlags: '⚠️ 這局的詐騙紅旗',
    reviewChoiceAnalysis: '🔍 你的選擇分析',
    reviewWorstChoice: '最危險的一關：',
    reviewBestChoice: '最漂亮的操作：',
    reviewVerifyMethod: '✅ 正確查證方式',
    reviewFinalStats: '📊 最終數值',
    reviewMoney: '💰 金錢：',
    reviewAlertness: '👁️ 警覺：',
    reviewInfo: '📋 資訊：',
    reviewRisk: '⚠️ 風險分：',
    reviewStress: '😰 壓力：',
    reviewReminder: '💡 越是催你立刻操作，越要先停下來查。<br>真正的官方機構，不怕你核實。',
    btnReplay2: '🔄 再玩一次',

    // 結局收集彈窗
    endingCollectionTitle: '🏅 結局收集進度',

    // 成就
    achievementUnlock: '成就解鎖：',
    xpGain: '學到了！',
    xpGoodChoice: '✅ 好選擇！',

    // 身份名稱
    identityMainlandName: '中國大陸學生',
    identityHMTName: '港澳台學生',

    // 地區名稱
    regionMainlandName: '中國大陸',
    regionHKName: '港澳',
    regionTaiwanName: '台灣',
    regionWestName: '歐美',
    regionSEAName: '東南亞',

    // 語言切換
    switchLang: 'English',
    langLabel: '語言',
  },

  en: {
    // Start page
    gameTitle: 'Wait, Verify First',
    gameSubtitle: 'Anti-Scam Interactive Game',
    gameDesc: 'Scammers fear you taking 3 seconds to check.<br>Make choices in real scenarios — how many can you see through?',
    tag6Levels: '🎮 6-Level Mode',
    tagXP: '⚡ XP Achievement System',
    tag5Regions: '🌍 5 Regional Scenarios',
    btnStart: 'Start Game!',
    btnContinue: '▶ Continue Previous Progress',
    btnViewEndings: '🏅 View Unlocked Endings',
    gameNote: 'No login · ~12 min · Must-play for freshmen',

    // Identity selection
    step1of2: 'Step 1 / 2',
    selectRole: 'Choose Your Role',
    selectRoleDesc: 'Different identities face different scam tactics, affecting initial stats',
    identityMainland: 'Mainland China Student',
    identityMainlandDesc: 'WeChat, Alipay, delivery, e-commerce are daily life. May face language pressure and identity anxiety abroad — prime scam targets.',
    identityMainlandTag1: 'WeChat/Alipay',
    identityMainlandTag2: 'Delivery/E-commerce',
    identityMainlandTag3: 'Campus Life',
    identityHMT: 'HK/Macau/Taiwan Student',
    identityHMTDesc: 'Familiar with local banks, LINE, and school emails. But fake bank SMS and fake customer service calls can still look very real.',
    identityHMTTag1: 'WhatsApp/LINE',
    identityHMTTag2: 'Banking App',
    identityHMTTag3: 'School Email',

    // Region selection
    step2of2: 'Step 2 / 2',
    selectMap: 'Choose Your Map',
    selectMapDesc: 'Different regions unlock different scam stories, 6 levels each',
    regionMainland: 'Mainland China',
    regionMainlandDesc: 'Delivery phishing, fake customer service',
    regionMainlandTag: '🆓 Basic Level',
    regionHK: 'Hong Kong & Macau',
    regionHKDesc: 'Fake bank SMS, phishing websites',
    regionHKTag: '💳 Financial Scenarios',
    regionTaiwan: 'Taiwan',
    regionTaiwanDesc: 'ATM installment reversal scam',
    regionTaiwanTag: '🏧 High Pressure',
    regionWest: 'Western Countries',
    regionWestDesc: 'Fake immigration phone scam',
    regionWestTag: '🌐 Language Challenge',
    regionSEA: 'Southeast Asia',
    regionSEADesc: 'Travel booking phishing scam',
    regionSEATag: '🧳 Travel Scenarios',
    btnBack: '← Back',

    // Intro page
    introTitle: 'Your Adventure Begins!',
    missionPreview: 'Complete all levels to unlock your anti-scam rank and achievements!',
    initialStats: 'Initial Stat Modifiers',
    standardInit: 'Standard Initial State',
    btnGo: 'Go! →',

    // Game page
    stageNames: ['', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'Level 6'],
    sceneProgress: 'Level',
    statMoney: '💰 Money',
    statAlertness: '👁️ Alertness',
    statTrust: '🤝 Trust',
    statStress: '😰 Stress',
    statInfo: '📋 Info',
    statRisk: '⚠️ Risk Score',
    statLocal: '🏠 Local Familiarity',
    statLang: '🔤 Language Pressure',
    statIdentity: '🪪 Identity Anxiety',
    countdownLabel: '⏱ Time Limit',
    timeUpMsg: '⏰ Time\'s up! You hesitated too long and made an impulsive decision under pressure...',
    noScenario: 'No scenario is available for this region yet. Please choose another region.',
    feedbackGoodFallback: '✅ Good choice. You used a safer, verifiable official channel.',
    feedbackBadFallback: '⚠️ This choice increases your risk. Pause and verify through an official channel.',
    feedbackMidFallback: '🤔 This avoids some risk, but actively verifying would be safer.',

    // Scene types
    sceneTypeMessage: '📱 Message',
    sceneTypeChat: '💬 Chat',
    sceneTypePhone: '📞 Incoming Call',
    sceneTypeEmail: '📧 Email',
    sceneTypeWebpage: '🌐 Webpage',
    sceneTypeSocial: '📣 Social Post',
    sceneTypeResult: '✅ Verification Result',
    sceneTypeEnding: '🏁 Complete',
    sceneAlert: '🚨 ALERT!',
    visualSenderFallback: 'Unverified sender',
    visualCallerFallback: 'Unknown caller',
    visualAppFallback: 'Chat',
    visualContentFallback: 'This message was received in the local language. See the translated scenario above for its meaning.',
    visualChatFallback: 'This chat is in the local language. See the translated scenario above for its meaning.',

    // Ending page
    endingScoreUnit: 'pts',
    endingAchievements: '🏅 Achievements',
    endingNoAchievement: 'No achievements this round, try again!',
    endingAdvice: '💡 Anti-Scam Tips',
    endingAdviceItems: ['Pause whenever someone rushes you; do not pay or submit information immediately.', 'Close links they provide, then verify through an official app or phone number you find yourself.', 'If you paid or exposed data, contact your bank and the police immediately and keep all records.'],
    endingProgressTitle: '🏅 Ending Collection Progress',
    endingProgressText: 'Unlocked',
    endingProgressOf: '/',
    endingProgressEndings: 'endings',
    endingLocked: '???',
    btnReview: '📋 View Review',
    btnReplay: '🔄 Play Again',

    // Review page
    reviewTitle: '🔍 Anti-Scam Review',
    reviewGameData: '🎮 Game Data',
    reviewIdentity: 'Identity: ',
    reviewRegion: 'Region: ',
    reviewScamType: 'Scam Encountered: ',
    reviewGoodChoices: 'Good Choices: ',
    reviewBadChoices: 'times',
    reviewBadChoicesLabel: 'Dangerous Choices: ',
    reviewXP: 'XP Earned: ',
    reviewLevel: 'Level: ',
    reviewRedFlags: '⚠️ Scam Red Flags',
    reviewChoiceAnalysis: '🔍 Your Choice Analysis',
    reviewWorstChoice: 'Most Dangerous Move:',
    reviewBestChoice: 'Best Move:',
    reviewVerifyMethod: '✅ Proper Verification Methods',
    reviewFinalStats: '📊 Final Stats',
    reviewMoney: '💰 Money: ',
    reviewAlertness: '👁️ Alertness: ',
    reviewInfo: '📋 Info: ',
    reviewRisk: '⚠️ Risk Score: ',
    reviewStress: '😰 Stress: ',
    reviewReminder: '💡 The more they rush you, the more you need to pause and verify.<br>Real authorities are never afraid of you checking.',
    btnReplay2: '🔄 Play Again',

    // Ending collection popup
    endingCollectionTitle: '🏅 Ending Collection Progress',

    // Achievements
    achievementUnlock: 'Achievement Unlocked: ',
    xpGain: 'Lesson learned!',
    xpGoodChoice: '✅ Good choice!',

    // Identity names
    identityMainlandName: 'Mainland China Student',
    identityHMTName: 'HK/Macau/Taiwan Student',

    // Region names
    regionMainlandName: 'Mainland China',
    regionHKName: 'Hong Kong & Macau',
    regionTaiwanName: 'Taiwan',
    regionWestName: 'Western Countries',
    regionSEAName: 'Southeast Asia',

    // Language switch
    switchLang: '中文',
    langLabel: 'Language',
  }
};

// ===== 翻譯函數 =====
function t(key, ...args) {
  const lang = currentLang;
  let text = translations[lang] && translations[lang][key];
  if (text === undefined) {
    // fallback to zh
    text = translations.zh[key];
  }
  if (text === undefined) return key;
  // 替換 %s 佔位符
  if (args.length > 0) {
    let i = 0;
    text = text.replace(/%s/g, () => args[i++]);
  }
  return text;
}

// ===== 動態資料翻譯（支援 textEn/titleEn/feedbackEn 等字段）=====
function tField(obj, field = 'text') {
  if (!obj) return '';
  const localizedField = currentLang === 'en' ? `${field}En` : field;
  const localizedValue = obj[localizedField];
  if (localizedValue !== undefined && localizedValue !== null) return localizedValue;
  if (currentLang === 'en' && field === 'feedback' && obj[field]) {
    const suffix = obj.feedbackType === 'good' ? 'Good' : obj.feedbackType === 'bad' ? 'Bad' : 'Mid';
    return t(`feedback${suffix}Fallback`);
  }
  return obj[field] !== undefined && obj[field] !== null ? obj[field] : '';
}

function tText(obj) {
  return tField(obj, 'text');
}

// ===== 切換語言 =====
function switchLanguage() {
  setLanguage(currentLang === 'zh' ? 'en' : 'zh');
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem(LANG_KEY, currentLang);
  applyLanguage();
}

function getCurrentLang() {
  return currentLang;
}

// ===== 應用語言到所有靜態元素 =====
function applyLanguage() {
  // 更新所有 data-i18n 元素
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.innerHTML = t(key);
  });

  // 更新所有 data-i18n-placeholder 元素
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // 更新語言選項狀態
  document.querySelectorAll('.lang-option').forEach(button => {
    const isActive = button.dataset.lang === currentLang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  // 更新語言標籤
  const langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = t('langLabel');

  // 更新 html lang 屬性
  document.documentElement.lang = currentLang === 'zh' ? 'zh-TW' : 'en';

  // 更新當前正在顯示的動態內容（題目、選項、回饋、結局等）
  if (typeof refreshLocalizedContent === 'function') refreshLocalizedContent();
}

// ===== 身份/地區名稱翻譯 =====
function getIdentityName(id) {
  const map = {
    mainland_student: 'identityMainlandName',
    hmt_student: 'identityHMTName'
  };
  return t(map[id] || id);
}

function getRegionName(id) {
  const map = {
    mainland_china: 'regionMainlandName',
    hong_kong_macao: 'regionHKName',
    taiwan: 'regionTaiwanName',
    western_countries: 'regionWestName',
    southeast_asia: 'regionSEAName'
  };
  return t(map[id] || id);
}

// ===== 初始化語言 =====
document.addEventListener('DOMContentLoaded', () => {
  applyLanguage();
});
