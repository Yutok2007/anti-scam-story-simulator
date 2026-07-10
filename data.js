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
      title: "快遞地址異常",
      scamType: "快遞釣魚詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: ["陌生短連結域名不是官方快遞公司", "要求填寫身份證和銀行卡號", "不通過官方快遞 App 處理", "「今日 18:00 前」的限時話術"],
      officialChannels: ["直接打開官方快遞 App 查詢物流", "致電快遞公司官方客服", "不要點擊任何短訊連結"],
      pressureSource: ["包裹退回壓力", "限時壓力"],
      scenes: [
        {
          id: "cn_express_s1",
          type: "message",
          speaker: "system",
          text: "你正在宿舍等一個快遞，突然收到這條短訊。你確實在等包裹，所以第一反應覺得好像是真的。",
          visual: {
            type: "sms",
            sender: "【快遞通知】",
            content: "您的包裹因地址異常無法派送，請於今日 18:00 前點擊連結重新填寫收貨資料，逾期將自動退回寄件方。",
            link: "http://kd-update.cn-track.xyz/re-fill?id=7732"
          },
          choices: [
            {
              id: "cn_express_c1_click_link",
              text: "📲 先點開連結看看要填什麼",
              effects: { information: -10, stress: -5, riskScore: 25 },
              nextSceneId: "cn_express_s2_fake_page",
              feedback: "⚠️ 先等一下——「cn-track.xyz」不是任何正規快遞公司的域名。陌生連結點了之後，你就進入了騙子的地盤。",
              feedbackType: "bad"
            },
            {
              id: "cn_express_c1_check_app",
              text: "📦 不點連結，直接打開快遞 App 查物流",
              effects: { information: 25, alertness: 10, stress: -5, riskScore: -10 },
              nextSceneId: "cn_express_s2_safe_check",
              feedback: "✅ 對！官方 App 是唯一可信的查詢方式。短訊連結，一律不點。",
              feedbackType: "good"
            },
            {
              id: "cn_express_c1_ignore",
              text: "🙈 感覺像詐騙，直接無視",
              effects: { alertness: 5, stress: 5 },
              nextSceneId: "cn_express_s2_uncertain",
              feedback: "🤔 不點連結是對的，但如果你真的有包裹在等，還是建議用官方 App 確認一下更安心。",
              feedbackType: "mid"
            },
            {
              id: "cn_express_c1_search_text",
              text: "🔍 搜索一下這個短訊，看有沒有人反映過",
              effects: { information: 15, alertness: 10, stress: -5, riskScore: -5 },
              nextSceneId: "cn_express_s2_safe_check",
              feedback: "✅ 搜索是個好習慣！這類「快遞地址異常」短訊是已知釣魚詐騙，網上一搜一大把。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "cn_express_s2_fake_page",
          type: "webpage",
          speaker: "system",
          text: "頁面打開了，UI 做得還挺像模像樣，但網址欄顯示「cn-track.xyz」，絕對不是順豐、中通、菜鳥這些的官方域名。頁面要你填：姓名、手機號、身份證號、銀行卡號、驗證碼。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：cn-track.xyz（非官方域名）\n\n表單內容：\n• 真實姓名\n• 手機號碼\n• 身份證號碼 ← 洩露後麻煩很大\n• 銀行卡號 ← 絕對不能填！\n• 手機驗證碼 ← 填了等於把帳戶交出去"
          },
          choices: [
            {
              id: "cn_express_c2_fill_all",
              text: "📝 都填上吧，包裹退回就麻煩了",
              effects: { money: -30, information: -20, riskScore: 40, stress: -10 },
              nextSceneId: "cn_express_end_loss",
              feedback: "❌ 身份證號 + 銀行卡號 + 驗證碼，這三樣加起來，騙子可以直接操作你的銀行帳戶，不需要你再做任何事。",
              feedbackType: "bad"
            },
            {
              id: "cn_express_c2_stop",
              text: "🚫 等等，要填銀行卡和驗證碼？這不對，立刻退出",
              effects: { alertness: 20, information: 15, riskScore: -15, stress: -5 },
              nextSceneId: "cn_express_end_safe",
              feedback: "✅ 看到「銀行卡號」和「驗證碼」就要警惕。正規快遞處理地址問題，根本不需要這些。",
              feedbackType: "good"
            },
            {
              id: "cn_express_c2_ask_friend",
              text: "📸 截圖發給室友問一下",
              effects: { information: 10, socialPressure: 5, riskScore: -5 },
              nextSceneId: "cn_express_s3_friend_reply",
              feedback: "🤔 找室友問也行，但別在等回覆的時候手賤填了什麼。",
              feedbackType: "mid"
            }
          ]
        },
        {
          id: "cn_express_s3_friend_reply",
          type: "chat",
          speaker: "friend",
          text: "你把截圖發給室友小王，他很快回了。",
          visual: {
            type: "chat",
            app: "微信",
            appIcon: "💬",
            messages: [
              { type: "outgoing", name: "你", text: "[圖片：填寫頁面截圖]" },
              { type: "incoming", name: "小王", text: "哇這個我上週見過！假的！快遞公司不會讓你在這種頁面填銀行卡的" },
              { type: "incoming", name: "小王", text: "你有沒有填了啥？有的話趕快改密碼！！" }
            ]
          },
          choices: [
            {
              id: "cn_express_c3_exit_now",
              text: "✅ 沒填！立刻退出，謝謝提醒",
              effects: { alertness: 20, information: 20, riskScore: -20 },
              nextSceneId: "cn_express_end_safe",
              feedback: "✅ 沒有損失。朋友的提醒讓你躲過了這一關。",
              feedbackType: "good"
            },
            {
              id: "cn_express_c3_already_filled",
              text: "😰 我填了手機號，但還沒提交銀行卡",
              effects: { stress: 15, information: 10, riskScore: 10 },
              nextSceneId: "cn_express_end_partial",
              feedback: "⚠️ 手機號洩露之後，後續可能會收到更精準的詐騙電話。建議向反詐中心舉報這個連結。",
              feedbackType: "bad"
            }
          ]
        },
        {
          id: "cn_express_s2_safe_check",
          type: "result",
          speaker: "system",
          text: "你打開了官方快遞 App，輸入手機號查詢。結果顯示：包裹正在正常派送，預計明天到，地址完全沒有問題。那條短訊是假的。",
          visual: {
            type: "safe_result",
            content: "📦 快遞狀態：正常派送中\n📍 地址：確認無誤\n🔔 預計到達：明日上午\n\n那條短訊是釣魚詐騙。"
          },
          choices: [
            {
              id: "cn_express_safe_confirm",
              text: "✅ 確認是詐騙，順手舉報這條短訊",
              effects: { alertness: 10, information: 10, riskScore: -5 },
              nextSceneId: "cn_express_s3_report",
              feedback: "✅ 自己確認了再舉報，這才叫完整處理。",
              feedbackType: "good"
            },
            {
              id: "cn_express_safe_share",
              text: "📢 截圖發到宿舍群，提醒大家別上當",
              effects: { alertness: 10, socialPressure: -5, information: 10 },
              nextSceneId: "cn_express_s3_report",
              feedback: "✅ 提醒身邊的人，是防詐騙最有效的方式之一。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "cn_express_s3_report",
          type: "result",
          speaker: "system",
          text: "你決定舉報這條詐騙短訊。這一步很多人懶得做，但正是因為有人舉報，這類詐騙的連結才會被持續封鎖。",
          visual: {
            type: "safe_result",
            content: "🛡️ 怎麼舉報：\n• 長按短訊 → 舉報垃圾短訊（移動/聯通/電信都有）\n• 12321.cn 網絡舉報中心\n• 國家反詐中心 App → 「我要舉報」\n\n每一次舉報都在保護下一個可能被騙的人。"
          },
          choices: [
            {
              id: "cn_express_s3_done",
              text: "📱 舉報完成，這類短訊以後一眼就認出來了",
              effects: { alertness: 10, information: 5 },
              nextSceneId: "cn_express_end_safe",
              feedback: "✅ 識別 → 核實 → 舉報，你已經掌握了完整的應對流程。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "cn_express_s2_uncertain",
          type: "result",
          speaker: "system",
          text: "你沒有點連結。幾個小時後，你開始糾結：萬一包裹真的退回怎麼辦？",
          visual: { type: "safe_result", content: "🤔 你還在糾結中……\n\n其實主動查一下只需要30秒。" },
          choices: [
            {
              id: "cn_express_uncertain_check",
              text: "📦 算了，打開快遞 App 確認一下",
              effects: { information: 20, alertness: 10, stress: -5 },
              nextSceneId: "cn_express_s2_safe_check",
              feedback: "✅ 主動查比乾等更安心，這個習慣養成了就很好。",
              feedbackType: "good"
            },
            {
              id: "cn_express_uncertain_ignore",
              text: "🙈 算了算了，不管它了",
              effects: { alertness: 5, information: 5 },
              nextSceneId: "cn_express_s3_next_day",
              feedback: "⚠️ 這次沒事，但碰到真正有問題的包裹，不主動查可能就錯過了。",
              feedbackType: "mid"
            }
          ]
        },
        {
          id: "cn_express_s3_next_day",
          type: "result",
          speaker: "system",
          text: "第二天，快遞正常送到了。說明那條短訊確實是假的，你的包裹一直都好好的。",
          visual: { type: "safe_result", content: "📦 包裹已正常送達！\n\n那條短訊是詐騙。\n下次遇到類似情況，記得用官方 App 核實，不要靠猜。" },
          choices: [
            {
              id: "cn_express_nextday_ok",
              text: "👍 明白了，有包裹問題先查 App，不點陌生連結",
              effects: { alertness: 10, information: 5 },
              nextSceneId: "cn_express_end_safe",
              feedback: "✅ 記住：快遞異常 → 官方 App 查 → 絕對不點短訊連結。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "cn_express_end_loss",
          type: "ending",
          speaker: "system",
          text: "幾個小時後，你收到銀行轉帳提醒——2,800 元，對象是一個陌生帳號。你立刻打電話給快遞公司，對方說從來沒有發過這條短訊。你的銀行卡資料和驗證碼已經被騙子拿走了。",
          choices: [{ id: "cn_express_final", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        },
        {
          id: "cn_express_end_safe",
          type: "ending",
          speaker: "system",
          text: "你沒有點陌生連結，也沒有洩露任何個人資料。你用官方 App 確認了包裹狀態，識別了這次詐騙，還舉報了騙子的短訊。完美。",
          choices: [{ id: "cn_express_final_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "cn_express_end_partial",
          type: "ending",
          speaker: "system",
          text: "你洩露了手機號碼。雖然這次沒有財務損失，但之後可能陸續收到更精準的詐騙電話——因為騙子知道你的號碼真實存在，而且你曾經點過他們的連結。",
          choices: [{ id: "cn_express_final_partial", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "mid" }]
        }
      ]
    }
  ],

  // ==================== 港澳 ====================
  hong_kong_macao: [
    {
      id: "hkm_bank_security_sms",
      region: "hong_kong_macao",
      title: "銀行安全驗證",
      scamType: "假銀行短訊 / 釣魚網站",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: ["連結域名是「account-secure.net」而不是 hsbc.com.hk", "要求輸入 OTP 一次性密碼", "以凍結戶口製造緊迫感", "30 分鐘限時壓力"],
      officialChannels: ["打開銀行官方 App 查看帳戶", "致電銀行卡背面的客服電話", "自己手動輸入銀行官方網址，不要點短訊連結"],
      pressureSource: ["帳戶凍結壓力", "30 分鐘限時壓力"],
      scenes: [
        {
          id: "hkm_bank_s1",
          type: "message",
          speaker: "system",
          text: "你下課回到宿舍，手機上有一條新短訊，看起來是銀行發的。",
          visual: {
            type: "sms",
            sender: "HSBC-Alert",
            content: "Your bank account has abnormal login activity detected from an overseas IP. Please verify your account within 30 minutes to avoid suspension. Click here to verify.",
            link: "https://hsbc-hk-verify.account-secure.net/login"
          },
          choices: [
            {
              id: "hkm_bank_c1_click",
              text: "📲 30 分鐘？先點連結看看什麼情況",
              effects: { riskScore: 35, information: -15, stress: -5 },
              nextSceneId: "hkm_bank_s2_fake_login",
              feedback: "⚠️ 注意看網址——「account-secure.net」不是 HSBC 的域名。短訊連結點了，你就進了釣魚網站。",
              feedbackType: "bad"
            },
            {
              id: "hkm_bank_c1_open_app",
              text: "📱 不點連結，打開 HSBC 官方 App 查帳戶",
              effects: { information: 25, alertness: 10, riskScore: -10 },
              nextSceneId: "hkm_bank_s2_safe",
              feedback: "✅ 正確操作！永遠從官方 App 或自己手動輸入網址登入，短訊連結一概不點。",
              feedbackType: "good"
            },
            {
              id: "hkm_bank_c1_call_card",
              text: "📞 掛電話前先打銀行卡背面的客服確認",
              effects: { information: 30, alertness: 15, stress: -10, riskScore: -15 },
              nextSceneId: "hkm_bank_s2_safe",
              feedback: "✅ 銀行卡背面的電話是最可靠的核實方式，任何事都可以打去問。",
              feedbackType: "good"
            },
            {
              id: "hkm_bank_c1_friend",
              text: "💬 截圖發給朋友問問是不是真的",
              effects: { information: 10, socialPressure: 5 },
              nextSceneId: "hkm_bank_s2_friend_uncertain",
              feedback: "🤔 朋友可以參考，但最終還是要自己去官方渠道確認才算數。",
              feedbackType: "mid"
            }
          ]
        },
        {
          id: "hkm_bank_s2_fake_login",
          type: "webpage",
          speaker: "system",
          text: "頁面設計得非常像 HSBC 官網，但網址欄顯示「account-secure.net/login」。頁面要求你輸入網銀帳號、密碼，還有一次性密碼 OTP。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：account-secure.net（假的！）\n真正的 HSBC 域名：hsbc.com.hk\n\n頁面要求：\n• 網銀帳號\n• 網銀密碼\n• 一次性密碼 OTP ← 填了等於帳戶直接拱手相讓"
          },
          choices: [
            {
              id: "hkm_bank_c2_enter_otp",
              text: "🔢 填上 OTP 完成「驗證」",
              effects: { money: -70, riskScore: 50, information: -20 },
              nextSceneId: "hkm_bank_end_loss",
              feedback: "❌ OTP 是你帳戶最後一道防線。輸入之後，騙子不需要你做任何事，直接就能轉走你的錢。",
              feedbackType: "bad"
            },
            {
              id: "hkm_bank_c2_notice_url",
              text: "🔍 等等，這個網址不對！立刻關掉頁面",
              effects: { alertness: 25, information: 20, riskScore: -20 },
              nextSceneId: "hkm_bank_s3_analysis",
              feedback: "✅ 你識別了假網站！看網址域名，是防釣魚攻擊最簡單也最有效的方法。",
              feedbackType: "good"
            },
            {
              id: "hkm_bank_c2_call_bank",
              text: "📞 先暫停，打電話給銀行官方客服確認",
              effects: { information: 30, alertness: 20, riskScore: -25 },
              nextSceneId: "hkm_bank_s3_report",
              feedback: "✅ 完美！在任何可疑操作前先打電話確認，是最聰明的做法。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "hkm_bank_s2_safe",
          type: "result",
          speaker: "system",
          text: "你查看了官方 App 或聯絡了官方客服。結果：帳戶完全正常，沒有任何異常登入記錄。那條短訊是假的。",
          visual: { type: "safe_result", content: "✅ 帳戶狀態：完全正常\n🔒 無異常登入\n\n那條短訊是釣魚詐騙。\nHSBC 官方域名只有 hsbc.com.hk" },
          choices: [
            {
              id: "hkm_bank_safe_ok",
              text: "✅ 明白了，順手舉報這條詐騙短訊",
              effects: { alertness: 10, information: 5 },
              nextSceneId: "hkm_bank_s3_report",
              feedback: "✅ 核實後舉報，可以幫助銀行和警方封鎖這個釣魚網站。",
              feedbackType: "good"
            },
            {
              id: "hkm_bank_safe_check_url",
              text: "🔍 研究一下為什麼這條短訊看起來這麼像真的",
              effects: { alertness: 15, information: 10 },
              nextSceneId: "hkm_bank_s3_analysis",
              feedback: "✅ 搞清楚騙術的原理，下次就不會被同類手法騙到。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "hkm_bank_s3_analysis",
          type: "result",
          speaker: "system",
          text: "你分析了那條假短訊的套路，騙子用了好幾個技巧讓它看起來非常真實。",
          visual: {
            type: "warning_page",
            content: "🔍 詐騙短訊分析：\n\n① 發件人顯示「HSBC-Alert」—— 任何人都能偽造這個名稱\n② 「abnormal activity」+「30 minutes」—— 製造恐慌和緊迫感\n③ 連結用了「account-secure.net」—— 讓你下意識覺得「安全」\n④ 真正的 HSBC 只叫你打開 App 或打電話，不會發連結"
          },
          choices: [
            {
              id: "hkm_bank_analysis_report",
              text: "📋 學到了！準備舉報這條短訊",
              effects: { alertness: 10, information: 10 },
              nextSceneId: "hkm_bank_s3_report",
              feedback: "✅ 了解騙術套路，下次看到類似的東西就能一眼看穿。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "hkm_bank_s3_report",
          type: "result",
          speaker: "system",
          text: "你可以截圖這條詐騙短訊，通過以下渠道舉報：",
          visual: {
            type: "safe_result",
            content: "🛡️ 港澳舉報渠道：\n• 香港警方反詐騙協調中心：18222\n• scam.org.hk 網上舉報\n• 向電訊服務商舉報垃圾短訊\n• 澳門治安警察局：993"
          },
          choices: [
            {
              id: "hkm_bank_report_done",
              text: "✅ 舉報完成，以後看到連結先查域名",
              effects: { alertness: 5, information: 5, riskScore: -5 },
              nextSceneId: "hkm_bank_end_safe",
              feedback: "✅ 每一次舉報都在幫助警方追蹤和封鎖這些釣魚網站。你做得很好。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "hkm_bank_s2_friend_uncertain",
          type: "chat",
          speaker: "friend",
          text: "你發給朋友，他很快回了。",
          visual: {
            type: "chat",
            app: "WhatsApp",
            appIcon: "💬",
            messages: [
              { type: "outgoing", name: "你", text: "[截圖：銀行短訊]" },
              { type: "incoming", name: "Kelvin", text: "那個 account-secure.net 不是 HSBC 的域名，感覺假的" },
              { type: "incoming", name: "Kelvin", text: "不要點！打開 HSBC App 或打卡背電話確認吧" }
            ]
          },
          choices: [
            {
              id: "hkm_bank_friend_app",
              text: "📱 聽朋友的，打開 HSBC 官方 App",
              effects: { information: 20, alertness: 15, riskScore: -15 },
              nextSceneId: "hkm_bank_s2_safe",
              feedback: "✅ 朋友判斷對了，你也做出了正確選擇。",
              feedbackType: "good"
            },
            {
              id: "hkm_bank_friend_click_anyway",
              text: "😟 但萬一是真的怎麼辦……還是先點看看",
              effects: { riskScore: 25, stress: 10 },
              nextSceneId: "hkm_bank_s2_fake_login",
              feedback: "⚠️ 「萬一是真的」就是騙子希望你有的心態。記住：官方銀行不會讓你點短訊連結。",
              feedbackType: "bad"
            }
          ]
        },
        {
          id: "hkm_bank_end_loss",
          type: "ending",
          speaker: "system",
          text: "輸入 OTP 後，帳戶立刻發生了未授權轉帳。你聯絡銀行時，部分資金已經轉走了。騙子就等著你輸入那個驗證碼——一旦填上，帳戶就不再是你的了。",
          choices: [{ id: "hkm_bank_final_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        },
        {
          id: "hkm_bank_end_safe",
          type: "ending",
          speaker: "system",
          text: "你沒有點假連結，帳戶完全安全。你還弄清楚了假銀行短訊的套路——域名偽裝、緊迫感製造、OTP 釣魚，這些手法現在你都認識了。",
          choices: [{ id: "hkm_bank_final_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        }
      ]
    }
  ],

  // ==================== 台灣 ====================
  taiwan: [
    {
      id: "tw_atm_cancel_installment",
      region: "taiwan",
      title: "ATM 解除分期付款",
      scamType: "冒充客服 / ATM 操作詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: ["ATM 根本沒有「解除分期」功能", "要求跟著電話一步步操作 ATM", "對方知道你的訂單資訊（資料可能已外洩）", "「今晚 12 點就扣款」的時間壓力"],
      officialChannels: ["回到原購物平台查看訂單記錄", "掛電話後自己查銀行官方電話再撥", "撥打 165 反詐騙專線"],
      pressureSource: ["連續扣款恐慌", "假客服身份偽裝"],
      scenes: [
        {
          id: "tw_atm_s1",
          type: "phone_call",
          speaker: "system",
          text: "你正在準備明天的報告，突然接到一通電話，對方自稱是購物平台客服。",
          visual: {
            type: "phone_call",
            caller: "未知號碼 +886-2-XXXX-XXXX",
            content: "您好，我是蝦皮購物客服。您之前在平台購買的商品，被系統誤設為每月自動扣款方案，如果不處理將連續扣款 12 個月，每月 3,200 元。需要立刻到 ATM 操作取消，我在電話上指導您。"
          },
          choices: [
            {
              id: "tw_atm_c1_follow",
              text: "😰 這麼嚴重？那我馬上去 ATM，快說怎麼操作",
              effects: { stress: -5, riskScore: 35, information: -10 },
              nextSceneId: "tw_atm_s2_atm",
              feedback: "⚠️ ATM 根本沒有「解除分期付款」這個功能。任何讓你跟著電話操作 ATM 的，都是詐騙。",
              feedbackType: "bad"
            },
            {
              id: "tw_atm_c1_platform",
              text: "🛍️ 先掛電話，去蝦皮 App 查我的訂單",
              effects: { information: 30, alertness: 15, riskScore: -15 },
              nextSceneId: "tw_atm_s3_check_order",
              feedback: "✅ 正確！查原購物平台的訂單記錄，是最直接的核實方式。",
              feedbackType: "good"
            },
            {
              id: "tw_atm_c1_bank",
              text: "📞 掛電話，自己查銀行官方電話打過去確認",
              effects: { information: 30, alertness: 20, riskScore: -20 },
              nextSceneId: "tw_atm_s4_bank_confirm",
              feedback: "✅ 銀行客服會直接告訴你帳戶根本沒有任何分期問題。",
              feedbackType: "good"
            },
            {
              id: "tw_atm_c1_question",
              text: "🤔 問對方：為什麼要用 ATM 才能取消？",
              effects: { information: 10, stress: 10, riskScore: 5 },
              nextSceneId: "tw_atm_s2_pressure",
              feedback: "🤔 這個問題問得好，但騙子早就有準備好的答案。最好的方式是掛電話，自己去查。",
              feedbackType: "mid"
            }
          ]
        },
        {
          id: "tw_atm_s2_pressure",
          type: "phone_call",
          speaker: "scammer",
          text: "你的問題讓對方有點不耐煩，語氣變強硬了。",
          visual: {
            type: "phone_call",
            caller: "「客服人員」",
            content: "這是系統錯誤，您只能配合在 ATM 操作才能解除。如果您現在不處理，今晚 12 點就會開始扣款！您現在在哪裡？可以去 ATM 嗎？"
          },
          choices: [
            {
              id: "tw_atm_pressure_follow",
              text: "😰 好吧……我現在去 ATM",
              effects: { stress: 5, riskScore: 25 },
              nextSceneId: "tw_atm_s2_atm",
              feedback: "⚠️ ATM 沒有解除分期的功能！「今晚 12 點扣款」是讓你停止思考的話術。",
              feedbackType: "bad"
            },
            {
              id: "tw_atm_pressure_hangup",
              text: "📵 感覺不對，掛電話，打 165 確認",
              effects: { alertness: 20, information: 25, riskScore: -25 },
              nextSceneId: "tw_atm_s4_165_report",
              feedback: "✅ 掛電話是正確的！165 是台灣的反詐騙專線，打過去就能確認。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "tw_atm_s2_atm",
          type: "message",
          speaker: "system",
          text: "你來到 ATM 前，對方在電話裡一步一步指導你。你看到螢幕上有「轉帳」選項，對方讓你選這個，然後輸入一個帳號和金額。",
          visual: {
            type: "warning_page",
            content: "🏧 ATM 操作選單：\n\n1. 查詢餘額\n2. 提款\n3. ➡️ 轉帳 ← 對方要你選這個\n4. 繳費\n\n⚠️ 「轉帳」就是把錢打給別人\nATM 沒有任何「解除分期」功能！\n這就是詐騙。"
          },
          choices: [
            {
              id: "tw_atm_c2_transfer",
              text: "💸 按照指示，輸入帳號和金額，確認轉帳",
              effects: { money: -65, riskScore: 50 },
              nextSceneId: "tw_atm_end_loss",
              feedback: "❌ 錢轉出去了。ATM「解除分期」是台灣最常見的詐騙話術，每年受騙金額超過幾十億。",
              feedbackType: "bad"
            },
            {
              id: "tw_atm_c2_stop",
              text: "🚫 等等——這不就是轉帳嗎？ATM 哪有解除分期？立刻停止！",
              effects: { alertness: 25, information: 20, riskScore: -25 },
              nextSceneId: "tw_atm_end_safe",
              feedback: "✅ 你在最後關頭反應過來了！ATM 只有轉帳、提款、查詢，絕對沒有解除分期。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "tw_atm_s3_check_order",
          type: "result",
          speaker: "system",
          text: "你掛掉電話，打開蝦皮 App 查訂單記錄。",
          visual: {
            type: "safe_result",
            content: "🛍️ 蝦皮訂單記錄\n\n最近三筆：\n• 手機殼 — 已完成，付款方式：一次性\n• 充電線 — 已完成，付款方式：一次性\n• 鍵盤 — 已完成，付款方式：一次性\n\n✅ 沒有任何「自動扣款」或「分期設定」！"
          },
          choices: [
            {
              id: "tw_atm_check_bank",
              text: "📞 再打銀行客服確認一下帳戶",
              effects: { information: 15, alertness: 10, riskScore: -10 },
              nextSceneId: "tw_atm_s4_bank_confirm",
              feedback: "✅ 雙重確認更安心！銀行那邊也會告訴你帳戶沒有問題。",
              feedbackType: "good"
            },
            {
              id: "tw_atm_check_165",
              text: "📵 打 165 舉報這通電話",
              effects: { information: 15, alertness: 15, riskScore: -10 },
              nextSceneId: "tw_atm_s4_165_report",
              feedback: "✅ 165 是台灣反詐騙專線！舉報這個號碼可以保護下一個可能接到同樣電話的人。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "tw_atm_s4_bank_confirm",
          type: "result",
          speaker: "system",
          text: "你打電話給銀行客服，對方查詢後回覆你：帳戶完全正常，沒有任何分期設定，更不會叫你去 ATM 操作。那通電話是詐騙。",
          visual: {
            type: "safe_result",
            content: "🏦 銀行客服確認：\n✅ 帳戶狀態：正常\n✅ 無任何分期或自動扣款設定\n✅ 銀行不會要求客戶去 ATM 解除分期\n\n💡 ATM 只有：提款、轉帳、查詢、繳費\n   沒有「解除分期付款」這個選項！"
          },
          choices: [
            {
              id: "tw_atm_bank_done",
              text: "✅ 搞清楚了，ATM 不能解除分期",
              effects: { alertness: 10, information: 5 },
              nextSceneId: "tw_atm_end_safe",
              feedback: "✅ 記住這個：ATM 只能轉帳和取款。任何要你用 ATM「解除分期」的電話，直接掛斷。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "tw_atm_s4_165_report",
          type: "result",
          speaker: "system",
          text: "你撥打 165，說明情況後，專線人員確認這是典型的「ATM 解除分期詐騙」，並記錄了騙子的電話號碼。",
          visual: {
            type: "safe_result",
            content: "📞 165 反詐騙專線回覆：\n\n✅ 這是典型「解除分期詐騙」\n✅ 已記錄號碼，配合警方調查\n✅ 你的帳戶沒有任何問題\n\n💡 告訴身邊的人：ATM 無法解除任何分期！"
          },
          choices: [
            {
              id: "tw_atm_165_done",
              text: "✅ 謝謝 165，我會提醒朋友注意",
              effects: { alertness: 10, information: 5, socialPressure: -5 },
              nextSceneId: "tw_atm_end_safe",
              feedback: "✅ 舉報詐騙電話是真的很有用！警方靠著這些線索追蹤過很多詐騙集團。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "tw_atm_end_safe",
          type: "ending",
          speaker: "system",
          text: "你沒有去 ATM。你到購物平台查了訂單，根本沒有任何「分期扣款」。銀行也確認帳戶完全正常。那通電話，是詐騙。",
          choices: [{ id: "tw_atm_final_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "tw_atm_end_loss",
          type: "ending",
          speaker: "system",
          text: "操作完成後，對方說「解除成功，謝謝配合」然後掛電話。你盯著帳戶一看——剛才轉出了 38,000 元。所謂「解除分期」，其實就是把錢轉給了騙子。",
          choices: [{ id: "tw_atm_final_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ],

  // ==================== 歐美 ====================
  western_countries: [
    {
      id: "west_fake_immigration_call",
      region: "western_countries",
      title: "簽證危機電話",
      scamType: "假政府人員 / 假移民局詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: ["政府機構不會用電話要求立即付款", "要求用禮品卡或加密貨幣付款", "威脅說不配合就逮捕或遣返", "不讓你掛電話或聯絡任何人"],
      officialChannels: ["直接去學校 International Office", "自己查詢政府官方移民局網站", "聯絡中國或港台使領館"],
      pressureSource: ["簽證焦慮", "遣返威脅", "英文語言壓力", "身份焦慮"],
      scenes: [
        {
          id: "west_immigration_s1",
          type: "phone_call",
          speaker: "system",
          text: "你剛上完課，一個人走回宿舍，手機突然響了，是一個陌生的美國號碼。",
          visual: {
            type: "phone_call",
            caller: "Unknown +1-202-XXX-XXXX",
            content: "Hello, this is the Immigration Office. Your student visa has been suspended due to suspicious activity linked to your Social Security number. You must pay a security deposit of $2,000 immediately to prevent deportation. If you hang up, a warrant will be issued for your arrest."
          },
          choices: [
            {
              id: "west_immigration_c1_pay",
              text: "😰 聽到「deportation」我腿都軟了，按要求付款",
              effects: { money: -70, riskScore: 55, identityAnxiety: -10 },
              nextSceneId: "west_immigration_end_loss",
              feedback: "❌ 政府機構絕對不會通過電話要求立即付款。這種專門利用留學生簽證焦慮的詐騙，每年有成千上萬人受害。",
              feedbackType: "bad"
            },
            {
              id: "west_immigration_c1_keep_talking",
              text: "😟 不敢掛電話，繼續聽對方說",
              effects: { stress: 20, identityAnxiety: 25, riskScore: 25 },
              nextSceneId: "west_immigration_s2_pressure",
              feedback: "⚠️ 繼續聽對方說，他們會繼續施壓。你有權掛電話——掛了不會被逮捕，那只是嚇你的。",
              feedbackType: "bad"
            },
            {
              id: "west_immigration_c1_school_office",
              text: "📵 掛電話，直接去找學校 International Office",
              effects: { information: 35, stress: -15, riskScore: -25 },
              nextSceneId: "west_immigration_s3_office_confirm",
              feedback: "✅ International Office 就是處理這種事的！他們見過太多這類詐騙了。",
              feedbackType: "good"
            },
            {
              id: "west_immigration_c1_official_site",
              text: "🌐 掛電話，自己查政府官方網站確認簽證狀態",
              effects: { information: 30, alertness: 20, riskScore: -20 },
              nextSceneId: "west_immigration_s4_visa_check",
              feedback: "✅ 對！官方移民局網站可以直接查你的簽證狀態，是最直接的核實方式。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "west_immigration_s2_pressure",
          type: "phone_call",
          speaker: "scammer",
          text: "你沒有掛電話，對方開始進一步施壓。",
          visual: {
            type: "phone_call",
            caller: "「移民局人員」",
            content: "Do NOT contact anyone — not your school, not the embassy. Go to the nearest store and buy $2,000 in Google Play gift cards. Read me the numbers now. You have 30 minutes before the warrant goes out."
          },
          choices: [
            {
              id: "west_immigration_pressure_giftcard",
              text: "😰 去便利店買禮品卡，希望這樣能解決",
              effects: { money: -50, riskScore: 50, identityAnxiety: -5 },
              nextSceneId: "west_immigration_end_loss",
              feedback: "❌ 政府部門絕對不收禮品卡！這是詐騙的最明顯特徵之一。你被騙了。",
              feedbackType: "bad"
            },
            {
              id: "west_immigration_pressure_hangup",
              text: "📵 「不能聯絡學校」？這更像詐騙——掛電話，去 International Office",
              effects: { alertness: 25, information: 25, riskScore: -30, identityAnxiety: -10 },
              nextSceneId: "west_immigration_s3_office_confirm",
              feedback: "✅ 對！「不讓你查證」本身就是最大的紅旗。真正的政府部門不怕你核實。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "west_immigration_s3_office_confirm",
          type: "result",
          speaker: "system",
          text: "你找到了 International Office，工作人員一聽你描述，立刻認出了這個詐騙類型。",
          visual: {
            type: "safe_result",
            content: "🏫 International Office 確認：\n\n✅ 你的簽證狀態：完全正常\n✅ 政府不用電話要求立即付款\n✅ 真正的移民局只通過書面正式通知聯繫學生\n✅ 「不能聯絡學校」是詐騙的標誌\n\n這類詐騙他們每學期都會接到學生來報告。"
          },
          choices: [
            {
              id: "west_imm_ask_what_todo",
              text: "🤔 我應該怎麼舉報這通電話？",
              effects: { information: 15, alertness: 10 },
              nextSceneId: "west_immigration_s4_report",
              feedback: "✅ 主動舉報可以幫助保護下一個可能接到同樣電話的同學。",
              feedbackType: "good"
            },
            {
              id: "west_imm_check_visa_status",
              text: "🌐 讓 International Office 幫我看一下簽證頁面",
              effects: { information: 10, identityAnxiety: -15 },
              nextSceneId: "west_immigration_s4_visa_check",
              feedback: "✅ 親眼看到簽證狀態正常，可以徹底消除那種說不清楚的焦慮。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "west_immigration_s4_report",
          type: "result",
          speaker: "system",
          text: "International Office 的工作人員告訴你幾個舉報渠道，並幫你記下了騙子的電話號碼作為證據。",
          visual: {
            type: "safe_result",
            content: "🛡️ 美國舉報渠道：\n• FTC reportfraud.ftc.gov\n• IC3.gov 網絡犯罪舉報\n• 向學校 Campus Safety 報告\n• 聯絡使領館（若涉及護照/簽證問題）\n\n💡 詐騙電話號碼是重要證據，截圖保存"
          },
          choices: [
            {
              id: "west_imm_report_done",
              text: "✅ 舉報完成，謝謝 International Office",
              effects: { alertness: 10, identityAnxiety: -10, riskScore: -5 },
              nextSceneId: "west_immigration_end_safe",
              feedback: "✅ 你處理得非常好！International Office 是海外學生最重要的資源，隨時可以去找他們。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "west_immigration_s4_visa_check",
          type: "result",
          speaker: "system",
          text: "工作人員幫你登入官方移民局系統查詢。螢幕上顯示你的簽證完全有效，沒有任何問題。",
          visual: {
            type: "safe_result",
            content: "📋 官方移民局系統：\n\nStudent Visa Status: ✅ ACTIVE\nExpiry Date: 正常有效\nApplication History: No issues\n\n政府從不通過電話要求付款。\n真正的移民問題只通過書面信件或官方系統通知。"
          },
          choices: [
            {
              id: "west_imm_visa_ok",
              text: "😌 親眼看到才放心，謝謝！",
              effects: { identityAnxiety: -20, stress: -15, information: 10 },
              nextSceneId: "west_immigration_end_safe",
              feedback: "✅ 簽證焦慮是騙子針對留學生的主要攻擊點。有問題去官方渠道查，不要聽電話裡的說法。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "west_immigration_end_safe",
          type: "ending",
          speaker: "system",
          text: "你聯絡了 International Office，確認簽證完全正常。你還弄清楚了舉報渠道，成功保護了自己。那通電話是假移民局詐騙，每年騙走海外學生幾千萬美元。",
          choices: [{ id: "west_imm_final_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "west_immigration_end_loss",
          type: "ending",
          speaker: "system",
          text: "你按要求付了款，但簽證當然沒有任何問題——因為從一開始就沒問題。你的錢進了騙子的口袋。政府部門永遠不會通過電話要求立即付款，更不會接受禮品卡。",
          choices: [{ id: "west_imm_final_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ],

  // ==================== 東南亞 ====================
  southeast_asia: [
    {
      id: "sea_hotel_payment_problem",
      region: "southeast_asia",
      title: "酒店訂單異常",
      scamType: "旅遊平台釣魚 / 信用卡資料詐騙",
      suitableIdentities: ["mainland_student", "hmt_student"],
      redFlags: ["訊息不是從原訂房平台官方 App 發出", "連結域名是「hotel-confirm.net」而不是 booking.com", "要求重新輸入信用卡完整資料包括 CVV", "剛到異地的焦慮和「30 分鐘」限時壓力"],
      officialChannels: ["打開原訂房 App 查看訂單狀態", "直接致電酒店官方電話確認", "直接前往酒店前台辦理"],
      pressureSource: ["剛到陌生地方", "擔心沒有住宿", "語言和交通壓力"],
      scenes: [
        {
          id: "sea_hotel_s1",
          type: "message",
          speaker: "system",
          text: "你剛踏出曼谷機場，拉著行李還沒站穩，手機就響了。",
          visual: {
            type: "sms",
            sender: "Booking Notification",
            content: "Your hotel payment has failed. Please complete payment again within 30 minutes, or your room reservation will be automatically cancelled. Tap here to re-enter payment details.",
            link: "https://booking-payment-verify.hotel-confirm.net/retry"
          },
          choices: [
            {
              id: "sea_hotel_c1_pay_link",
              text: "😰 剛到！沒有房間怎麼辦？點連結重新付",
              effects: { riskScore: 35, stress: -5, information: -10 },
              nextSceneId: "sea_hotel_s2_fake_payment",
              feedback: "⚠️ 人剛到陌生地方最容易被這類訊息騙到——因為你慌了。但發訊的不是 Booking.com 官方。",
              feedbackType: "bad"
            },
            {
              id: "sea_hotel_c1_booking_app",
              text: "📱 先不急，打開 Booking.com App 看訂單狀態",
              effects: { information: 30, alertness: 15, riskScore: -20 },
              nextSceneId: "sea_hotel_s3_check_result",
              feedback: "✅ 對！官方 App 看訂單才是正確做法，短訊連結一律不點。",
              feedbackType: "good"
            },
            {
              id: "sea_hotel_c1_call_hotel",
              text: "📞 致電酒店官方電話，直接問他們有沒有收到預訂",
              effects: { information: 35, stress: -15, riskScore: -25 },
              nextSceneId: "sea_hotel_s3_check_result",
              feedback: "✅ 直接聯絡酒店是最直接的核實！他們有你的預訂記錄。",
              feedbackType: "good"
            },
            {
              id: "sea_hotel_c1_ignore",
              text: "🚶 不理會訊息，直接搭計程車去酒店",
              effects: { information: 15, stress: 5, riskScore: -5 },
              nextSceneId: "sea_hotel_s4_arrive",
              feedback: "✅ 直接去前台是最安全的！酒店有你的預訂記錄，假訊息騙不走你的房間。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "sea_hotel_s2_fake_payment",
          type: "webpage",
          speaker: "system",
          text: "頁面打開了，設計得很像 Booking.com，但網址是「hotel-confirm.net」。頁面要你重新輸入信用卡資料進行「驗證」。",
          visual: {
            type: "warning_page",
            content: "⚠️ 網址：hotel-confirm.net（假的！）\n真正官方域名：booking.com 或 agoda.com\n\n頁面要求：\n• 信用卡號碼（16 位）← 洩露了很麻煩\n• 到期日\n• CVV 安全碼 ← 高風險！\n• OTP 一次性驗證碼 ← 填了等於直接授權刷卡"
          },
          choices: [
            {
              id: "sea_hotel_c2_enter_card",
              text: "💳 填完信用卡資料，確認付款",
              effects: { money: -60, riskScore: 50, information: -20 },
              nextSceneId: "sea_hotel_end_loss",
              feedback: "❌ 你的信用卡資料被盜了——卡號 + CVV + OTP，騙子可以用這些在全世界任何地方消費。",
              feedbackType: "bad"
            },
            {
              id: "sea_hotel_c2_stop",
              text: "🔍 等等，這個網址不對。關掉頁面，打開 Agoda App 確認",
              effects: { alertness: 25, information: 20, riskScore: -25 },
              nextSceneId: "sea_hotel_end_safe",
              feedback: "✅ 在最緊張的時候（剛到異國）還能注意到網址不對，這個反應非常了不起。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "sea_hotel_s3_check_result",
          type: "result",
          speaker: "system",
          text: "你打開 Booking.com App，查看訂單。一切正常——付款已成功，房間已確認，今天可以入住。那條「付款失敗」的訊息是假的。",
          visual: {
            type: "safe_result",
            content: "🏨 Booking.com 訂單狀態：\n\n✅ 付款狀態：已成功\n✅ 房間狀態：已確認\n✅ 入住日期：今天\n\n那條「付款失敗」訊息不是官方發的。\n在陌生地方遇到可疑訊息，先查 App，不要點連結。"
          },
          choices: [
            {
              id: "sea_hotel_check_go",
              text: "🚕 確認沒問題了，打車去酒店",
              effects: { stress: -15, information: 5 },
              nextSceneId: "sea_hotel_s4_arrive",
              feedback: "✅ 核實了就放心出發！這個習慣在旅行中非常重要。",
              feedbackType: "good"
            },
            {
              id: "sea_hotel_check_report",
              text: "⚠️ 順手把這條詐騙連結舉報給 Booking.com",
              effects: { alertness: 10, information: 5 },
              nextSceneId: "sea_hotel_s4_report",
              feedback: "✅ 舉報假冒訂房平台的詐騙連結，可以讓平台封鎖這些域名，保護其他旅客。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "sea_hotel_s4_arrive",
          type: "result",
          speaker: "system",
          text: "你抵達酒店，前台工作人員微笑著確認了你的預訂，順利辦理入住。你的旅行正式開始了。",
          visual: {
            type: "safe_result",
            content: "🏨 入住成功！\n\n前台：訂單有效，付款已收到。\n\n💡 旅行中遇到可疑訊息的原則：\n• 先查官方 App，不點陌生連結\n• 酒店問題直接去前台或打官方電話\n• 出發前把酒店官方電話存進手機"
          },
          choices: [
            {
              id: "sea_hotel_arrive_done",
              text: "😊 完美！記住了，旅行中越急越要停下來查",
              effects: { stress: -10, information: 5, localFamiliarity: 5 },
              nextSceneId: "sea_hotel_end_safe",
              feedback: "✅ 在陌生環境遇到緊急訊息，先停一下用官方渠道核實，是保護自己最好的方式。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "sea_hotel_s4_report",
          type: "result",
          speaker: "system",
          text: "你在 Booking.com App 的「幫助中心」找到了舉報詐騙的頁面，填寫了假網址和詐騙短訊截圖。",
          visual: {
            type: "safe_result",
            content: "🛡️ 舉報渠道：\n• Booking.com 幫助中心 → 舉報詐騙\n• Agoda 客服 → 回報可疑訊息\n• 當地觀光警察（Tourist Police）\n• 大使館（護照遺失/緊急情況）\n\n你的舉報幫助平台封鎖這個假網站！"
          },
          choices: [
            {
              id: "sea_hotel_report_done",
              text: "✅ 舉報完成，現在去酒店入住",
              effects: { alertness: 10, information: 5, riskScore: -5 },
              nextSceneId: "sea_hotel_end_safe",
              feedback: "✅ 識別 → 核實 → 舉報，你保護了自己，也幫助了其他旅客。",
              feedbackType: "good"
            }
          ]
        },
        {
          id: "sea_hotel_end_safe",
          type: "ending",
          speaker: "system",
          text: "你通過官方 App 確認訂單完全正常，順利入住了酒店。那條「付款失敗」訊息是詐騙——你沒有被騙到，旅行可以繼續了。",
          choices: [{ id: "sea_hotel_final_safe", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "good" }]
        },
        {
          id: "sea_hotel_end_loss",
          type: "ending",
          speaker: "system",
          text: "幾分鐘後，你的手機響起了一連串消費通知——1,200 美元、680 美元、340 美元……都是未授權消費。你的信用卡資料已經被騙子賣出去了。立刻聯絡銀行凍結卡片。",
          choices: [{ id: "sea_hotel_final_loss", text: "查看結局", effects: {}, nextSceneId: "__ending__", feedback: "", feedbackType: "bad" }]
        }
      ]
    }
  ]
};
