/* ══════════════════════════════════════════════════════════════
   ⚙️  CONFIG — عدّل كل شي من هنا فقط
   ══════════════════════════════════════════════════════════════ */
const CONFIG = {

  /* ── الاسم ── */
  name: "3li",
  nameBadge: "",               // إيموجي بجانب الاسم ("" لإخفائه)

  /* ── عنوان التبويب (يكتب حرف حرف) + الشعار ── */
  tab: {
    texts: ["@3li about.me"],             // تقدر تحط أكثر من نص: ["@3li", "welcome"]
    typeSpeed: 260,              // سرعة كتابة الحرف (ms)
    pause: 1800                  // وقت الانتظار قبل المسح
  },
  logo: "assets/logo.png",       // الشعار (يطلع في التبويب)

  /* ── المقدمة (الكمبيوتر ← CMD ← الكوكب ← اسمك) ── */
  intro: {
    enabled: true,
    mode: "full",                // "full" = من الكمبيوتر | "globe" = الكوكب مباشرة
    user: "3li",                 // الاسم في سطر CMD:  C:\Users\3li>
    command: "hello world",
    enterText: "click to enter"
  },

  /* ── فيديو الخلفية ── */
  video: {
    src: "assets/background.mp4", // حط ملف الفيديو بهذا الاسم داخل مجلد assets
    volume: 0.5,                  // الصوت الابتدائي من 0 إلى 1
    darkness: 0.45                // تغميق الخلفية من 0 إلى 1
  },

  /* ── المربع (اكتب فيه اللي تبي) ── */
  box: {
    text: "الحمدلله",
    image: "https://files.catbox.moe/rb9sjl.png",                   // أو حط صورة بدل النص: "assets/box.png"
    background: "#070707",
    color: "#2a2a2a"
  },

  /* ── النبذة (كل سطر لحاله) ── */
  bio: [
    "we are in a time when the respected",
    "regrets his respect for some people"
  ],
  bioTyping: true,               // تنكتب حرف حرف

  location: "KUWAIT",            // "" لإخفائه

  /* ── عدد الزوار ──
     mode: "auto"   = عدّاد حقيقي + start (الرقم اللي تبدأ منه)
     mode: "manual" = يعرض الرقم اللي تكتبه في manual بالضبط        */
  views: {
    mode: "auto",
    start: 0,
    manual: 321,
    namespace: "3li-aboutme",    // غيّره لاسم خاص فيك (حروف إنجليزية وأرقام و -)
    key: "views"
  },

  /* ── حساب الديسكورد ──
     1) ادخل سيرفر Lanyard:  https://discord.gg/lanyard
     2) Discord ← Settings ← Advanced ← Developer Mode
     3) اضغط على حسابك ← Copy User ID وحطه هنا                         */
  discord: {
    id: "1035260742498263131",                      // مثال: "123456789012345678"
    idleText: "currently doing nothing"
  },

  /* ── روابط/أيقونات (اختياري) ──
     { url: "https://...", icon: "assets/icons/x.png", title: "X" }   */
  links: [],

  snow: true,                    // ثلج متساقط
  accent: "#757475"              // اللون المميز
};
