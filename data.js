// ===== 身份開場文字 =====
const introTexts = {
  mainland_student: {
    mainland_china: "你是剛入學的大一新生，宿舍的快遞還沒認清楚幾個，手機每天幾十條通知。今天你正在圖書館準備明天的課，手機又響了——這次感覺有點不對勁。",
    hong_kong_macao: "你剛到港澳讀大學，還在適應這裡的英文電郵和銀行 App。學校系統、宿舍帳單、實習申請，所有事情都要靠手機搞定。但有些訊息，看起來比你想的更危險。",
    taiwan: "交換生的第一個月，你連 711 怎麼結帳都還在研究，結果就收到了一通「客服電話」。對方說的話你大概聽懂了七八成，但感覺哪裡有點怪……",
    western_countries: "留學第一年，簽證焦慮、英文壓力、時差還沒調好。這時候突然接到一通聲稱是「移民局」的電話——不管你多理性，聽到「deportation」這個詞，手腳還是涼了。",
    southeast_asia: "你跟同學一起去東南亞旅遊，剛下飛機就收到了一條讓你心跳加速的訊息。人在異鄉，語言不通，你只想趕快把事情搞定——但越急越容易踩坑。"
  },
  hmt_student: {
    mainland_china: "你是港澳台學生，到內地讀書已經一個學期了，微信和支付寶算是會用了。但有些「官方通知」看起來特別正式，一不小心就會被繞進去。",
    hong_kong_macao: "你在本地讀大學，住慣了，熟悉這裡的每一個銀行和 App。但正因為熟悉，有時候反而容易放鬆警惕——假的東西，也可以做得像模像樣。",
    taiwan: "在台灣讀書，LINE、蝦皮、超商付款都是日常。你以為自己夠熟悉這套系統了，但騙子也一樣熟悉，甚至比你更熟悉。",
    western_countries: "你在海外讀書，已經第二年了。租房、簽證、銀行帳戶，這些坑你都踩過一遍。但詐騙的形式一直在變，有些手法，就算是老生也可能第一次遇到。",
    southeast_asia: "這趟旅行你計劃了很久，機票和酒店都提前訂好了。但剛到目的地，就有事情不按計劃走——冷靜一下，先查清楚再行動。"
  }
};

// ===== 身份修正 =====
const identityModifiers = {
  mainland_student: { alertness: 5, information: 5, localFamiliarity: 0, languagePressure: 0, identityAnxiety: 5 },
  hmt_student: { alertness: 5, information: 0, localFamiliarity: 0, languagePressure: 0, identityAnxiety: 5 }
};

// ===== 身份 × 地區交互修正 =====
const regionModifiers = {
  mainland_student: {
    mainland_china:     { localFamiliarity: 30, languagePressure: -10, identityAnxiety: -5 },
    hong_kong_macao:    { localFamiliarity: -15, languagePressure: 15, identityAnxiety: 10 },
    taiwan:             { localFamiliarity: -20, languagePressure: 10, identityAnxiety: 15 },
    western_countries:  { localFamiliarity: -30, languagePressure: 30, identityAnxiety: 35 },
    southeast_asia:     { localFamiliarity: -25, languagePressure: 25, identityAnxiety: 25 }
  },
  hmt_student: {
    mainland_china:     { localFamiliarity: -25, languagePressure: 10, identityAnxiety: 20 },
    hong_kong_macao:    { localFamiliarity: 30, languagePressure: -10, identityAnxiety: -5 },
    taiwan:             { localFamiliarity: 10, languagePressure: -5, identityAnxiety: 0 },
    western_countries:  { localFamiliarity: -25, languagePressure: 25, identityAnxiety: 30 },
    southeast_asia:     { localFamiliarity: -25, languagePressure: 20, identityAnxiety: 25 }
  }
};

// ===== 地區顯示名稱 =====
const regionNames = {
  mainland_china: "中國大陸",
  hong_kong_macao: "港澳",
  taiwan: "台灣",
  western_countries: "歐美",
  southeast_asia: "東南亞"
};

const identityNames = {
  mainland_student: "中國大陸學生",
  hmt_student: "港澳台學生"
};

// ===== 結局資料 =====
const endings = [
  {
    id: "ending_deep_scammed",
    icon: "💸",
    title: "被騙了，但這不是你的錯",
    color: "#F87171",
    condition: s => s.money <= 10 && s.riskScore >= 70,
    description: "你在連環的壓力下連續做出了危險決定，損失不小。但說真的——這些騙局設計得非常精密，針對的就是剛進大學、正在適應新環境的你。",
    advice: [
      "騙子刻意製造「再不處理就來不及」的感覺，目的就是讓你沒時間思考。",
      "任何要你立刻轉帳或填銀行卡的，先掛電話、關頁面，再用官方渠道查。",
      "已經被騙了也不要慌，立刻聯絡銀行凍結，同時向警方報案，保留所有記錄。",
      "被騙不代表你笨，代表你遇到了真正的職業騙子。下次你一定識得出來。"
    ]
  },
  {
    id: "ending_high_risk_trap",
    icon: "⛔",
    title: "差點中招",
    color: "#EF4444",
    condition: s => s.riskScore >= 80 && s.information <= 30,
    description: "你走在一個非常高風險的路上，而且手上掌握的資訊很少。這種組合是騙子最喜歡的——什麼都不確定，只能聽對方說。",
    advice: [
      "資訊越少，越容易被帶著走。遇到任何要求，先搜索，再決定。",
      "護照、簽證、身份文件這些東西，提供之前一定要確認對方是誰。",
      "學校的 International Office 和使領館，是海外學生最可靠的求助點。"
    ]
  },
  {
    id: "ending_anti_scam_expert",
    icon: "🏆",
    title: "反詐達人，完全沒被騙到",
    color: "#34D399",
    condition: s => s.information >= 75 && s.alertness >= 70 && s.money >= 70,
    description: "你沒有上當，還把整件事查清楚了。你識別出了限時話術、假連結和身份偽裝，並且每次都選擇從官方渠道核實。教科書級別的操作。",
    advice: [
      "你已經掌握了最重要的反詐技能：不管對方說什麼，先掛電話，自己查。",
      "真的官方機構，不會怕你核實。怕你查的，才是騙子。",
      "把這個思路分享給你的室友和同學，多一個人知道，少一個人被騙。"
    ]
  },
  {
    id: "ending_calm_verifier",
    icon: "🧘",
    title: "沉住氣了，做得不錯",
    color: "#60A5FA",
    condition: s => s.information >= 65 && s.riskScore <= 35,
    description: "你沒有急著跟著對方走，而是選擇先查清楚。結果發現——果然是詐騙。這種「停一下」的習慣，比你想像的更難得。",
    advice: [
      "你最大的優點是不被「緊迫感」帶走。這個習慣要繼續保持。",
      "下次遇到類似情況，也可以直接搜索「XX 是詐騙嗎」，通常能找到一堆受害者分享。",
      "各地的反詐騙熱線都值得存到手機裡：大陸 96110，台灣 165，香港 18222。"
    ]
  },
  {
    id: "ending_over_suspicious",
    icon: "🤨",
    title: "太多疑了，啥都沒查",
    color: "#A78BFA",
    condition: s => s.trust <= 15 && s.information <= 40,
    description: "你對所有事情都保持懷疑，但懷疑本身不等於安全。你沒有主動去核實，只是選擇不理——萬一真的有問題，你也不知道。",
    advice: [
      "反詐的正確姿勢不是「拒絕一切」，而是「懂得核實」。",
      "懷疑訊息是對的，但下一步應該是查——打官方電話，開官方 App，不是直接忽略。",
      "有些真正重要的通知（比如學校、銀行）也可能因為你一直忽略而錯過。"
    ]
  },
  {
    id: "ending_data_leak",
    icon: "🔓",
    title: "錢沒丟，但資料可能洩露了",
    color: "#FBBF24",
    condition: s => s.riskScore >= 45 && s.money >= 70,
    description: "你的帳戶餘額沒有直接損失，但你可能在某個環節洩露了個人資料。騙子拿到你的資訊，可以慢慢用——有時候影響比當場轉帳還大。",
    advice: [
      "沒有損失金錢，不代表安全。手機號、身份證號、銀行卡號一旦洩露，後患很多。",
      "建議立刻更改相關帳戶密碼，並告知銀行留意異常操作。",
      "以後在任何非官方頁面填資料之前，先看清楚網址域名。"
    ]
  },
  {
    id: "ending_small_loss",
    icon: "💰",
    title: "損失了一點，但及時踩了剎車",
    color: "#FB923C",
    condition: s => s.money < 70 && s.money > 10,
    description: "你在某個關鍵時刻沒有及時識破，造成了一些損失。但好在你及時停手了，沒有繼續陷進去。",
    advice: [
      "及時停損比繼續投入重要一百倍。「已經虧了，再投一點說不定能回本」是騙子最常用的話術。",
      "遇到損失，第一時間聯絡銀行，第二時間報警，保留所有截圖和通話記錄。",
      "下次遇到要求轉帳或填卡號的情況，無論理由多充分，先掛電話再說。"
    ]
  },
  {
    id: "ending_safe_but_lucky",
    icon: "😅",
    title: "這次沒事，但不是因為你夠厲害",
    color: "#38BDF8",
    condition: s => true,
    description: "你沒有受到重大損失，但說實話，有幾個關鍵判斷更像是運氣，而不是你主動識別出來的。下次碰到更精心設計的騙局，可能就不那麼幸運了。",
    advice: [
      "運氣不是反詐技能，主動查證才是。",
      "下次遇到類似情況，試著主動搜索、打官方電話，而不是靠感覺判斷。",
      "把各地反詐熱線存起來：大陸 96110，台灣 165，香港 18222——以備不時之需。"
    ]
  }
];

// ===== 劇情庫 =====
const scenarioLibrary = {

  // ==================== 中國大陸 ====================
  mainland_china: [
    {
      id: "cn_express_address_problem",
      region: "mainland_china",
      title: "快遞釣魚：連環話術",
      scamType: "快遞釣魚 + 假客服二次施壓詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: [
        "短訊連結域名不是官方快遞公司（cn-track.xyz 不是順豐/中通域名）",
        "填寫資料後「官方客服」打電話跟進——真正的快遞客服不會主動打電話催你填資料",
        "「客服」掌握你的姓名和部分快遞單號——這些資料可能早已洩露",
        "要求輸入銀行卡號和驗證碼才能「重新寄送」",
        "「今天 18:00 前」的限時壓力話術"
      ],
      officialChannels: [
        "直接打開快遞官方 App（順豐/中通/菜鳥）查詢包裹狀態",
        "自己搜索快遞公司官網電話，主動撥打客服確認",
        "永遠不要在短訊連結的頁面填寫銀行卡或驗證碼"
      ],
      pressureSource: ["包裹退回壓力", "限時壓力", "假客服二次施壓"],
      scenes: [
        // ── 場景1：鋪墊——收到可疑短訊 ──
        {
          id: "cn_s1_sms",
          type: "message",
          speaker: "system",
          text: "下午四點，你正在宿舍背單詞。你確實在等一個網購包裹，所以這條短訊第一眼看起來好像是真的。",
          visual: {
            type: "sms",
            sender: "【順豐快遞】",
            content: "尊敬的客戶，您的包裹因收件地址信息不完整，快遞員無法正常派送。請在今日18:00前點擊以下連結補充地址，否則將自動退回發件方。",
            link: "http://sf-update.cn-track.xyz/addr?id=8812"
          },
          choices: [
            {
              id: "cn_c1_click",
              text: "📲 點開連結看看，填一下地址應該沒事",
              effects: { riskScore: 20, information: -5 },
              nextSceneId: "cn_s2_fake_page",
              feedback: "⚠️ 注意看網址——「cn-track.xyz」完全不是順豐的域名（sf-express.com 才是）。點進去，你已經踏進了騙子的地盤。",
              feedbackType: "bad"
            },
            {
              id: "cn_c1_app",
              text: "📦 先不急，打開順豐 App 查一下包裹狀態",
              effects: { information: 20, alertness: 15, riskScore: -5 },
              nextSceneId: "cn_s2_app_check",
              feedback: "✅ 好習慣。官方 App 是唯一可靠的查詢方式，不管短訊怎麼說，先查 App。",
              feedbackType: "good"
            },
            {
              id: "cn_c1_ignore",
              text: "🙈 感覺像詐騙，先不管它",
              effects: { alertness: 5, stress: 5 },
              nextSceneId: "cn_s2_ignore_then",
              feedback: "🤔 不點連結是對的。但如果你真的有包裹在等，什麼都不查會讓你越來越焦慮。",
              feedbackType: "mid"
            },
            {
              id: "cn_c1_search",
              text: "🔍 搜索這個短訊，看看有沒有人反映過",
              effects: { information: 20, alertness: 15, riskScore: -5 },
              nextSceneId: "cn_s2_search_result",
              feedback: "✅ 聰明！搜索「快遞地址異常詐騙」，你會看到幾百個一模一樣的案例。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2A：點了連結——假頁面 ──
        {
          id: "cn_s2_fake_page",
          type: "webpage",
          speaker: "system",
          text: "頁面設計得很像快遞公司，UI 挺精緻的。但仔細看——網址欄顯示「cn-track.xyz」，不是任何一家快遞公司的官方域名。頁面要你填姓名、手機號、地址，還有一欄「身份驗證」，需要銀行卡號。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：cn-track.xyz（非官方！）\n正規順豐域名：sf-express.com\n\n表單內容：\n• 姓名、手機、地址（普通，但也是個資）\n• 銀行卡號 ← 快遞公司不需要這個！\n• 手機驗證碼 ← 填了等於授權轉帳"
          },
          choices: [
            {
              id: "cn_c2_fill_name_phone",
              text: "📝 姓名和手機填一下，銀行卡先不填",
              effects: { riskScore: 15, information: -10, stress: -5 },
              nextSceneId: "cn_s3_scammer_calls",
              feedback: "⚠️ 就算只填了姓名和手機，騙子也拿到了你的真實資料。接下來他們會「主動打電話跟進」。",
              feedbackType: "bad"
            },
            {
              id: "cn_c2_fill_all",
              text: "📝 全填上，包裹退回就麻煩了",
              effects: { money: -40, riskScore: 55, information: -20, stress: -10 },
              nextSceneId: "cn_s3_otp_demand",
              feedback: "❌ 銀行卡號 + 驗證碼，騙子直接就能登入你的網銀，你的帳戶已經不安全了。",
              feedbackType: "bad"
            },
            {
              id: "cn_c2_url_notice",
              text: "🔍 等等，這個網址根本不是順豐的……立刻關掉！",
              effects: { alertness: 25, information: 20, riskScore: -15 },
              nextSceneId: "cn_s3_verify_app",
              feedback: "✅ 你在這一關識破了！看域名是判斷釣魚網站最有效的方法。",
              feedbackType: "good"
            },
            {
              id: "cn_c2_ask_friend",
              text: "📸 截圖發給室友問問是不是真的",
              effects: { information: 10, socialPressure: 5 },
              nextSceneId: "cn_s3_roommate_reply",
              feedback: "🤔 找室友問是個好主意，但趁等回覆的時間別手賤亂填。",
              feedbackType: "mid"
            }
          ]
        },
        // ── 場景2B：查了 App ──
        {
          id: "cn_s2_app_check",
          type: "result",
          speaker: "system",
          text: "你打開順豐 App，輸入手機號查詢。App 顯示：包裹正常派送中，預計明天上午送到，沒有任何地址問題。你放下手機準備繼續學習——但十分鐘後，電話響了。",
          visual: {
            type: "safe_result",
            content: "📦 快遞狀態：正常派送中\n📍 地址：確認無誤\n🔔 預計到達：明日上午 09:00-12:00\n\n那條短訊是假的。但故事還沒完……"
          },
          choices: [
            {
              id: "cn_c2b_ignore_call",
              text: "📵 陌生號碼，不接",
              effects: { alertness: 10, riskScore: -5 },
              nextSceneId: "cn_s3_missed_call_msg",
              feedback: "✅ 不接陌生電話是個謹慎做法。但騙子留了語音，你要怎麼處理？",
              feedbackType: "good"
            },
            {
              id: "cn_c2b_answer_call",
              text: "📞 接了，對方說是「快遞客服」",
              effects: { stress: 10, riskScore: 10 },
              nextSceneId: "cn_s3_scammer_calls",
              feedback: "⚠️ 你查過了 App 知道包裹沒問題，但騙子還是打來了。保持警惕！",
              feedbackType: "mid"
            }
          ]
        },
        // ── 場景2C：搜索結果 ──
        {
          id: "cn_s2_search_result",
          type: "result",
          speaker: "system",
          text: "搜索結果第一條就是「快遞地址異常詐騙警示」，點進去一看：跟你收到的短訊幾乎一字不差，連連結格式都一樣。評論區幾百人說「差點上當」。你放下手機，但一小時後，電話響了——顯示「快遞客服」。",
          visual: {
            type: "safe_result",
            content: "🔍 搜索結果：\n\n「快遞地址異常詐騙」\n——這類短訊已被警方多次發文警示。\n連結域名特征：cn-track.xyz、kd-update.xyz\n\n但接下來騙子還有另一招……"
          },
          choices: [
            {
              id: "cn_c2c_answer",
              text: "📞 接電話，看看對方說什麼",
              effects: { stress: 10, riskScore: 10 },
              nextSceneId: "cn_s3_scammer_calls",
              feedback: "⚠️ 你有資訊優勢了，但騙子的電話更有說服力——準備好應對。",
              feedbackType: "mid"
            },
            {
              id: "cn_c2c_ignore",
              text: "📵 看到「快遞客服」顯示就不接，搜索這個號碼",
              effects: { alertness: 20, information: 15, riskScore: -10 },
              nextSceneId: "cn_s4_search_phone",
              feedback: "✅ 先搜索號碼是個很好的習慣。騙子喜歡偽裝成「客服顯示號碼」。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2D：沒管短訊 ──
        {
          id: "cn_s2_ignore_then",
          type: "result",
          speaker: "system",
          text: "你把短訊放在一邊。半小時後，你開始擔心：萬一包裹真的被退回怎麼辦？買的東西挺貴的。這時候電話又響了，顯示「快遞客服」。",
          visual: { type: "safe_result", content: "📱 來電：快遞客服\n\n你的焦慮正好給了騙子可乘之機——\n他們已經知道你收過那條短訊，現在要「跟進確認」。" },
          choices: [
            {
              id: "cn_c2d_answer",
              text: "📞 先接了，聽聽什麼事",
              effects: { stress: 15, riskScore: 15 },
              nextSceneId: "cn_s3_scammer_calls",
              feedback: "⚠️ 你的焦慮讓你更容易被電話騙子說服。記住：你有權隨時掛電話。",
              feedbackType: "mid"
            },
            {
              id: "cn_c2d_app_now",
              text: "📦 等等，先打開快遞 App 查一下再說",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "cn_s2_app_check",
              feedback: "✅ 好！先查 App，有了真實資訊再決定要不要接電話。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3：騙子電話——加壓 ──
        {
          id: "cn_s3_scammer_calls",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "電話裡是一個普通話很標準的女聲，語氣像客服又像通知。她說話很快，你跟不上就插不進去。",
          visual: {
            type: "phone_call",
            caller: "顯示：順豐速運客服",
            content: "您好，我是順豐客服，您的包裹因為地址系統更新，必須在今晚12點前完成身份核驗，否則直接退回並收取退件費45元。核驗只需要一分鐘，請問您現在方便嗎？我來引導您操作。"
          },
          choices: [
            {
              id: "cn_c3_follow",
              text: "😰 好吧，你說怎麼操作？",
              effects: { stress: -10, riskScore: 25, information: -10 },
              nextSceneId: "cn_s4_ask_card",
              feedback: "⚠️ 你跟著對方走了。接下來她會一步步問你要資料。",
              feedbackType: "bad"
            },
            {
              id: "cn_c3_question",
              text: "🤔 我查過 App 了，包裹沒問題，你為什麼說地址有問題？",
              effects: { alertness: 15, stress: 10, riskScore: 5 },
              nextSceneId: "cn_s4_scammer_excuse",
              feedback: "🤔 好問題！騙子會有準備好的答案，但看她怎麼回應很能說明問題。",
              feedbackType: "mid"
            },
            {
              id: "cn_c3_hangup",
              text: "📵 掛電話，這個電話不對勁",
              effects: { alertness: 20, riskScore: -20, stress: -5 },
              nextSceneId: "cn_s4_after_hangup",
              feedback: "✅ 你掛了！掛電話不會有任何損失，騙子說的「不配合會怎樣」全是嚇你的。",
              feedbackType: "good"
            },
            {
              id: "cn_c3_verify_number",
              text: "🔍 先問她：你們的官方電話是多少？我查一下",
              effects: { alertness: 15, information: 15, riskScore: -5 },
              nextSceneId: "cn_s4_scammer_dodge",
              feedback: "✅ 要求對方提供可核實的信息，是判斷真假客服的好方法。看她怎麼回答。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3B：室友回覆 ──
        {
          id: "cn_s3_roommate_reply",
          type: "chat",
          speaker: "friend",
          text: "室友小王回覆了，但你發現他的判斷有點讓你意外。",
          visual: {
            type: "chat",
            app: "微信",
            appIcon: "💬",
            messages: [
              { type: "outgoing", name: "你", text: "[截圖：快遞網頁]" },
              { type: "incoming", name: "小王", text: "這個……不確定欸，我上週也收到類似的" },
              { type: "incoming", name: "小王", text: "我填了姓名和電話，後來沒事的" },
              { type: "incoming", name: "小王", text: "你就填一下地址應該沒事吧？銀行卡不填就好了" }
            ]
          },
          choices: [
            {
              id: "cn_c3r_trust_roommate",
              text: "😅 室友說沒事，那我就填地址和手機",
              effects: { riskScore: 15, information: -10, socialPressure: -10 },
              nextSceneId: "cn_s3_scammer_calls",
              feedback: "⚠️ 室友「上次沒事」不代表這次安全。你的手機號現在已在騙子資料庫裡，他們會打電話跟進。",
              feedbackType: "bad"
            },
            {
              id: "cn_c3r_own_research",
              text: "🔍 室友也不確定，我自己搜索一下再決定",
              effects: { information: 20, alertness: 10, riskScore: -5 },
              nextSceneId: "cn_s2_search_result",
              feedback: "✅ 不能靠別人的「我上次沒事」來判斷安全性。自己搜索才是正確的。",
              feedbackType: "good"
            },
            {
              id: "cn_c3r_app_check",
              text: "📦 算了，直接打開快遞 App 查包裹",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "cn_s2_app_check",
              feedback: "✅ 官方 App 比朋友的判斷更可靠。你做了正確的選擇。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3C：沒接電話後 ──
        {
          id: "cn_s3_missed_call_msg",
          type: "message",
          speaker: "system",
          text: "你沒接電話，對方留了語音：「您好，這裡是順豐客服，您有包裹需要地址核驗，請在今晚12點前回電，逾期作退件處理，感謝配合。」——聽起來還挺官方的。",
          visual: {
            type: "sms",
            sender: "語音留言",
            content: "「您好，這裡是順豐客服，您有包裹需要地址核驗，請在今晚12點前回電 136-XXXX-XXXX，逾期作退件處理，感謝配合。」"
          },
          choices: [
            {
              id: "cn_c3m_call_back",
              text: "📞 這個號碼聽起來挺正式，回電問一下",
              effects: { stress: 10, riskScore: 15 },
              nextSceneId: "cn_s3_scammer_calls",
              feedback: "⚠️ 注意！你是在回電給騙子的號碼，不是官方順豐電話。語音聽起來官方，但來電號碼可以偽裝。",
              feedbackType: "bad"
            },
            {
              id: "cn_c3m_official_check",
              text: "🔍 先搜索順豐官方客服電話，對比一下",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "cn_s4_search_phone",
              feedback: "✅ 對！順豐官方客服只有 95338，任何其他號碼都不可信。",
              feedbackType: "good"
            },
            {
              id: "cn_c3m_app_again",
              text: "📦 我 App 查過了包裹沒問題，這語音是假的，直接忽略",
              effects: { alertness: 15, information: 5, riskScore: -10 },
              nextSceneId: "cn_s4_after_hangup",
              feedback: "✅ 你有 App 的核實作支撐，判斷完全正確。語音留言是詐騙流程的一部分。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4A：騙子索要銀行卡 ──
        {
          id: "cn_s4_ask_card",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "對方引導你進入「核驗流程」，說為了確認你的身份，需要核對你的銀行卡尾號。",
          visual: {
            type: "phone_call",
            caller: "「順豐客服」",
            content: "好的，核驗一下您的銀行卡尾號就可以了，這是系統要求的標準流程，我們只核對最後四位數字。請問您的銀行卡尾號是多少？"
          },
          choices: [
            {
              id: "cn_c4a_give_tail",
              text: "😅 只是後四位嗎……那應該沒事，告訴她",
              effects: { riskScore: 20, information: -10 },
              nextSceneId: "cn_s5_full_card_demand",
              feedback: "⚠️ 後四位只是第一步。接下來她會說「確認不上，需要完整號碼」。這是套牌手法。",
              feedbackType: "bad"
            },
            {
              id: "cn_c4a_hangup_now",
              text: "📵 等等，客服怎麼需要銀行卡資料？掛電話！",
              effects: { alertness: 25, riskScore: -20 },
              nextSceneId: "cn_s4_after_hangup",
              feedback: "✅ 快遞客服處理地址問題，根本不需要任何銀行資料。這是詐騙的核心特徵！",
              feedbackType: "good"
            },
            {
              id: "cn_c4a_stall",
              text: "🤔 我說：等我查一下官方客服電話再回電",
              effects: { alertness: 20, information: 10, riskScore: -10 },
              nextSceneId: "cn_s4_search_phone",
              feedback: "✅ 要求暫停去核實，騙子通常會變得更急——這本身就說明問題了。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4B：騙子解釋 App 數據「延遲」──
        {
          id: "cn_s4_scammer_excuse",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "騙子沒有慌，她有備而來。",
          visual: {
            type: "phone_call",
            caller: "「順豐客服」",
            content: "您的 App 顯示的是舊數據，我們系統更新後地址格式有變更，App 的同步大概要 24 小時。您現在 App 看到「正常」，其實是昨天的狀態。如果您不信，可以致電確認，但今晚 12 點前不處理就會自動退件。"
          },
          choices: [
            {
              id: "cn_c4b_believe",
              text: "😟 好吧，聽起來說得通……那我怎麼核驗？",
              effects: { stress: -5, riskScore: 20, information: -10, trust: 10 },
              nextSceneId: "cn_s4_ask_card",
              feedback: "⚠️ 「App 數據延遲」是騙子應對「我查了 App」的標準台詞。他說得越流利越可疑。",
              feedbackType: "bad"
            },
            {
              id: "cn_c4b_test",
              text: "🔍 你說「可以致電確認」——那給我你們官方電話",
              effects: { alertness: 20, information: 15, riskScore: -5 },
              nextSceneId: "cn_s4_scammer_dodge",
              feedback: "✅ 你在測試他！正規客服能直接給你官方電話讓你驗證，騙子做不到。",
              feedbackType: "good"
            },
            {
              id: "cn_c4b_hangup",
              text: "📵 說得越多越像詐騙，掛電話",
              effects: { alertness: 25, riskScore: -20 },
              nextSceneId: "cn_s4_after_hangup",
              feedback: "✅ 正確！「系統更新延遲」是百搭藉口，用來推翻你用 App 核實的結果。掛掉是對的。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4C：騙子躲避提供官方電話 ──
        {
          id: "cn_s4_scammer_dodge",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你要求對方提供官方電話讓你核實，她的回答讓你心裡一涼。",
          visual: {
            type: "phone_call",
            caller: "「順豐客服」",
            content: "我這邊是系統分配的工單號，致電核實的話需要您重新排隊等候，最少 40 分鐘。您的包裹今晚12點截止，現在真的沒有時間讓您去排隊了。我現在可以幫您直接處理，配合的話五分鐘就好。"
          },
          choices: [
            {
              id: "cn_c4c_give_up",
              text: "😰 算了排隊太麻煩了，你幫我直接處理吧",
              effects: { riskScore: 25, stress: -5, information: -10 },
              nextSceneId: "cn_s4_ask_card",
              feedback: "⚠️ 「排隊太麻煩」正是騙子製造的心理壓力。他讓你覺得「配合他更省事」。",
              feedbackType: "bad"
            },
            {
              id: "cn_c4c_hangup_firm",
              text: "📵 你給不了官方電話——那你不是真的客服。掛了。",
              effects: { alertness: 30, information: 20, riskScore: -25 },
              nextSceneId: "cn_s4_after_hangup",
              feedback: "✅ 完美邏輯！真正的客服可以隨時給你官方聯絡方式。給不出來，就是騙子。",
              feedbackType: "good"
            },
            {
              id: "cn_c4c_call_official",
              text: "🔍 掛電話，自己搜索順豐官方客服致電",
              effects: { alertness: 25, information: 25, riskScore: -20 },
              nextSceneId: "cn_s4_search_phone",
              feedback: "✅ 這才是正確操作。順豐官方只有 95338，打過去兩分鐘就確認了。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4D：搜索電話號碼 ──
        {
          id: "cn_s4_search_phone",
          type: "result",
          speaker: "system",
          text: "你搜索了那個「客服電話」。結果出來了：",
          visual: {
            type: "warning_page",
            content: "🔍 搜索結果：\n\n「136-XXXX-XXXX 詐騙」——搜索結果一大把\n\n最新帖子（2小時前）：\n「接到這個號碼說是順豐客服，要求核驗銀行卡，差點上當！」\n\n⚠️ 順豐官方客服只有 95338\n其他聲稱「順豐」的號碼均為詐騙"
          },
          choices: [
            {
              id: "cn_c4d_confirmed",
              text: "✅ 確認是詐騙了，舉報這個號碼",
              effects: { alertness: 20, information: 20, riskScore: -15 },
              nextSceneId: "cn_s5_report",
              feedback: "✅ 你用搜索技巧識破了詐騙。舉報這個號碼，幫助保護下一個收到電話的人。",
              feedbackType: "good"
            },
            {
              id: "cn_c4d_call_real",
              text: "📞 打 95338 再確認一下包裹",
              effects: { alertness: 15, information: 15, riskScore: -10 },
              nextSceneId: "cn_s5_official_confirm",
              feedback: "✅ 雙重確認！打官方電話徹底安心。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4E：掛電話後 ──
        {
          id: "cn_s4_after_hangup",
          type: "result",
          speaker: "system",
          text: "你掛了電話。對方馬上再次來電，你沒接。然後發來一條短訊：「您已放棄核驗，包裹將按退件處理，退件費 45 元將從您的帳戶扣除。」——這條短訊是最後一次測試你的。",
          visual: {
            type: "sms",
            sender: "顯示：快遞客服",
            content: "您已放棄核驗，包裹將按退件處理。退件費 45 元將從您的帳戶扣除，如需撤銷請在 30 分鐘內點擊連結：http://sf-cancel.cn-track.xyz/fee"
          },
          choices: [
            {
              id: "cn_c4e_click_cancel",
              text: "😰 被扣款？！點連結看看怎麼撤銷",
              effects: { riskScore: 25, stress: 5, information: -10 },
              nextSceneId: "cn_s5_second_trap",
              feedback: "⚠️ 這是第二個陷阱。你已經識破了電話騙局，不要又被這條短訊拉回去。",
              feedbackType: "bad"
            },
            {
              id: "cn_c4e_app_confirm",
              text: "📦 打開 App 看一下帳戶，順豐扣款要通過官方 App 才有記錄",
              effects: { alertness: 25, information: 20, riskScore: -15 },
              nextSceneId: "cn_s5_official_confirm",
              feedback: "✅ 任何快遞費用都會在官方 App 裡有記錄。短訊裡的連結永遠不要點。",
              feedbackType: "good"
            },
            {
              id: "cn_c4e_ignore",
              text: "🙈 騙子最後的掙扎，無視它",
              effects: { alertness: 20, riskScore: -10 },
              nextSceneId: "cn_s5_official_confirm",
              feedback: "✅ 你識別了後續的短訊也是詐騙套路。沒有任何損失。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景5A：索要完整卡號 ──
        {
          id: "cn_s5_full_card_demand",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你告訴了對方銀行卡後四位，她說「後四位比對不上，可能是主副卡問題，需要完整卡號和驗證碼核對一下」。",
          visual: {
            type: "phone_call",
            caller: "「順豐客服」",
            content: "後四位顯示記錄有兩張卡，我這邊無法確認是哪一張，需要您提供完整卡號、有效期和驗證碼，系統才能匹配。這是系統要求的，我們是加密傳輸，完全安全的。"
          },
          choices: [
            {
              id: "cn_c5a_full_card",
              text: "😰 她說加密很安全……那就告訴她",
              effects: { money: -60, riskScore: 50, information: -20 },
              nextSceneId: "cn_s_end_loss",
              feedback: "❌ 「加密安全」是騙子百搭台詞。CVV + 卡號 + 有效期，等同於把你的信用卡拱手相讓。",
              feedbackType: "bad"
            },
            {
              id: "cn_c5a_refuse_hangup",
              text: "📵 等等——快遞核驗憑什麼要信用卡 CVV？掛了！",
              effects: { alertness: 30, riskScore: -25 },
              nextSceneId: "cn_s4_after_hangup",
              feedback: "✅ 你在最危險的一步識破了！CVV 是信用卡安全碼，任何真正的快遞服務都不需要這個。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景5B：第二個陷阱 ──
        {
          id: "cn_s5_second_trap",
          type: "webpage",
          speaker: "system",
          text: "你點開了「撤銷退件費」的連結，還是那個熟悉的假頁面，只不過這次頁面上方寫著「退款處理中，請輸入銀行卡確認身份，退款將在 5 分鐘內到帳」。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：sf-cancel.cn-track.xyz（同一個詐騙域名！）\n\n這次頁面說：輸入銀行卡號和驗證碼\n→「退款 45 元到你帳戶」\n\n事實：他們不是要退給你 45 元\n而是要盜走你帳戶裡所有的錢"
          },
          choices: [
            {
              id: "cn_c5b_fill_card",
              text: "💳 退款 45 元，輸入一下應該沒事",
              effects: { money: -60, riskScore: 50 },
              nextSceneId: "cn_s_end_loss",
              feedback: "❌ 「退小錢給你」是釣大魚的套路。你輸入卡號和驗證碼，他們拿走的是你帳戶全部餘額。",
              feedbackType: "bad"
            },
            {
              id: "cn_c5b_recognize",
              text: "🔍 這個域名跟之前那個一樣！這是同一個騙局！",
              effects: { alertness: 30, information: 20, riskScore: -20 },
              nextSceneId: "cn_s5_report",
              feedback: "✅ 你認出了同一個詐騙域名！這是一個連環局——短訊、電話、退款連結，都是同一夥人。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景5C：官方確認 ──
        {
          id: "cn_s5_official_confirm",
          type: "result",
          speaker: "system",
          text: "你打開順豐 App，查看帳戶和包裹狀態。一切完全正常——沒有任何費用、沒有任何退件記錄。你也搜索了那個「客服號碼」，確認是詐騙號碼。",
          visual: {
            type: "safe_result",
            content: "📦 包裹狀態：正常派送中\n💳 帳戶記錄：無任何異常費用\n\n🔍 那個「客服號碼」搜索結果：\n——已被多人舉報為快遞詐騙\n\n你全程沒有洩露任何資料。👏"
          },
          choices: [
            {
              id: "cn_c5c_report",
              text: "📢 舉報這個詐騙號碼和短訊連結",
              effects: { alertness: 15, information: 10 },
              nextSceneId: "cn_s5_report",
              feedback: "✅ 主動舉報，幫助警方追蹤和封鎖詐騙。",
              feedbackType: "good"
            },
            {
              id: "cn_c5c_done",
              text: "✅ 確認安全，繼續我的事",
              effects: { alertness: 10, stress: -10 },
              nextSceneId: "cn_s_end_safe",
              feedback: "✅ 全程清醒，一分損失都沒有。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景5D：舉報 ──
        {
          id: "cn_s5_report",
          type: "result",
          speaker: "system",
          text: "你決定舉報這整個詐騙流程，把短訊截圖和電話號碼都提交了。這一步很多人懶得做，但正是這些舉報資料，幫助警方封鎖和追蹤詐騙集團。",
          visual: {
            type: "safe_result",
            content: "🛡️ 舉報渠道：\n• 國家反詐中心 App → 「我要舉報」\n• 12321.cn（工信部）→ 舉報釣魚域名\n• 長按短訊 → 舉報垃圾短訊\n• 96110（反詐騙熱線）\n\n每一次舉報都在保護下一個可能被騙的人。"
          },
          choices: [
            {
              id: "cn_c5d_done",
              text: "📱 舉報完成，這類詐騙以後一眼就認出來了",
              effects: { alertness: 15, information: 10, riskScore: -5 },
              nextSceneId: "cn_s_end_safe",
              feedback: "✅ 識別 → 核實 → 舉報，你完成了最完整的應對流程。",
              feedbackType: "good"
            }
          ]
        },
        // ── 結局場景 ──
        {
          id: "cn_s_end_safe",
          type: "ending",
          speaker: "system",
          text: "你全程沒有點陌生連結，沒有洩露任何個人資料，也沒有按騙子的指示操作 ATM 或轉帳。你用官方 App 確認了包裹一切正常，識破了這個短訊＋電話的連環詐騙套路。",
          choices: [{ id: "cn_end_safe_go", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "cn_s_end_loss",
          type: "ending",
          speaker: "system",
          text: "幾分鐘後，銀行發來轉帳提醒——4,800 元、3,200 元，共兩筆，對方是陌生帳號。你打電話給順豐客服（95338），對方確認從未聯絡過你，也沒有發過那條短訊。你的銀行卡資料在一個假頁面和一通電話之間，就這樣交出去了。",
          choices: [{ id: "cn_end_loss_go", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        },
        {
          id: "cn_s_end_partial",
          type: "ending",
          speaker: "system",
          text: "你洩露了手機號和姓名，但沒有提供銀行卡。這次財務上沒有直接損失——但你的個人信息現在已在詐騙數據庫裡。接下來幾個月，你可能會收到更多「針對你」的詐騙電話，因為他們知道你是真實存在的目標。",
          choices: [{ id: "cn_end_partial_go", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "mid" }]
        }
      ]
    }
  ],

  // ==================== 港澳 ====================
  hong_kong_macao: [
    {
      id: "hkm_bank_security_sms",
      region: "hong_kong_macao",
      title: "銀行安全驗證：OTP 陷阱",
      scamType: "假銀行短訊 + 假客服電話 + OTP 釣魚",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: [
        "短訊連結域名「account-secure.net」不是 HSBC 官方（hsbc.com.hk）",
        "電話「客服」主動打來跟進，口音標準、說法流利，但無法提供可核實的工號",
        "要求輸入 OTP 一次性密碼——銀行客服絕對不會電話要你報 OTP",
        "「帳戶將在 30 分鐘內凍結」的緊迫話術",
        "對方知道你的帳戶尾號——這些資料可能已從其他平台洩露"
      ],
      officialChannels: [
        "打開 HSBC 官方 App（hsbchk.com.hk）直接查帳戶",
        "致電銀行卡背面客服電話——香港匯豐 2233 3000",
        "自己手動輸入官方網址，絕不點短訊連結"
      ],
      pressureSource: ["帳戶凍結壓力", "30 分鐘限時壓力", "假客服情感操控"],
      scenes: [
        // ── 場景1：鋪墊——收到銀行短訊 ──
        {
          id: "hkm_s1_sms",
          type: "message",
          speaker: "system",
          text: "你下課回到宿舍，準備打開 YouTube 放鬆一下。手機震了一下——看起來是 HSBC 發的短訊。你最近確實有刷過幾次卡，心裡稍微緊了一下。",
          visual: {
            type: "sms",
            sender: "HSBC-Alert",
            content: "We detected suspicious login from an overseas IP address. Your account may be compromised. Please verify your identity within 30 minutes to avoid suspension. Tap to verify:",
            link: "https://hsbc-hk-verify.account-secure.net/login"
          },
          choices: [
            {
              id: "hkm_c1_click",
              text: "📲 30 分鐘很急，先點連結看看怎麼回事",
              effects: { riskScore: 25, information: -10 },
              nextSceneId: "hkm_s2_fake_login",
              feedback: "⚠️ 仔細看網址——「account-secure.net」根本不是匯豐的域名。匯豐香港的官方域名是 hsbc.com.hk。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c1_app",
              text: "📱 不點連結，直接打開 HSBC App 查帳戶",
              effects: { information: 25, alertness: 15, riskScore: -10 },
              nextSceneId: "hkm_s2_app_normal",
              feedback: "✅ 正確！任何涉及帳戶的事，永遠從官方 App 入手，不要點短訊連結。",
              feedbackType: "good"
            },
            {
              id: "hkm_c1_call_bank",
              text: "📞 先不急，翻出銀行卡背面電話打過去",
              effects: { information: 30, alertness: 20, riskScore: -15 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 銀行卡背面的電話是最可靠的核實方式。任何懷疑，打過去兩分鐘就清楚。",
              feedbackType: "good"
            },
            {
              id: "hkm_c1_check_url",
              text: "🔍 先看一下這個連結的域名",
              effects: { alertness: 20, information: 15, riskScore: -5 },
              nextSceneId: "hkm_s2_url_analysis",
              feedback: "✅ 看域名是識別釣魚短訊最快的方法。你的直覺是對的。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2A：點了連結——假登入頁 ──
        {
          id: "hkm_s2_fake_login",
          type: "webpage",
          speaker: "system",
          text: "頁面打開了，設計得非常像 HSBC 官網——獅子標誌、紅白配色、英文界面。你幾乎要輸入密碼了，但突然瞄到網址欄。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：account-secure.net（偽裝頁面！）\n真正 HSBC 香港官網：hsbc.com.hk\n\n頁面要求：\n• Personal Internet Banking Username\n• Password\n• One-Time Password (OTP) ← 填了等於帳戶拱手相讓\n\n它還有倒計時：「Session expires in 18:32」"
          },
          choices: [
            {
              id: "hkm_c2_enter_all",
              text: "🔢 帳號密碼先填，OTP 等短訊來了再輸",
              effects: { riskScore: 30, information: -15 },
              nextSceneId: "hkm_s3_otp_arrives",
              feedback: "⚠️ 你已填入帳號密碼，騙子觸發了真正的 OTP 短訊到你手機——現在他們在等你把這個驗證碼也交出去。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c2_notice_url",
              text: "🔍 等等——「account-secure.net」不是 hsbc.com.hk！立刻關掉！",
              effects: { alertness: 30, information: 20, riskScore: -20 },
              nextSceneId: "hkm_s3_url_escape",
              feedback: "✅ 你在關鍵一刻識破了假網站！網址域名是防釣魚最有效的工具。",
              feedbackType: "good"
            },
            {
              id: "hkm_c2_call_now",
              text: "📞 先不填，打銀行官方電話確認再說",
              effects: { information: 25, alertness: 20, riskScore: -15 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 正確！暫停一下打電話，是在假網站前最好的選擇。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2B：查了 App——帳戶正常 ──
        {
          id: "hkm_s2_app_normal",
          type: "result",
          speaker: "system",
          text: "HSBC App 顯示帳戶完全正常，沒有任何異常登入記錄，也沒有任何安全警報。你放下心來——但20分鐘後，電話響了。顯示是「HSBC Customer Service」。",
          visual: {
            type: "safe_result",
            content: "✅ 帳戶狀態：正常\n🔒 最近登入：你本人，香港，剛才\n⚠️ 安全警報：無\n\n那條短訊是假的。但騙子知道你查了 App——他們有後招……"
          },
          choices: [
            {
              id: "hkm_c2b_answer",
              text: "📞 接電話，可能是銀行跟進",
              effects: { stress: 10, riskScore: 15 },
              nextSceneId: "hkm_s3_phone_followup",
              feedback: "⚠️ 你查了 App 知道帳戶沒問題，但騙子的電話很有說服力——保持警惕！",
              feedbackType: "mid"
            },
            {
              id: "hkm_c2b_ignore",
              text: "📵 不接，App 顯示沒問題就沒問題",
              effects: { alertness: 15, riskScore: -10 },
              nextSceneId: "hkm_s3_missed_then_sms",
              feedback: "✅ 你有 App 的核實作支撐，不接陌生電話完全合理。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2C：打銀行官方電話 ──
        {
          id: "hkm_s2_call_bank",
          type: "result",
          speaker: "system",
          text: "你撥打了銀行卡背面的 HSBC 客服電話（2233 3000）。系統先要你輸入帳戶資料驗證身份，然後真人客服接聽了。",
          visual: {
            type: "safe_result",
            content: "📞 HSBC 客服確認：\n\n✅ 你的帳戶：完全正常\n✅ 過去 30 天：無異常登入\n✅ 無任何安全問題\n\n客服補充：HSBC 絕不會在短訊裡發連結要你登入。\n如收到可疑短訊，請截圖舉報至 phishing@hsbc.com.hk"
          },
          choices: [
            {
              id: "hkm_c2c_report",
              text: "📧 馬上截圖舉報這條假短訊",
              effects: { alertness: 15, information: 10, riskScore: -10 },
              nextSceneId: "hkm_s4_report",
              feedback: "✅ 向銀行舉報假短訊，他們會追蹤和封鎖釣魚域名。",
              feedbackType: "good"
            },
            {
              id: "hkm_c2c_learn",
              text: "🔍 問客服：怎麼識別假短訊？",
              effects: { information: 20, alertness: 10 },
              nextSceneId: "hkm_s4_analysis",
              feedback: "✅ 主動學習識別方法，比被動避開詐騙更有效。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2D：分析網址 ──
        {
          id: "hkm_s2_url_analysis",
          type: "result",
          speaker: "system",
          text: "你仔細看了那個連結的域名。",
          visual: {
            type: "warning_page",
            content: "🔍 連結分析：\n\nhttps://hsbc-hk-verify.account-secure.net/login\n\n真正的域名：account-secure.net（最後面那個才是主域名！）\n不是：hsbc.com.hk\n\n騙子把「hsbc-hk-verify」放在前面，讓你以為這是官方的。\n真正的 HSBC 香港網址：https://www.hsbc.com.hk"
          },
          choices: [
            {
              id: "hkm_c2d_app",
              text: "📱 確認是假的，打開 HSBC App 查帳戶",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "hkm_s2_app_normal",
              feedback: "✅ 識破連結後，用官方 App 核實，這是完整的應對流程。",
              feedbackType: "good"
            },
            {
              id: "hkm_c2d_report_now",
              text: "📧 直接截圖，舉報給 HSBC",
              effects: { information: 15, alertness: 20, riskScore: -5 },
              nextSceneId: "hkm_s4_report",
              feedback: "✅ 你分析了域名技巧，識破並舉報——做得很好！",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3A：你填了帳密，騙子觸發了真 OTP ──
        {
          id: "hkm_s3_otp_arrives",
          type: "message",
          speaker: "system",
          text: "你剛填完帳號密碼，手機馬上收到一條 HSBC 發的真 OTP 短訊（號碼是真正的 HSBC）。假網站上出現一個輸入框：「Please enter your OTP」。",
          visual: {
            type: "sms",
            sender: "HSBC",
            content: "Your One-Time Password is: 847291\nDo NOT share this code with anyone. HSBC will never ask for this OTP via call or message."
          },
          choices: [
            {
              id: "hkm_c3_enter_otp",
              text: "🔢 填上 OTP，完成「驗證」",
              effects: { money: -80, riskScore: 60, information: -20 },
              nextSceneId: "hkm_s_end_loss",
              feedback: "❌ OTP 是你帳戶的最後一道防線！一旦填上，騙子立刻登入並轉走你所有的錢。HSBC 短訊明確說「Do NOT share this code」。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c3_stop_otp",
              text: "🚫 等等——短訊說「Do NOT share this code」！立刻關閉頁面",
              effects: { alertness: 30, information: 20, riskScore: -20 },
              nextSceneId: "hkm_s3_url_escape",
              feedback: "✅ 你讀了 OTP 短訊的警告！銀行的 OTP 只能在官方 App 或你自己打開的官方網址上使用，絕不在別的地方輸入。",
              feedbackType: "good"
            },
            {
              id: "hkm_c3_call_bank_urgent",
              text: "📞 收到奇怪的 OTP——立刻打電話給 HSBC 問清楚",
              effects: { alertness: 25, information: 25, riskScore: -15 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 對！收到不是自己觸發的 OTP，立刻致電銀行，說明情況並要求凍結可疑操作。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3B：假電話——「HSBC客服」跟進 ──
        {
          id: "hkm_s3_phone_followup",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你接了電話，對方聲音專業，口音標準，自我介紹是「HSBC 安全部門的 Karen」，她聽起來很真實。",
          visual: {
            type: "phone_call",
            caller: "顯示：HSBC Customer Service",
            content: "Good afternoon, this is Karen from HSBC Security Department. We've detected your account may have been accessed by a third party earlier today. I need to verify your identity to secure your account. Can you please confirm your last 4 digits of your card and the OTP we just sent you?"
          },
          choices: [
            {
              id: "hkm_c3b_give_otp",
              text: "😰 她知道 HSBC 剛發了 OTP……給她吧",
              effects: { money: -75, riskScore: 55, information: -20 },
              nextSceneId: "hkm_s_end_loss",
              feedback: "❌ 騙子「知道」OTP 是因為她就是觸發那個 OTP 的人！她在用你的帳號密碼登入，需要 OTP 完成最後一步。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c3b_question",
              text: "🤔 問她：我 App 查了帳戶完全正常，你說的「第三方登入」是什麼？",
              effects: { alertness: 20, information: 10, stress: 10 },
              nextSceneId: "hkm_s4_scammer_excuse",
              feedback: "🤔 好問題！騙子會有備而來。看她的回答能不能自圓其說。",
              feedbackType: "mid"
            },
            {
              id: "hkm_c3b_hangup",
              text: "📵 銀行客服不會電話要 OTP——掛掉，打卡背電話核實",
              effects: { alertness: 30, information: 25, riskScore: -25 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 完全正確！HSBC 不會主動打電話要求你提供 OTP，任何這樣要求的電話都是詐騙。",
              feedbackType: "good"
            },
            {
              id: "hkm_c3b_verify_number",
              text: "🔍 問她：你們這通電話的工號和官方客服電話是多少？",
              effects: { alertness: 20, information: 15, riskScore: -10 },
              nextSceneId: "hkm_s4_phone_test",
              feedback: "✅ 要求可核實的信息——真正的客服可以提供，騙子做不到。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3C：沒接電話，然後發短訊 ──
        {
          id: "hkm_s3_missed_then_sms",
          type: "message",
          speaker: "system",
          text: "你沒接電話，對方發來一條短訊：",
          visual: {
            type: "sms",
            sender: "HSBC-Security",
            content: "This is HSBC Security. We tried to call you regarding suspicious activity on your account. If you do not verify within 15 minutes, your account will be temporarily suspended. Click here: https://hsbc-secure-verify.account-secure.net"
          },
          choices: [
            {
              id: "hkm_c3c_click",
              text: "😰 帳戶真的會被停用？點一下看看",
              effects: { riskScore: 25, information: -10 },
              nextSceneId: "hkm_s2_fake_login",
              feedback: "⚠️ 這條短訊也是假的——同一個域名 account-secure.net！騙子在多管齊下。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c3c_same_domain",
              text: "🔍 等等，這個連結的域名跟之前那條一樣！",
              effects: { alertness: 25, information: 20, riskScore: -15 },
              nextSceneId: "hkm_s4_analysis",
              feedback: "✅ 你認出了同一個詐騙域名！這是同一夥人的連環局——短訊、電話、再短訊。",
              feedbackType: "good"
            },
            {
              id: "hkm_c3c_ignore_report",
              text: "🛡️ 這個域名不對，直接舉報並忽略",
              effects: { alertness: 20, information: 15, riskScore: -10 },
              nextSceneId: "hkm_s4_report",
              feedback: "✅ 你識別了兩條假短訊都是同一個域名。直接舉報，保護自己也保護其他人。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3D：識破假網站後 ──
        {
          id: "hkm_s3_url_escape",
          type: "result",
          speaker: "system",
          text: "你關掉了假網站。但你意識到：如果你已經填過帳號密碼，現在帳戶可能有風險。如果你沒填，你也想確認一下帳戶狀態。",
          visual: {
            type: "safe_result",
            content: "✅ 你識破了假網站——做得好！\n\n但是……\n如果你之前填過任何資料：\n→ 立刻打 HSBC 客服（2233 3000）\n→ 或在官方 App 更改密碼\n\n如果沒填任何資料：\n→ 只需查一下官方 App 確認帳戶正常即可"
          },
          choices: [
            {
              id: "hkm_c3e_filled_before",
              text: "😰 我填了帳號密碼——要立刻打電話！",
              effects: { stress: 15, alertness: 10 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 正確行動！帳號密碼洩露後，立刻聯絡銀行比什麼都重要。",
              feedbackType: "good"
            },
            {
              id: "hkm_c3e_not_filled",
              text: "✅ 我什麼都沒填，打開 App 確認一下",
              effects: { information: 15, alertness: 10, riskScore: -5 },
              nextSceneId: "hkm_s2_app_normal",
              feedback: "✅ 沒填就沒有洩露。查一下 App 確認安全，然後舉報這條假短訊。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4A：騙子解釋 App「沒顯示」──
        {
          id: "hkm_s4_scammer_excuse",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你問了騙子，她準備了答案。",
          visual: {
            type: "phone_call",
            caller: "「Karen / HSBC 安全部」",
            content: "The App has a 20-minute delay in security alerts — by the time you see it there, the transaction may already be processed. That's exactly why I'm calling you now, before it shows up. I just need your OTP to put a temporary hold on the suspicious activity."
          },
          choices: [
            {
              id: "hkm_c4a_believe",
              text: "😟 聽起來說得通……那 OTP 是多少？",
              effects: { money: -75, riskScore: 55, information: -20 },
              nextSceneId: "hkm_s_end_loss",
              feedback: "❌ 「App 有延遲」是騙子應對「我查了帳戶沒問題」的標準台詞。你說什麼她都有準備好的答案——這本身就是最大的紅旗。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c4a_hangup",
              text: "📵 每個質疑她都有解釋——這反而讓我更懷疑。掛電話，打卡背電話。",
              effects: { alertness: 30, information: 20, riskScore: -25 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 你識破了「萬能借口」套路！越流利地回答所有問題，越可疑。真正的客服會鼓勵你掛電話自己打官方電話核實。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4B：測試電話號碼 ──
        {
          id: "hkm_s4_phone_test",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你要求對方提供工號和官方客服電話讓你核實。對方的回應讓你皺眉。",
          visual: {
            type: "phone_call",
            caller: "「Karen」",
            content: "My employee ID is HK-2847. Regarding calling back — I'd strongly advise against it, as the security case will be re-queued and take up to 2 hours. Your account could be compromised in that time. I can resolve this right now in under 5 minutes if you cooperate."
          },
          choices: [
            {
              id: "hkm_c4b_cooperate",
              text: "😰 兩小時太久了……那就配合她吧",
              effects: { riskScore: 30, stress: -5, information: -10 },
              nextSceneId: "hkm_s4_scammer_excuse",
              feedback: "⚠️ 「不要掛電話，核實要2小時」——這就是阻止你查證的話術。",
              feedbackType: "bad"
            },
            {
              id: "hkm_c4b_hangup",
              text: "📵 你一直在阻止我核實——真客服不會這樣說。掛了！",
              effects: { alertness: 30, information: 25, riskScore: -25 },
              nextSceneId: "hkm_s2_call_bank",
              feedback: "✅ 關鍵識破！真正的銀行客服永遠支持你掛電話再打官方電話確認，而不是阻止你這樣做。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4C：分析假短訊的套路 ──
        {
          id: "hkm_s4_analysis",
          type: "result",
          speaker: "system",
          text: "你搞清楚了這整個詐騙流程的設計邏輯。",
          visual: {
            type: "warning_page",
            content: "🔍 詐騙全流程分析：\n\n① 假短訊：發件人名稱「HSBC-Alert」可偽裝\n② 假域名：hsbc-hk-verify.account-secure.net\n   → 真正主域名：account-secure.net（非官方）\n③ 假網站：設計複製 HSBC 官網，用來釣帳號密碼\n④ 騙子用你的帳密觸發真 OTP，再打電話/發短訊要你交出 OTP\n\n整套流程設計精密，目的是繞過銀行的雙重驗證。"
          },
          choices: [
            {
              id: "hkm_c4c_report",
              text: "📧 學到了！舉報假短訊給 HSBC",
              effects: { alertness: 15, information: 15 },
              nextSceneId: "hkm_s4_report",
              feedback: "✅ 了解了整個套路，你以後一眼就能識別這類攻擊。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4D：舉報 ──
        {
          id: "hkm_s4_report",
          type: "result",
          speaker: "system",
          text: "你截圖了可疑短訊，通過以下方式舉報：",
          visual: {
            type: "safe_result",
            content: "🛡️ 舉報渠道：\n• 發郵件至 phishing@hsbc.com.hk（含截圖）\n• 香港警方反詐騙協調中心：18222\n• 澳門治安警察局：993\n• scam.org.hk 網上舉報\n\n💡 舉報後：可以要求 HSBC 在帳戶上加設額外安全驗證。"
          },
          choices: [
            {
              id: "hkm_c4d_done",
              text: "✅ 舉報完成，帳戶安全確認",
              effects: { alertness: 10, information: 10, riskScore: -5 },
              nextSceneId: "hkm_s_end_safe",
              feedback: "✅ 你識別、核實、舉報——完整應對了這次假銀行短訊詐騙。",
              feedbackType: "good"
            }
          ]
        },
        // ── 結局 ──
        {
          id: "hkm_s_end_safe",
          type: "ending",
          speaker: "system",
          text: "帳戶完全安全。你識破了假短訊、識別了假域名、拒絕了假客服的 OTP 要求。你還清楚了整個「假短訊→假網站→假電話要 OTP」的連環套路。下次看到類似的東西，你能一眼認出來。",
          choices: [{ id: "hkm_end_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "hkm_s_end_loss",
          type: "ending",
          speaker: "system",
          text: "你交出了 OTP。騙子立刻用你的帳號密碼加上這個 OTP 完成了登入，觸發了多筆轉帳。等你反應過來聯絡 HSBC 時，帳戶已轉出了大部分資金。銀行客服告訴你：OTP 短訊上明確寫著「Do NOT share this code」，一旦輸入在第三方網站，銀行無法撤回已授權的轉帳。",
          choices: [{ id: "hkm_end_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ],

  // ==================== 台灣 ====================
  taiwan: [
    {
      id: "tw_atm_cancel_installment",
      region: "taiwan",
      title: "ATM 解除分期：連環施壓",
      scamType: "冒充電商客服 + ATM 詐騙 + 假銀行截圖施壓",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: [
        "ATM 根本沒有「解除分期」這個功能——只有轉帳、提款、查詢、繳費",
        "「客服」知道你的姓名和訂單金額——這些資料可能從購物平台洩露",
        "要求跟著電話在 ATM 前一步步操作，不讓你掛電話",
        "對方傳來「看起來很官方」的銀行截圖——截圖可以輕易偽造",
        "「今晚 12 點就開始扣款」的緊迫時間壓力"
      ],
      officialChannels: [
        "掛電話後打開蝦皮/PChome/原購物平台查訂單記錄",
        "自己搜索銀行官方客服電話（不要用對方給的號碼）",
        "撥打 165 反詐騙專線確認"
      ],
      pressureSource: ["連續扣款恐慌", "假客服身份偽裝", "假銀行截圖製造信任"],
      scenes: [
        // ── 場景1：鋪墊——接到「電商客服」電話 ──
        {
          id: "tw_s1_call",
          type: "phone_call",
          speaker: "system",
          text: "下午三點，你正在準備明天的作業，突然接到一通電話。對方知道你的姓名，說起話來很自然，一點都不像詐騙電話該有的樣子。",
          visual: {
            type: "phone_call",
            caller: "未知號碼 0800-XXXX-XXX",
            content: "你好，請問是 XXX 同學嗎？我是蝦皮購物的客服部門。我們系統發現您帳號上有一筆訂單被誤設為每月自動扣款方案，如果不取消，從今晚 12 點開始會連續扣款 12 個月，每月 3,200 元，共 38,400 元。我現在可以引導您操作解除，需要配合一下。"
          },
          choices: [
            {
              id: "tw_c1_follow",
              text: "😰 38,400 元！那我馬上配合，要怎麼做？",
              effects: { stress: -10, riskScore: 30, information: -10 },
              nextSceneId: "tw_s2_atm_direction",
              feedback: "⚠️ 你被金額嚇到了，開始跟著走。但先等一下——ATM 根本沒有「解除分期」的功能。",
              feedbackType: "bad"
            },
            {
              id: "tw_c1_platform_check",
              text: "🛍️ 先等一下——我掛電話去蝦皮查一下有沒有這個訂單",
              effects: { information: 25, alertness: 20, riskScore: -15 },
              nextSceneId: "tw_s2_app_check",
              feedback: "✅ 正確！查原購物平台的訂單記錄，是最直接的核實方式。",
              feedbackType: "good"
            },
            {
              id: "tw_c1_question",
              text: "🤔 問對方：訂單編號是多少？我想先查一下",
              effects: { information: 10, alertness: 15, stress: 10 },
              nextSceneId: "tw_s2_scammer_order_info",
              feedback: "🤔 好問題。騙子有時候確實有部分訂單資料，看他怎麼回應。",
              feedbackType: "mid"
            },
            {
              id: "tw_c1_hangup_165",
              text: "📵 掛電話，打 165 確認有沒有這種事",
              effects: { information: 25, alertness: 20, riskScore: -20 },
              nextSceneId: "tw_s2_165_confirm",
              feedback: "✅ 165 是台灣反詐騙專線，打過去可以直接確認。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2A：騙子指引去 ATM ──
        {
          id: "tw_s2_atm_direction",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "對方讓你去附近的 ATM，說會電話引導你一步步完成「解除」。你走到 ATM 前，電話一直沒掛。",
          visual: {
            type: "phone_call",
            caller: "「蝦皮客服」",
            content: "你現在到 ATM 了嗎？很好。你先按「提款或轉帳」，等畫面出來後告訴我顯示什麼。我需要你把帳戶餘額轉到我們的「保管帳號」，這樣才能確保分期不會繼續扣款，操作完成後會立刻退回給你。"
          },
          choices: [
            {
              id: "tw_c2a_transfer",
              text: "😰 「保管帳號」聽起來合理……按照她說的轉帳",
              effects: { money: -65, riskScore: 55 },
              nextSceneId: "tw_s_end_loss",
              feedback: "❌ 世界上沒有「保管帳號」這種東西。那個帳號是騙子的，轉過去的錢不會回來。",
              feedbackType: "bad"
            },
            {
              id: "tw_c2a_stop_atm",
              text: "🚫 等等——ATM 哪有「解除分期」的功能？這根本就是轉帳！",
              effects: { alertness: 30, information: 20, riskScore: -25 },
              nextSceneId: "tw_s3_after_hangup",
              feedback: "✅ 你在 ATM 前識破了！ATM 只有提款、轉帳、查詢、繳費，完全沒有「解除分期付款」這個選項。",
              feedbackType: "good"
            },
            {
              id: "tw_c2a_stall",
              text: "🤔 我先不操作，問她：為什麼要轉到保管帳號才能解除？",
              effects: { alertness: 15, stress: 10 },
              nextSceneId: "tw_s3_custody_excuse",
              feedback: "🤔 你質疑了一個關鍵邏輯。看她的回答能不能說服你。",
              feedbackType: "mid"
            }
          ]
        },
        // ── 場景2B：查蝦皮訂單 ──
        {
          id: "tw_s2_app_check",
          type: "result",
          speaker: "system",
          text: "你掛電話，打開蝦皮 App 查訂單記錄。翻了好幾頁，看完了所有訂單。",
          visual: {
            type: "safe_result",
            content: "🛍️ 蝦皮訂單記錄（最近 3 個月）：\n\n• 手機保護殼 — ✅ 已完成，NT$199，一次付清\n• 充電線 — ✅ 已完成，NT$249，一次付清\n• 無線耳機 — ✅ 已完成，NT$890，一次付清\n\n❌ 沒有任何「每月自動扣款」或「分期方案」！\n\n但騙子說的那個號碼等下可能還會打來……"
          },
          choices: [
            {
              id: "tw_c2b_bank_too",
              text: "📞 再打銀行官方客服確認一下帳戶",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "tw_s3_bank_confirm",
              feedback: "✅ 雙重確認更安心！銀行那邊也能告訴你帳戶根本沒有分期設定。",
              feedbackType: "good"
            },
            {
              id: "tw_c2b_scammer_calls_again",
              text: "📞 那個號碼又打來了……",
              effects: { stress: 10, riskScore: 10 },
              nextSceneId: "tw_s3_second_call",
              feedback: "⚠️ 騙子沒有放棄。你有了訂單記錄的核實，但對方還有新話術——保持警惕。",
              feedbackType: "mid"
            },
            {
              id: "tw_c2b_165",
              text: "📵 確認沒有分期設定，打 165 舉報這通電話",
              effects: { information: 15, alertness: 15, riskScore: -10 },
              nextSceneId: "tw_s4_165_report",
              feedback: "✅ 有了訂單紀錄為證，舉報給 165 非常有效。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2C：騙子提供訂單資料 ──
        {
          id: "tw_s2_scammer_order_info",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你問了訂單編號，對方真的說出了一個號碼，聽起來格式像是真實訂單，還說出了你的手機號碼後四碼。",
          visual: {
            type: "phone_call",
            caller: "「蝦皮客服」",
            content: "您的訂單編號是 210528XXXXXX，您的手機尾碼是 XXXX，對嗎？這個訂單的付款方式在您不知情的情況下被改為分期方案，所以您的訂單頁面可能看不到。您需要配合我們完成解除流程。"
          },
          choices: [
            {
              id: "tw_c2c_believe",
              text: "😟 她連手機尾碼都知道……那應該是真的，繼續聽她的",
              effects: { trust: 15, riskScore: 20, information: -10 },
              nextSceneId: "tw_s2_atm_direction",
              feedback: "⚠️ 知道你的手機號和訂單格式不代表她是真客服——這些資料可能從其他平台洩露了。騙子買到資料後會假扮各種客服。",
              feedbackType: "bad"
            },
            {
              id: "tw_c2c_app_verify",
              text: "🛍️ 掛電話，打開蝦皮 App 查這個訂單號",
              effects: { information: 25, alertness: 15, riskScore: -10 },
              nextSceneId: "tw_s2_app_check",
              feedback: "✅ 正確！就算她說出了訂單號，也要去官方 App 核實。騙子可以準備任何台詞，但你的 App 不會說謊。",
              feedbackType: "good"
            },
            {
              id: "tw_c2c_test",
              text: "🔍 讓她說出完整訂單號，我去 App 比對",
              effects: { alertness: 20, information: 15, riskScore: -5 },
              nextSceneId: "tw_s3_order_mismatch",
              feedback: "✅ 要求比對完整資料——如果她說出的號碼在你 App 裡對不上，就確認是詐騙了。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2D：165 確認 ──
        {
          id: "tw_s2_165_confirm",
          type: "result",
          speaker: "system",
          text: "你打了 165 反詐騙專線，說明剛才的電話情況。",
          visual: {
            type: "safe_result",
            content: "📞 165 反詐騙專線回覆：\n\n✅ 這是典型「假冒電商客服 ATM 解除分期詐騙」\n✅ 蝦皮、MOMO、PChome 都不會主動打電話要你去 ATM\n✅ ATM 沒有「解除分期付款」的功能\n✅ 已記錄該電話號碼\n\n專線建議：去蝦皮 App 再確認一下訂單，100% 沒有問題。"
          },
          choices: [
            {
              id: "tw_c2d_app_confirm",
              text: "✅ 打開蝦皮 App 確認一下",
              effects: { information: 15, alertness: 10, riskScore: -5 },
              nextSceneId: "tw_s2_app_check",
              feedback: "✅ 165 確認了，App 再確認一次，徹底安心。",
              feedbackType: "good"
            },
            {
              id: "tw_c2d_done",
              text: "👍 確認是詐騙，感謝 165！",
              effects: { alertness: 15, information: 10 },
              nextSceneId: "tw_s_end_safe",
              feedback: "✅ 165 救了你。這條熱線存起來，遇到任何可疑電話都可以打。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3A：保管帳號的解釋 ──
        {
          id: "tw_s3_custody_excuse",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你問了為什麼要轉帳，對方給了一個你差點信了的解釋。",
          visual: {
            type: "phone_call",
            caller: "「蝦皮客服」",
            content: "這是我們的標準退費流程，轉到保管帳號是為了確保系統能識別到您的操作。因為您的帳號和銀行帳戶之間有連結問題，系統無法直接解除，需要通過這個流程。轉帳後10分鐘內我們會全額退回給您，這個流程每天有幾百個客戶在做，完全正常。"
          },
          choices: [
            {
              id: "tw_c3a_believe",
              text: "😟 每天幾百個客戶……聽起來挺正式的，繼續配合",
              effects: { riskScore: 30, trust: 15, information: -10 },
              nextSceneId: "tw_s3_fake_screenshot",
              feedback: "⚠️ 「每天幾百個客戶」是製造正常感的話術。世界上沒有任何正規公司的退費流程需要你先轉錢給他們。",
              feedbackType: "bad"
            },
            {
              id: "tw_c3a_hangup",
              text: "📵 「退費要你先轉錢」——這完全不合邏輯，掛電話！",
              effects: { alertness: 30, information: 20, riskScore: -25 },
              nextSceneId: "tw_s3_after_hangup",
              feedback: "✅ 關鍵識破！任何要你「先轉錢，之後退還給你」的流程都是詐騙，不管解釋多合理。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3B：騙子傳來假銀行截圖 ──
        {
          id: "tw_s3_fake_screenshot",
          type: "message",
          speaker: "scammer",
          pressure: true,
          text: "你還在猶豫，對方傳來一張截圖，看起來是「官方系統的操作記錄」，顯示你的帳號確實有分期設定。",
          visual: {
            type: "warning_page",
            content: "📱 對方傳來的截圖：\n\n看起來很正式：\n「系統：自動扣款方案 - 已啟用\n帳號：XXX（你的手機號部分）\n金額：NT$3,200/月\n起始日：今晚 24:00」\n\n⚠️ 截圖可以輕易偽造！\n這張圖沒有任何意義。\n只有你自己打開 App 查到的才算數。"
          },
          choices: [
            {
              id: "tw_c3b_believe_screenshot",
              text: "😰 看到截圖更相信了，趕快去 ATM",
              effects: { riskScore: 30, money: -50, information: -15 },
              nextSceneId: "tw_s_end_loss",
              feedback: "❌ 截圖可以在 Photoshop 幾分鐘內做出來。騙子的「系統截圖」沒有任何可信度——只有官方 App 裡查到的才是真實的。",
              feedbackType: "bad"
            },
            {
              id: "tw_c3b_check_app",
              text: "🛍️ 截圖可以偽造，掛電話，打開蝦皮 App 自己查",
              effects: { alertness: 30, information: 20, riskScore: -20 },
              nextSceneId: "tw_s2_app_check",
              feedback: "✅ 聰明！截圖可以 P 圖，只有你自己在 App 裡查到的才是真實的。你識破了「假截圖增加信任度」的手法。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3C：二次來電 ──
        {
          id: "tw_s3_second_call",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你接了電話，對方語氣變得更急迫。",
          visual: {
            type: "phone_call",
            caller: "「蝦皮客服」",
            content: "你好，之前那通電話你掛斷了。我理解你在核實，這是正確的！但我要告訴你，那個訂單確實存在，是你之前一筆消費被系統誤設的，你的蝦皮 App 因為版本問題可能沒有顯示。如果你不信，我現在傳給你我們的工單截圖，你就可以確認。"
          },
          choices: [
            {
              id: "tw_c3c_want_screenshot",
              text: "🤔 好，你傳截圖來，我確認了再說",
              effects: { stress: 10, riskScore: 10 },
              nextSceneId: "tw_s3_fake_screenshot",
              feedback: "⚠️ 她知道你查了 App，所以這次換用「截圖」來製造信任感。截圖可以輕易偽造。",
              feedbackType: "bad"
            },
            {
              id: "tw_c3c_hangup_165",
              text: "📵 App 顯示沒有，那就沒有。掛電話，打 165",
              effects: { alertness: 25, information: 20, riskScore: -20 },
              nextSceneId: "tw_s4_165_report",
              feedback: "✅ 你有了 App 核實作支撐，不被說服。掛電話是正確的。",
              feedbackType: "good"
            },
            {
              id: "tw_c3c_bank_call",
              text: "📞 打銀行官方客服確認帳戶有沒有分期",
              effects: { information: 20, alertness: 15, riskScore: -15 },
              nextSceneId: "tw_s3_bank_confirm",
              feedback: "✅ 銀行客服能直接查你的帳戶，告訴你有沒有任何分期設定。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3D：訂單號對不上 ──
        {
          id: "tw_s3_order_mismatch",
          type: "result",
          speaker: "system",
          text: "你讓對方說出完整訂單號，然後在蝦皮 App 搜索。",
          visual: {
            type: "warning_page",
            content: "🔍 蝦皮搜索結果：\n\n搜索「210528XXXXXX」：\n❌ 無此訂單\n\n你的帳號所有訂單記錄：\n— 沒有任何分期設定\n— 沒有任何自動扣款\n\n✅ 對方說的訂單號根本不存在！"
          },
          choices: [
            {
              id: "tw_c3d_confirmed_scam",
              text: "✅ 確認是詐騙！掛電話，打 165 舉報",
              effects: { alertness: 25, information: 20, riskScore: -20 },
              nextSceneId: "tw_s4_165_report",
              feedback: "✅ 你用訂單號核實戳穿了騙局。打 165 舉報這個號碼，保護下一個可能接到電話的人。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3E：掛了電話後 ──
        {
          id: "tw_s3_after_hangup",
          type: "result",
          speaker: "system",
          text: "你掛了電話。但對方很快發來一條短訊。",
          visual: {
            type: "sms",
            sender: "蝦皮客服通知",
            content: "您拒絕配合解除分期方案，系統將於今晚 24:00 自動啟動連續扣款。如需取消，請點擊連結完成操作：https://shopee-tw-cancel.account-fix.net/stop"
          },
          choices: [
            {
              id: "tw_c3e_click_link",
              text: "😰 這個連結看起來很正式……點一下看看",
              effects: { riskScore: 25, information: -10 },
              nextSceneId: "tw_s4_fake_page",
              feedback: "⚠️ 你剛才識破了電話詐騙，不要又被這條短訊拉回去。「account-fix.net」不是蝦皮的域名。",
              feedbackType: "bad"
            },
            {
              id: "tw_c3e_app_check",
              text: "🛍️ 打開蝦皮 App 查訂單，確認帳戶正常",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "tw_s2_app_check",
              feedback: "✅ 蝦皮官方 App 才是權威！短訊連結一概不點。",
              feedbackType: "good"
            },
            {
              id: "tw_c3e_165",
              text: "📞 不管短訊，打 165 舉報整個流程",
              effects: { alertness: 20, information: 15, riskScore: -10 },
              nextSceneId: "tw_s4_165_report",
              feedback: "✅ 這是連環詐騙：電話→掛電話→短訊。165 會記錄整個流程。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4A：銀行確認 ──
        {
          id: "tw_s3_bank_confirm",
          type: "result",
          speaker: "system",
          text: "你打電話給銀行官方客服（台新/玉山/國泰等，你自己搜索的號碼），對方查詢後告訴你：",
          visual: {
            type: "safe_result",
            content: "🏦 銀行客服確認：\n\n✅ 你的帳戶：完全正常\n✅ 無任何分期付款設定\n✅ 無任何自動扣款\n\n銀行客服說：\n「我們絕對不會要求客戶去 ATM 操作才能解除分期。\n ATM 沒有這個功能。凡是要你去 ATM 解除分期的，都是詐騙。」"
          },
          choices: [
            {
              id: "tw_c4a_done",
              text: "✅ 確認了，謝謝銀行客服！打 165 舉報",
              effects: { alertness: 15, information: 10, riskScore: -5 },
              nextSceneId: "tw_s4_165_report",
              feedback: "✅ 銀行確認 + 165 舉報，雙管齊下。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4B：假網頁 ──
        {
          id: "tw_s4_fake_page",
          type: "webpage",
          speaker: "system",
          text: "你點開了短訊連結，頁面做得像蝦皮的設計，但網址是「account-fix.net」，不是 shopee.tw。頁面要你輸入銀行帳號和密碼，「確認身份後立刻解除分期」。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：account-fix.net（非官方！）\n蝦皮台灣正式域名：shopee.tw\n\n頁面要求：\n• 銀行帳號\n• 網銀密碼\n• 手機驗證碼（OTP）← 填了帳戶直接被控制\n\n這是假網站。"
          },
          choices: [
            {
              id: "tw_c4b_fill",
              text: "😰 填一下就解除了……",
              effects: { money: -60, riskScore: 55 },
              nextSceneId: "tw_s_end_loss",
              feedback: "❌ 你在假網站輸入了銀行密碼和 OTP，帳戶已被攻陷。這是整個連環局的最後一步。",
              feedbackType: "bad"
            },
            {
              id: "tw_c4b_url_notice",
              text: "🔍 等等，這個域名是 account-fix.net，不是 shopee.tw！關掉！",
              effects: { alertness: 30, information: 20, riskScore: -20 },
              nextSceneId: "tw_s_end_safe",
              feedback: "✅ 你識破了電話、識破了假截圖、識破了假短訊連結！這是完整的連環詐騙，你全部躲過了。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4C：165 舉報 ──
        {
          id: "tw_s4_165_report",
          type: "result",
          speaker: "system",
          text: "你撥打 165 反詐騙專線，說明整個過程——電話、訂單號、假截圖、短訊連結，專線人員都記下來了。",
          visual: {
            type: "safe_result",
            content: "📞 165 反詐騙專線確認：\n\n✅ 典型「假冒電商客服 + ATM 詐騙」\n✅ 假截圖是這類詐騙的新手法，要特別注意\n✅ 已記錄：電話號碼 + 短訊連結\n\n📍 記住：\n• 蝦皮/PChome/MOMO 不會主動打電話要你去 ATM\n• ATM 沒有解除分期的功能\n• 先轉帳再退還 = 詐騙\n• 看到「先轉，再退還你」立刻掛電話"
          },
          choices: [
            {
              id: "tw_c4c_done",
              text: "✅ 舉報完成，已提醒同學注意",
              effects: { alertness: 15, information: 10, socialPressure: -5 },
              nextSceneId: "tw_s_end_safe",
              feedback: "✅ 你完整識破了這個連環詐騙，並舉報保護了其他人。",
              feedbackType: "good"
            }
          ]
        },
        // ── 結局 ──
        {
          id: "tw_s_end_safe",
          type: "ending",
          speaker: "system",
          text: "你沒有去 ATM 轉帳，也沒有在假網站輸入任何資料。你查了蝦皮 App，確認根本沒有分期設定；打電話給銀行，帳戶完全正常；打 165，確認這是典型的「ATM 解除分期詐騙」。三重核實，三重放心。",
          choices: [{ id: "tw_end_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "tw_s_end_loss",
          type: "ending",
          speaker: "system",
          text: "帳戶出現多筆轉帳記錄。你打電話給銀行，對方說這些都是你「主動操作」的交易，ATM 轉帳或網銀操作一旦完成，銀行很難撤回。台灣「ATM 解除分期詐騙」每年導致數十億新台幣損失，你成為其中一個受害者——但這不是你的錯，這些騙局被設計得非常精密，每年都有善良的人受騙。",
          choices: [{ id: "tw_end_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ],

  // ==================== 歐美 ====================
  western_countries: [
    {
      id: "west_fake_immigration_call",
      region: "western_countries",
      title: "假移民局：遣返威脅連環局",
      scamType: "假冒政府移民局 + 禮品卡付款 + 隔離話術詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: [
        "政府機構絕對不會打電話要求立即付款，只會通過書面信件正式通知",
        "「不能聯絡學校或使館」——真正的政府不會阻止你核實，這才是最大的紅旗",
        "要求用禮品卡（Gift Cards）或加密貨幣付款——任何政府機構都不收這些",
        "「如果掛電話就發逮捕令」——這是恐嚇話術，不是事實",
        "對你的Social Security Number有「問題」的說法——你可能根本沒有SSN"
      ],
      officialChannels: [
        "直接去學校 International Office——他們每學期都會遇到這類詐騙舉報",
        "登入 SEVIS（美國）或官方移民局網站自己查簽證狀態",
        "聯絡中國大使館或台港澳各地辦事處"
      ],
      pressureSource: ["簽證遣返威脅", "語言壓力", "身份焦慮", "隔離策略（不讓你聯絡任何人）"],
      scenes: [
        // ── 場景1：鋪墊——接到「移民局」電話 ──
        {
          id: "west_s1_call",
          type: "phone_call",
          speaker: "system",
          text: "你剛上完課，一個人走回宿舍。手機響了，是陌生的美國號碼。你猶豫了一下，還是接了。",
          visual: {
            type: "phone_call",
            caller: "Unknown +1-202-XXX-XXXX",
            content: "Hello, this is Officer Williams from US Immigration Services. Your student visa has been flagged for suspicious activity linked to your Social Security number. This is a serious matter — if not resolved immediately, you will face deportation. You need to pay a $2,000 security deposit right now to stop the process. Do NOT hang up or contact anyone — that will only make things worse."
          },
          choices: [
            {
              id: "west_c1_pay",
              text: "😰 Deportation？我腿都軟了……怎麼付款？",
              effects: { money: -60, riskScore: 50, identityAnxiety: -10 },
              nextSceneId: "west_s2_giftcard_demand",
              feedback: "❌ 聽到 deportation 慌了是人之常情。但政府部門絕不會打電話要求立即付款——他們只會寄書面通知。",
              feedbackType: "bad"
            },
            {
              id: "west_c1_keep_talking",
              text: "😟 不敢掛電話，繼續聽他說",
              effects: { stress: 20, identityAnxiety: 20, riskScore: 20 },
              nextSceneId: "west_s2_scammer_pressure",
              feedback: "⚠️ 你被對方的語氣壓住了。但你有權掛電話——掛了不會被逮捕，那只是嚇你的。",
              feedbackType: "bad"
            },
            {
              id: "west_c1_roommate",
              text: "🤔 先讓她等一下，我問室友怎麼處理",
              effects: { information: 10, socialPressure: 10 },
              nextSceneId: "west_s2_roommate_advice",
              feedback: "🤔 找室友商量是個自然反應，但室友可能也不知道正確答案。",
              feedbackType: "mid"
            },
            {
              id: "west_c1_io",
              text: "📵 掛電話，直接去 International Office",
              effects: { information: 30, alertness: 20, riskScore: -25, identityAnxiety: -10 },
              nextSceneId: "west_s3_io_confirm",
              feedback: "✅ International Office 就是處理這種事的！他們每學期都會遇到這類詐騙舉報。",
              feedbackType: "good"
            },
            {
              id: "west_c1_website",
              text: "🌐 掛電話，自己登入 SEVIS 查簽證狀態",
              effects: { information: 30, alertness: 20, riskScore: -20 },
              nextSceneId: "west_s3_visa_check",
              feedback: "✅ 對！SEVIS 官方系統可以直接查你的簽證狀態，是最權威的核實方式。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2A：騙子要求買禮品卡 ──
        {
          id: "west_s2_giftcard_demand",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你問了怎麼付款，對方的指令讓你心裡有點不安。",
          visual: {
            type: "phone_call",
            caller: "「Officer Williams / 移民局」",
            content: "We accept payment via Google Play gift cards. Go to the nearest convenience store — 7-Eleven or CVS. Buy $2,000 worth of Google Play cards. Once you have the cards, read me the redemption codes. You have 30 minutes before the warrant is issued. Do NOT tell the cashier what this is for. Do NOT call anyone."
          },
          choices: [
            {
              id: "west_c2a_buy_cards",
              text: "😰 禮品卡……聽起來怪怪的，但為了簽證還是去買吧",
              effects: { money: -50, riskScore: 55, identityAnxiety: -5 },
              nextSceneId: "west_s_end_loss",
              feedback: "❌ 美國政府部門絕對不收 Google Play 禮品卡！任何要求用禮品卡、比特幣、西聯匯款付款的，100% 是詐騙。",
              feedbackType: "bad"
            },
            {
              id: "west_c2a_question_giftcard",
              text: "🤔 問他：政府為什麼收禮品卡？這不合理",
              effects: { alertness: 20, information: 10, stress: 10 },
              nextSceneId: "west_s3_scammer_excuse_gc",
              feedback: "🤔 好問題！看騙子怎麼圓這個謊——他的回答會暴露更多矛盾。",
              feedbackType: "mid"
            },
            {
              id: "west_c2a_hangup_io",
              text: "📵 「不能聯絡任何人」？這太可疑了——掛電話，去 International Office",
              effects: { alertness: 30, information: 25, riskScore: -30, identityAnxiety: -10 },
              nextSceneId: "west_s3_io_confirm",
              feedback: "✅ 關鍵識破！「Do NOT contact anyone」本身就是最大的紅旗。真正的政府不會阻止你核實。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2B：騙子繼續施壓 ──
        {
          id: "west_s2_scammer_pressure",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你沒有掛電話。對方察覺到你的猶豫，語氣變得更嚴厲。",
          visual: {
            type: "phone_call",
            caller: "「Officer Williams」",
            content: "You need to understand the seriousness of this situation. If you don't comply right now, a warrant will be issued for your arrest. You will be taken into custody and your student visa will be permanently revoked. This is your only chance. Do you want to be deported?"
          },
          choices: [
            {
              id: "west_c2b_comply",
              text: "😰 我不想被遣返……你說怎麼做就怎麼做",
              effects: { riskScore: 40, identityAnxiety: -5, money: -40 },
              nextSceneId: "west_s2_giftcard_demand",
              feedback: "⚠️ 你被恐嚇話術壓倒了。但記住：真正的移民局不會用這種方式處理問題。你有權掛電話。",
              feedbackType: "bad"
            },
            {
              id: "west_c2b_hangup",
              text: "📵 等等——真正的政府人員不會這樣說話。掛電話！",
              effects: { alertness: 30, information: 20, riskScore: -25, identityAnxiety: -10 },
              nextSceneId: "west_s3_after_hangup",
              feedback: "✅ 你識破了恐嚇話術！真正的移民局官員不會用「逮捕」「遣返」來威脅你立即付款。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2C：室友建議 ──
        {
          id: "west_s2_roommate_advice",
          type: "chat",
          speaker: "friend",
          text: "你壓低聲音問室友，室友的反應讓你更猶豫了。",
          visual: {
            type: "chat",
            app: "iMessage",
            appIcon: "💬",
            messages: [
              { type: "outgoing", name: "你", text: "有人打來說是移民局，說我簽證有問題，要我付錢" },
              { type: "incoming", name: "Mike（室友）", text: "靠真假？我聽學長說過這種，好像是詐騙" },
              { type: "incoming", name: "Mike（室友）", text: "但……萬一是真的呢？你簽證確實辦了很久" },
              { type: "incoming", name: "Mike（室友）", text: "你要不要去 International Office 問一下？" }
            ]
          },
          choices: [
            {
              id: "west_c2c_keep_listening",
              text: "😟 室友也不確定……還是繼續聽對方說什麼",
              effects: { stress: 15, riskScore: 20 },
              nextSceneId: "west_s2_scammer_pressure",
              feedback: "⚠️ 室友的「萬一是真的」讓你更猶豫了。但 International Office 才是正確答案。",
              feedbackType: "bad"
            },
            {
              id: "west_c2c_io",
              text: "📵 室友說去 International Office，那就去吧",
              effects: { information: 25, alertness: 15, riskScore: -20 },
              nextSceneId: "west_s3_io_confirm",
              feedback: "✅ 室友的建議是對的——International Office 是最可靠的求助點。",
              feedbackType: "good"
            },
            {
              id: "west_c2c_visa_website",
              text: "🌐 先登入 SEVIS 查簽證狀態",
              effects: { information: 25, alertness: 15, riskScore: -15 },
              nextSceneId: "west_s3_visa_check",
              feedback: "✅ SEVIS 官方系統是最權威的簽證狀態查詢方式。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3A：騙子解釋禮品卡 ──
        {
          id: "west_s3_scammer_excuse_gc",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你問了為什麼收禮品卡，對方顯然被問過很多次，有準備好的答案。",
          visual: {
            type: "phone_call",
            caller: "「Officer Williams」",
            content: "This is a standard procedure for international students without a US bank account. The gift card system is used by the Treasury Department to process emergency security deposits. It's faster and trackable. Once your identity is verified, the full amount will be refunded to your bank account within 24 hours."
          },
          choices: [
            {
              id: "west_c3a_believe",
              text: "😟 他說得挺流利的……聽起來像真的",
              effects: { riskScore: 30, trust: 15, information: -10 },
              nextSceneId: "west_s2_giftcard_demand",
              feedback: "⚠️ 騙子準備了各種「解釋」來應對你的質疑。說得越流利越可疑——真正的政府流程不會這麼「靈活」。",
              feedbackType: "bad"
            },
            {
              id: "west_c3a_hangup",
              text: "📵 美國財政部用禮品卡退款？這太扯了。掛電話，去 International Office",
              effects: { alertness: 30, information: 25, riskScore: -30 },
              nextSceneId: "west_s3_io_confirm",
              feedback: "✅ 你識破了！美國政府沒有任何部門會用禮品卡處理任何費用。這是最明顯的詐騙特徵。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3B：掛電話後 ──
        {
          id: "west_s3_after_hangup",
          type: "result",
          speaker: "system",
          text: "你掛了電話。對方立刻又打來，你沒接。然後收到一條語音留言——語氣比剛才更嚴厲。",
          visual: {
            type: "warning_page",
            content: "📱 語音留言（+1-202-XXX-XXXX）：\n\n「This is Officer Williams. You have made a very serious mistake by hanging up. A warrant has been issued for your arrest. If you call back within 15 minutes and complete the payment, we can stop the warrant. If not, campus police will be dispatched to your location.」\n\n⚠️ 這是經典的「升級恐嚇」話術。\n他們在測試你的心理極限。"
          },
          choices: [
            {
              id: "west_c3b_call_back",
              text: "😰 校警要來抓我？打回去！",
              effects: { riskScore: 30, stress: 20, identityAnxiety: 15 },
              nextSceneId: "west_s2_giftcard_demand",
              feedback: "⚠️ 騙子在利用「升級恐嚇」讓你失去判斷能力。校警不會因為你掛電話就來抓你。",
              feedbackType: "bad"
            },
            {
              id: "west_c3b_io",
              text: "📵 語音留言的語氣更兇了——這反而證明是詐騙。去 International Office",
              effects: { alertness: 25, information: 20, riskScore: -25 },
              nextSceneId: "west_s3_io_confirm",
              feedback: "✅ 你識破了！騙子在你掛電話後會「升級」威脅，目的是讓你因為害怕而回電。",
              feedbackType: "good"
            },
            {
              id: "west_c3b_check_sevis",
              text: "🌐 登入 SEVIS 查簽證狀態，用事實說話",
              effects: { information: 25, alertness: 15, riskScore: -20 },
              nextSceneId: "west_s3_visa_check",
              feedback: "✅ 用官方系統查詢是最理性的做法。SEVIS 不會說謊。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3C：International Office 確認 ──
        {
          id: "west_s3_io_confirm",
          type: "result",
          speaker: "system",
          text: "你到了 International Office，工作人員聽你描述完整個情況後，一點都不驚訝。",
          visual: {
            type: "safe_result",
            content: "🏫 International Office 確認：\n\n✅ 你的簽證狀態：完全正常\n✅ 過去 30 天：無任何移民局通知\n✅ 移民局不會打電話要求立即付款\n✅ 「不能聯絡學校」是詐騙的標誌\n\n工作人員補充：\n「這類詐騙我們每學期都會遇到。\n 記住：真正的移民局只通過書面信件聯繫學生。\n 任何電話要求付款的都是詐騙。」"
          },
          choices: [
            {
              id: "west_c3c_report",
              text: "📋 謝謝！我應該怎麼舉報這通電話？",
              effects: { information: 15, alertness: 10 },
              nextSceneId: "west_s4_report",
              feedback: "✅ 主動舉報可以幫助保護下一個可能接到同樣電話的同學。",
              feedbackType: "good"
            },
            {
              id: "west_c3c_see_visa",
              text: "🌐 能幫我登入 SEVIS 看一下簽證狀態嗎？",
              effects: { information: 10, identityAnxiety: -15, stress: -10 },
              nextSceneId: "west_s3_visa_check",
              feedback: "✅ 親眼看到簽證狀態正常，才能徹底消除那種說不清楚的焦慮。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3D：SEVIS 查詢 ──
        {
          id: "west_s3_visa_check",
          type: "result",
          speaker: "system",
          text: "你登入 SEVIS 系統，輸入你的 SEVIS ID 和個人資料。系統顯示：",
          visual: {
            type: "safe_result",
            content: "📋 SEVIS 官方系統：\n\nStudent Visa Status: ✅ ACTIVE\nSEVIS Record: ✅ Active\nExpiry Date: 正常有效\nApplication History: No issues\n\n📌 移民局從不通過電話要求付款。\n📌 任何簽證問題只通過書面信件或官方系統通知。\n📌 如果你真的簽證有問題，學校會先收到通知。"
          },
          choices: [
            {
              id: "west_c3d_relieved",
              text: "😌 親眼看到才放心！謝謝",
              effects: { identityAnxiety: -20, stress: -15, information: 10 },
              nextSceneId: "west_s4_report",
              feedback: "✅ 簽證焦慮是騙子針對留學生的主要攻擊點。有問題去官方渠道查，不要聽電話裡的說法。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4：舉報 ──
        {
          id: "west_s4_report",
          type: "result",
          speaker: "system",
          text: "你決定舉報這通詐騙電話。International Office 幫你記錄了騙子的號碼，並提供了以下舉報渠道。",
          visual: {
            type: "safe_result",
            content: "🛡️ 美國舉報渠道：\n• FTC：reportfraud.ftc.gov\n• IC3.gov（FBI 網絡犯罪舉報中心）\n• 學校 Campus Safety\n• 聯絡使領館（若涉及護照/簽證問題）\n\n💡 建議：\n• 在手機上把這個號碼封鎖\n• 告訴身邊的留學生朋友\n• 以後接到類似電話，直接掛斷"
          },
          choices: [
            {
              id: "west_c4_done",
              text: "✅ 舉報完成，學到了！",
              effects: { alertness: 15, information: 10, riskScore: -5, identityAnxiety: -10 },
              nextSceneId: "west_s_end_safe",
              feedback: "✅ 你識別了假移民局詐騙、沒有付款、向 International Office 核實、舉報了騙子。整套流程完美。",
              feedbackType: "good"
            }
          ]
        },
        // ── 結局 ──
        {
          id: "west_s_end_safe",
          type: "ending",
          speaker: "system",
          text: "你沒有被「遣返威脅」嚇到，沒有買禮品卡，沒有付款。你去了 International Office 確認簽證完全正常，還舉報了詐騙電話。這類「假移民局」詐騙每年騙走海外學生幾千萬美元，而你成功識破了它。",
          choices: [{ id: "west_end_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "west_s_end_loss",
          type: "ending",
          speaker: "system",
          text: "你按要求買了 Google Play 禮品卡，把號碼給了對方。對方說「處理中，24 小時內退款」，然後掛了電話。你的簽證當然沒有任何問題——因為從一開始就沒問題。你損失了 2,000 美元，而騙子拿到的是無法追回的禮品卡號碼。政府部門永遠不會通過電話要求立即付款，更不會接受禮品卡。",
          choices: [{ id: "west_end_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ],

  // ==================== 東南亞 ====================
  southeast_asia: [
    {
      id: "sea_hotel_payment_problem",
      region: "southeast_asia",
      title: "酒店付款異常：連環釣魚",
      scamType: "旅遊平台釣魚 + 假前台電話 + 信用卡資料詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: [
        "短訊連結域名是「hotel-confirm.net」——不是 booking.com 或 agoda.com",
        "短訊後「酒店前台」主動打電話來——真正的酒店前台不會打電話催你重新付款",
        "要求提供信用卡完整資料（卡號 + 有效期 + CVV）——正規付款不需要在第三方頁面填這些",
        "「30 分鐘內不處理就取消房間」——剛到異地的焦慮被精準利用",
        "對方知道你姓名和訂單號——這些資料可能從酒店系統洩露或旅行社外流"
      ],
      officialChannels: [
        "打開原訂房 App（Booking.com / Agoda）查看訂單狀態",
        "直接致電酒店官方電話（從訂單確認頁或 Google 搜索，不要用對方給的號碼）",
        "直接前往酒店前台辦理入住——前台有你的訂單記錄"
      ],
      pressureSource: ["剛到陌生國家的焦慮", "擔心沒有住宿", "語言不通壓力", "假前台電話增加信任感"],
      scenes: [
        // ── 場景1：鋪墊——剛到機場收到短訊 ──
        {
          id: "sea_s1_sms",
          type: "message",
          speaker: "system",
          text: "你剛踏出曼谷機場，熱浪撲面而來。你拉著行李、拿著手機，正準備叫車去酒店——手機震了。",
          visual: {
            type: "sms",
            sender: "Booking Notification",
            content: "Your hotel payment has failed. Please complete payment again within 30 minutes, or your room reservation will be automatically cancelled. Tap here to re-enter payment details:",
            link: "https://booking-payment-verify.hotel-confirm.net/retry"
          },
          choices: [
            {
              id: "sea_c1_click",
              text: "😰 剛到就說付款失敗？！點連結重新付",
              effects: { riskScore: 30, stress: -5, information: -10 },
              nextSceneId: "sea_s2_fake_payment",
              feedback: "⚠️ 人剛到陌生地方最容易被這類訊息騙到——因為你慌了。先看網址：hotel-confirm.net 不是 Booking.com 的域名。",
              feedbackType: "bad"
            },
            {
              id: "sea_c1_app",
              text: "📱 先不急，打開 Booking.com App 查看訂單",
              effects: { information: 25, alertness: 15, riskScore: -15 },
              nextSceneId: "sea_s2_app_ok",
              feedback: "✅ 對！官方 App 看訂單才是正確做法。短訊連結一律不點。",
              feedbackType: "good"
            },
            {
              id: "sea_c1_call_hotel",
              text: "📞 打電話給酒店前台直接問",
              effects: { information: 30, alertness: 15, riskScore: -20, stress: -10 },
              nextSceneId: "sea_s2_hotel_confirm",
              feedback: "✅ 直接聯絡酒店是最直接的核實！他們有你的預訂記錄。",
              feedbackType: "good"
            },
            {
              id: "sea_c1_ignore_go",
              text: "🚕 不理會短訊，直接打車去酒店",
              effects: { information: 15, stress: 5, riskScore: -5 },
              nextSceneId: "sea_s2_arrive_hotel",
              feedback: "✅ 直接去前台是最安全的！酒店有你的預訂記錄，假訊息騙不走你的房間。",
              feedbackType: "good"
            },
            {
              id: "sea_c1_search",
              text: "🔍 搜索這個短訊的網址",
              effects: { information: 20, alertness: 15, riskScore: -5 },
              nextSceneId: "sea_s2_search_url",
              feedback: "✅ 搜索域名是好習慣！hotel-confirm.net 是已知詐騙域名。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2A：點了連結——假付款頁 ──
        {
          id: "sea_s2_fake_payment",
          type: "webpage",
          speaker: "system",
          text: "頁面打開了，設計得很像 Booking.com，藍色配色、Logo 位置都對。但網址欄清楚寫著「hotel-confirm.net」。頁面要你重新輸入信用卡資料。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：hotel-confirm.net（假的！）\n真正 Booking.com 域名：booking.com\n\n頁面要求：\n• 信用卡號碼（16 位）← 洩露了很麻煩\n• 到期日\n• CVV 安全碼 ← 高風險！\n• OTP 一次性驗證碼 ← 填了等於授權刷卡\n\n頁面還有倒計時：「Session expires in 14:32」"
          },
          choices: [
            {
              id: "sea_c2a_enter_card",
              text: "💳 填信用卡資料，重新付款",
              effects: { money: -60, riskScore: 50, information: -20 },
              nextSceneId: "sea_s_end_loss",
              feedback: "❌ 你的信用卡資料被盜了——卡號 + CVV + OTP，騙子可以用這些在全世界任何地方消費。",
              feedbackType: "bad"
            },
            {
              id: "sea_c2a_notice_url",
              text: "🔍 等等——hotel-confirm.net 不是 booking.com！關掉！",
              effects: { alertness: 30, information: 20, riskScore: -20 },
              nextSceneId: "sea_s3_after_close",
              feedback: "✅ 你在緊張的環境下還能注意網址，非常了不起！看域名是防釣魚最有效的方法。",
              feedbackType: "good"
            },
            {
              id: "sea_c2a_call_hotel_now",
              text: "📞 先不填，打電話給酒店前台確認",
              effects: { information: 25, alertness: 20, riskScore: -15 },
              nextSceneId: "sea_s2_hotel_confirm",
              feedback: "✅ 暫停一下打電話，是在假網站前最好的選擇。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2B：查了 App ──
        {
          id: "sea_s2_app_ok",
          type: "result",
          speaker: "system",
          text: "你打開 Booking.com App，登入帳號查看訂單。",
          visual: {
            type: "safe_result",
            content: "🏨 Booking.com 訂單狀態：\n\n✅ 付款狀態：已成功\n✅ 房間狀態：已確認\n✅ 入住日期：今天\n✅ 取消政策：今晚 18:00 前免費取消\n\n那條「付款失敗」訊息不是官方發的。\n但 5 分鐘後，你的手機響了——顯示「酒店前台」……"
          },
          choices: [
            {
              id: "sea_c2b_answer",
              text: "📞 接電話，可能是酒店前台有事情",
              effects: { stress: 10, riskScore: 15 },
              nextSceneId: "sea_s3_fake_front_desk",
              feedback: "⚠️ 你查了 App 知道訂單沒問題，但騙子還有下一步——假裝酒店前台打電話。",
              feedbackType: "mid"
            },
            {
              id: "sea_c2b_ignore",
              text: "📵 App 顯示沒問題，不接陌生電話",
              effects: { alertness: 15, riskScore: -10 },
              nextSceneId: "sea_s3_missed_call_msg",
              feedback: "✅ 你有 App 的核實作支撐，不接陌生電話完全合理。",
              feedbackType: "good"
            },
            {
              id: "sea_c2b_go_hotel",
              text: "🚕 直接打車去酒店前台辦理入住",
              effects: { stress: -10, information: 5 },
              nextSceneId: "sea_s2_arrive_hotel",
              feedback: "✅ 直接去前台是最穩妥的方式。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2C：打給酒店 ──
        {
          id: "sea_s2_hotel_confirm",
          type: "result",
          speaker: "system",
          text: "你從訂單確認郵件裡找到酒店官方電話，打過去。前台接電話了。",
          visual: {
            type: "safe_result",
            content: "📞 酒店前台回覆（官方電話）：\n\n✅ 您的預訂：已確認\n✅ 付款：已收到\n✅ 房間：已保留\n✅ 入住時間：下午 2 點後\n\n前台說：「我們不會發短訊要求重新付款。\n如果您收到任何關於付款失敗的訊息，請直接聯繫我們確認。」"
          },
          choices: [
            {
              id: "sea_c2c_report",
              text: "📢 謝謝！我收到一條詐騙短訊，想舉報",
              effects: { alertness: 15, information: 10, riskScore: -5 },
              nextSceneId: "sea_s4_report",
              feedback: "✅ 向酒店舉報詐騙短訊，他們可以提醒其他客人。",
              feedbackType: "good"
            },
            {
              id: "sea_c2c_go",
              text: "🚕 確認沒問題了，打車去酒店",
              effects: { stress: -15, information: 5 },
              nextSceneId: "sea_s2_arrive_hotel",
              feedback: "✅ 核實了就放心出發！這個習慣在旅行中非常重要。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2D：搜索域名 ──
        {
          id: "sea_s2_search_url",
          type: "result",
          speaker: "system",
          text: "你搜索了「hotel-confirm.net」，結果很明確。",
          visual: {
            type: "warning_page",
            content: "🔍 搜索結果：\n\n「hotel-confirm.net 詐騙」\n——超過 200 條結果\n\n最新帖子（3 天前）：\n「收到 Booking.com 付款失敗短訊，連結是 hotel-confirm.net，假的！」\n\n⚠️ 這是已知的釣魚域名。\nBooking.com 官方只使用 booking.com 域名。"
          },
          choices: [
            {
              id: "sea_c2d_app",
              text: "📱 確認是詐騙了，打開 App 查訂單",
              effects: { information: 20, alertness: 15, riskScore: -10 },
              nextSceneId: "sea_s2_app_ok",
              feedback: "✅ 搜索確認了，再用 App 查一遍，雙重核實。",
              feedbackType: "good"
            },
            {
              id: "sea_c2d_report",
              text: "📢 直接舉報這個域名",
              effects: { alertness: 15, information: 10, riskScore: -5 },
              nextSceneId: "sea_s4_report",
              feedback: "✅ 舉報釣魚域名可以幫助封鎖它，保護其他旅客。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景2E：直接去酒店 ──
        {
          id: "sea_s2_arrive_hotel",
          type: "result",
          speaker: "system",
          text: "你到了酒店，前台微笑著確認了你的預訂。順利辦理入住，拿到了房卡。",
          visual: {
            type: "safe_result",
            content: "🏨 入住成功！\n\n前台：訂單有效，付款已收到。\n房間已準備好，歡迎入住！\n\n💡 旅行中遇到可疑訊息的黃金法則：\n• 先查官方 App，不點陌生連結\n• 酒店問題直接去前台或打官方電話\n• 出發前把酒店電話存進手機"
          },
          choices: [
            {
              id: "sea_c2e_done",
              text: "😊 完美！安全入住，學到了",
              effects: { stress: -10, information: 5, localFamiliarity: 5 },
              nextSceneId: "sea_s_end_safe",
              feedback: "✅ 在陌生環境遇到緊急訊息，先停一下用官方渠道核實，是保護自己最好的方式。",
              feedbackType: "good"
            },
            {
              id: "sea_c2e_report",
              text: "📢 順手跟酒店說一下那條詐騙短訊",
              effects: { alertness: 10, information: 5 },
              nextSceneId: "sea_s4_report",
              feedback: "✅ 提醒酒店可以幫助他們保護其他客人。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3A：假前台電話 ──
        {
          id: "sea_s3_fake_front_desk",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你接了電話，對方說自己是酒店前台，口音聽起來像當地人，語氣很專業。",
          visual: {
            type: "phone_call",
            caller: "顯示：Hotel Front Desk",
            content: "Good afternoon, this is the front desk of your hotel. We received a notification from Booking.com that your payment didn't go through. We need you to confirm your card details over the phone so we can secure your reservation. Otherwise, we may have to release your room to another guest."
          },
          choices: [
            {
              id: "sea_c3a_give_card",
              text: "😰 房間要被取消？我報信用卡號碼",
              effects: { money: -55, riskScore: 50, information: -15 },
              nextSceneId: "sea_s_end_loss",
              feedback: "❌ 真正的酒店前台不會打電話來要你的信用卡資料！你的訂單已經付款了，他們不需要任何東西。",
              feedbackType: "bad"
            },
            {
              id: "sea_c3a_question",
              text: "🤔 問她：我 App 顯示付款成功了，為什麼說沒收到？",
              effects: { alertness: 20, information: 10, stress: 10 },
              nextSceneId: "sea_s4_fake_desk_excuse",
              feedback: "🤔 好問題。真正的酒店可以查系統確認付款狀態，騙子則需要編理由。",
              feedbackType: "mid"
            },
            {
              id: "sea_c3a_hangup",
              text: "📵 掛電話，用剛才打過的官方號碼回撥前台",
              effects: { alertness: 30, information: 25, riskScore: -25 },
              nextSceneId: "sea_s2_hotel_confirm",
              feedback: "✅ 完美操作！掛掉後用你之前確認過的官方號碼回撥——如果是真前台，他們會知道。",
              feedbackType: "good"
            },
            {
              id: "sea_c3a_go_front",
              text: "🚶 我就在附近，直接去前台處理",
              effects: { alertness: 20, riskScore: -15 },
              nextSceneId: "sea_s2_arrive_hotel",
              feedback: "✅ 最直接的方式！人在酒店，直接去前台比電話核實更快更安全。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3B：沒接電話後收到短訊 ──
        {
          id: "sea_s3_missed_call_msg",
          type: "message",
          speaker: "system",
          text: "你沒接電話，對方留了語音，然後又發來一條短訊。",
          visual: {
            type: "sms",
            sender: "Hotel Booking Alert",
            content: "We tried to contact you regarding your hotel payment. Your reservation is at risk of cancellation. Please complete payment within 1 hour: https://booking-confirm.hotel-confirm.net/pay"
          },
          choices: [
            {
              id: "sea_c3b_click",
              text: "😰 又發來了……點開看看吧",
              effects: { riskScore: 25, information: -10 },
              nextSceneId: "sea_s2_fake_payment",
              feedback: "⚠️ 同一個域名 hotel-confirm.net！騙子在多管齊下。",
              feedbackType: "bad"
            },
            {
              id: "sea_c3b_same_domain",
              text: "🔍 又是 hotel-confirm.net——跟剛才那條一樣！",
              effects: { alertness: 25, information: 20, riskScore: -15 },
              nextSceneId: "sea_s4_report",
              feedback: "✅ 你認出了同一個詐騙域名！這是同一夥人的連環局。",
              feedbackType: "good"
            },
            {
              id: "sea_c3b_go_hotel",
              text: "🚕 不管了，直接去酒店前台",
              effects: { alertness: 15, riskScore: -10 },
              nextSceneId: "sea_s2_arrive_hotel",
              feedback: "✅ 直接去前台是最穩妥的方式。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景3C：關掉假網站後 ──
        {
          id: "sea_s3_after_close",
          type: "result",
          speaker: "system",
          text: "你關掉了假網站。但你還是有點擔心：萬一訂單真的有問題怎麼辦？",
          visual: {
            type: "safe_result",
            content: "✅ 你關掉了假網站——做得好！\n\n現在有幾個選擇：\n• 打開 Booking.com App 查訂單\n• 打電話給酒店前台\n• 直接去酒店\n\n任何一個都比在假網站輸入信用卡資料安全。"
          },
          choices: [
            {
              id: "sea_c3c_app",
              text: "📱 打開 App 查訂單",
              effects: { information: 20, alertness: 10, riskScore: -5 },
              nextSceneId: "sea_s2_app_ok",
              feedback: "✅ App 是最快的核實方式。",
              feedbackType: "good"
            },
            {
              id: "sea_c3c_hotel",
              text: "📞 打電話給酒店",
              effects: { information: 20, alertness: 10, riskScore: -5 },
              nextSceneId: "sea_s2_hotel_confirm",
              feedback: "✅ 打電話確認，徹底安心。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4A：假前台解釋 ──
        {
          id: "sea_s4_fake_desk_excuse",
          type: "phone_call",
          speaker: "scammer",
          pressure: true,
          text: "你質疑了為什麼 App 顯示付款成功，對方有備而來。",
          visual: {
            type: "phone_call",
            caller: "「酒店前台」",
            content: "The Booking.com App sometimes doesn't update in real-time. Our system shows the payment as 'pending' — it hasn't been processed yet. If you want to keep your room, I need you to read me your card number so I can process it manually. It will take just 2 minutes."
          },
          choices: [
            {
              id: "sea_c4a_believe",
              text: "😟 App 沒更新……好吧，我報卡號",
              effects: { money: -55, riskScore: 50, information: -15 },
              nextSceneId: "sea_s_end_loss",
              feedback: "❌ 「App 沒更新」是騙子的標準台詞。Booking.com 的付款狀態是即時的，沒有延遲一說。",
              feedbackType: "bad"
            },
            {
              id: "sea_c4a_hangup",
              text: "📵 我 App 顯示成功，那就是成功。掛電話，去前台",
              effects: { alertness: 30, information: 20, riskScore: -25 },
              nextSceneId: "sea_s2_arrive_hotel",
              feedback: "✅ 你相信官方 App 的數據，而不是電話裡的陌生人。這是正確的判斷。",
              feedbackType: "good"
            }
          ]
        },
        // ── 場景4B：舉報 ──
        {
          id: "sea_s4_report",
          type: "result",
          speaker: "system",
          text: "你決定舉報這個詐騙短訊和假網站。",
          visual: {
            type: "safe_result",
            content: "🛡️ 舉報渠道：\n• Booking.com 幫助中心 → 舉報詐騙\n• Agoda 客服 → 回報可疑訊息\n• 當地觀光警察（Tourist Police）\n• 大使館（護照遺失/緊急情況）\n\n💡 你的舉報可以幫助平台封鎖這個假網站！"
          },
          choices: [
            {
              id: "sea_c4b_done",
              text: "✅ 舉報完成！現在去酒店入住",
              effects: { alertness: 15, information: 10, riskScore: -5 },
              nextSceneId: "sea_s_end_safe",
              feedback: "✅ 識別 → 核實 → 舉報，你保護了自己，也幫助了其他旅客。",
              feedbackType: "good"
            }
          ]
        },
        // ── 結局 ──
        {
          id: "sea_s_end_safe",
          type: "ending",
          speaker: "system",
          text: "你通過官方 App 確認訂單完全正常，或者直接去酒店前台辦理了入住。那條「付款失敗」短訊是詐騙，假裝酒店前台的電話也是同一夥人。你沒有點連結、沒有洩露信用卡資料、沒有被「房間取消」的威脅嚇到。旅行可以安心開始了。",
          choices: [{ id: "sea_end_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "sea_s_end_loss",
          type: "ending",
          speaker: "system",
          text: "幾分鐘後，你的手機響起一連串消費通知——1,200 美元、680 美元、340 美元……都是未授權消費。你的信用卡資料已經被騙子賣出去了。你立刻聯絡銀行凍結卡片，但部分交易已經完成。假網站和假前台電話——這是同一夥人的連環局，而你剛到異國的第一天就踩中了。",
          choices: [{ id: "sea_end_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ]
};
