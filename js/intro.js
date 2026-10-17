/* ══════════════════════════════════════════════════════════════
   intro.js — PC → Opening... → CMD "hello world" → Hello-World globe
   ══════════════════════════════════════════════════════════════ */
const Intro = (() => {
  const W = 1600, H = 900;
  const SX0 = 560, SY0 = 170, SX1 = 1040, SY1 = 450;
  const CX = (SX0 + SX1) / 2, CY = (SY0 + SY1) / 2;
  const Z_MAX = 3.65;

  const DESK = "#141925", STEEL = "#3a4560", WALL_T = "#0d1322", WALL_B = "#05070d";
  const BLUE = "#0b46c8", LED_ON = "#33e0ff";

  // timeline (seconds)
  const T_LED = 0.9, T_ON0 = 1.2, T_ON1 = 2.0, T_Z0 = 2.3, T_Z1 = 3.7;
  const T_P0 = 3.7, T_P1 = 5.2, T_CMD = 5.5, T_TYPE = 6.1, CHAR_DT = 0.1;
  const GROW = 2.2, HOLD = 2.6, EXIT = 1.1, SPIN = 22;

  const GREETINGS = [
    "Hello World", "Hola Mundo", "Bonjour le monde", "Hallo Welt", "Ciao mondo",
    "Olá Mundo", "Привет, мир", "こんにちは世界", "你好，世界", "안녕 세상",
    "नमस्ते दुनिया", "مرحبا بالعالم", "سلام دنیا", "Merhaba Dünya", "Hej världen",
    "Hei maailma", "Hallo wereld", "Witaj świecie", "Ahoj světe", "Helló világ",
    "Salut lume", "Γειά σου Κόσμε", "Здраво свете", "Pozdrav svijete",
    "Sveikas pasauli", "Tere maailm", "Xin chào thế giới", "Halo Dunia",
    "Habari dunia", "Sannu duniya", "Salam dunya", "Hej verden", "Halló heimur",
    "Përshëndetje botë", "Kamusta mundo", "Сайн уу дэлхий", "สวัสดีชาวโลก",
    "Здравей свят", "Привіт, світе", "שלום עולם", "வணக்கம் உலகம்",
    "హలో ప్రపంచం", "ওহে বিশ্ব", "Kia ora te ao", "Aloha honua", "Saluton mondo",
    "Salve munde", "Hallo Wêreld", "Dia duit domhan", "Helo Byd", "Sawubona mhlaba",
    "Sveika pasaule", "Pozdravljen svet", "Kaixo mundua", "Selam Dünya",
    "ሰላም ልዑል", "Salamu dunia", "Mhoro nyika"
  ];

  // rough continents (lon, lat)
  const CONTINENTS = [
    [[-168,66],[-160,71],[-140,70],[-120,72],[-95,72],[-80,68],[-62,60],[-55,52],[-66,45],[-70,42],[-76,35],[-81,30],[-80,25],[-82,29],[-90,29],[-97,26],[-97,20],[-90,16],[-83,9],[-78,8],[-86,14],[-95,16],[-105,20],[-112,30],[-117,33],[-124,40],[-124,48],[-130,55],[-140,60],[-152,58],[-165,60]],
    [[-50,60],[-42,60],[-20,70],[-20,80],[-40,83],[-60,80],[-72,77],[-55,68]],
    [[-78,8],[-60,10],[-50,0],[-35,-5],[-38,-15],[-48,-26],[-58,-38],[-65,-42],[-68,-55],[-74,-50],[-72,-35],[-70,-18],[-76,-12],[-81,-5],[-80,1]],
    [[-17,21],[-10,30],[-5,36],[10,37],[20,32],[32,31],[34,28],[43,12],[51,12],[40,-3],[40,-15],[35,-25],[20,-35],[17,-30],[12,-17],[13,-5],[9,4],[-8,5],[-17,14]],
    [[-9,37],[-9,43],[-1,44],[-4,48],[2,51],[8,54],[8,57],[10,59],[5,62],[14,67],[25,71],[40,68],[44,66],[60,69],[70,73],[80,73],[100,78],[115,74],[140,73],[160,70],[180,69],[180,65],[172,60],[163,58],[156,51],[156,61],[143,59],[136,54],[141,52],[135,43],[129,35],[127,39],[122,40],[119,35],[122,30],[117,23],[108,21],[106,18],[109,12],[105,9],[100,13],[100,6],[103,1],[98,8],[98,16],[94,17],[92,22],[87,21],[80,15],[77,8],[73,17],[70,22],[66,25],[57,25],[59,22],[57,18],[52,16],[45,13],[43,15],[39,22],[35,28],[34,31],[36,36],[30,36],[26,38],[26,41],[23,40],[22,37],[20,40],[19,42],[13,45],[17,41],[16,38],[12,38],[13,42],[10,44],[3,43],[0,40],[-2,37],[-6,36]],
    [[-5,50],[1,51],[0,54],[-2,58],[-5,58],[-3,54]],
    [[130,31],[140,35],[142,40],[140,45],[145,44],[141,38],[135,34]],
    [[114,-22],[122,-18],[130,-12],[137,-12],[142,-11],[146,-19],[153,-26],[150,-37],[140,-38],[132,-32],[115,-34]],
    [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
    [[109,-2],[117,7],[119,1],[116,-4]],
    [[95,5],[98,4],[106,-6],[102,-5]],
    [[131,-1],[141,-3],[150,-10],[141,-9]],
    [[172,-35],[178,-38],[174,-41],[167,-46],[172,-42]]
  ];
  const BOXES = CONTINENTS.map(c => {
    const xs = c.map(p => p[0]), ys = c.map(p => p[1]);
    return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  });
  const LAND = ["#3fcf5a", "#7ed957", "#c8dc3a", "#f2c53d", "#f39a3a"];
  const OCEAN = ["#2e72ea", "#3b86f5", "#2a63d6"];

  // ── helpers ──
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const ease = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
  const easeOut = x => 1 - Math.pow(1 - clamp01(x), 3);
  const easeIn = x => Math.pow(clamp01(x), 3);
  const rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => {
    t = clamp01(t);
    const A = Array.isArray(a) ? a : rgb(a), B = Array.isArray(b) ? b : rgb(b);
    return A.map((v, i) => v + (B[i] - v) * t);
  };
  const css = c => Array.isArray(c) ? `rgb(${c.map(v => Math.round(v)).join(",")})` : c;

  function isLand(lat, lon) {
    if (lat < -66) return true;
    for (let k = 0; k < CONTINENTS.length; k++) {
      const [x0, x1, y0, y1] = BOXES[k];
      if (lon < x0 || lon > x1 || lat < y0 || lat > y1) continue;
      const p = CONTINENTS[k]; let inside = false;
      for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
        const [xi, yi] = p[i], [xj, yj] = p[j];
        if ((yi > lat) !== (yj > lat) && lon < (xj - xi) * (lat - yi) / (yj - yi) + xi) inside = !inside;
      }
      if (inside) return true;
    }
    return false;
  }

  // ── canvas ──
  let cv, ctx, dpr = 1, cw = 0, ch = 0, s = 1, ox = 0, oy = 0;
  let globe = null, t0 = 0, raf = 0, done = false, onDone = null, startOffset = 0;
  let user = "user", command = "hello world";
  let T_ENTER = 0;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cw = Math.floor(innerWidth * dpr); ch = Math.floor(innerHeight * dpr);
    cv.width = cw; cv.height = ch;
    s = Math.min(cw / W, ch / H);
    ox = (cw - W * s) / 2; oy = (ch - H * s) / 2;
    globe = null;
  }

  // world → screen transform with zoom z and pan k
  function view(z) {
    const k = (z - 1) / (Z_MAX - 1);
    const cx = CX + (W / 2 - CX) * k, cy = CY + (H / 2 - CY) * k;
    ctx.setTransform(s * z, 0, 0, s * z, ox + (cx - CX * z) * s, oy + (cy - CY * z) * s);
  }
  const rect = (x0, y0, x1, y1, fill, stroke, lw) => {
    if (fill) { ctx.fillStyle = css(fill); ctx.fillRect(x0, y0, x1 - x0, y1 - y0); }
    if (stroke) { ctx.strokeStyle = css(stroke); ctx.lineWidth = lw || 1; ctx.strokeRect(x0, y0, x1 - x0, y1 - y0); }
  };
  const oval = (x0, y0, x1, y1, fill, stroke, lw) => {
    ctx.beginPath();
    ctx.ellipse((x0 + x1) / 2, (y0 + y1) / 2, Math.abs(x1 - x0) / 2, Math.abs(y1 - y0) / 2, 0, 0, Math.PI * 2);
    if (fill) { ctx.fillStyle = css(fill); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = css(stroke); ctx.lineWidth = lw || 1; ctx.stroke(); }
  };
  const poly = (pts, fill, stroke, lw) => {
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    if (fill) { ctx.fillStyle = css(fill); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = css(stroke); ctx.lineWidth = lw || 1; ctx.stroke(); }
  };

  // ── scene 1: the PC ──
  function drawPC(z, g, screenOn, led, text, progress) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = WALL_B; ctx.fillRect(0, 0, cw, ch);
    view(z);
    for (let i = 0; i < 12; i++)
      rect(-3000, i === 0 ? -3000 : i * 640 / 12, 4000, (i + 1) * 640 / 12 + 1, mix(WALL_B, WALL_T, i / 11));
    if (g > 0) {
      const grd = ctx.createRadialGradient(CX, CY, 50, CX, CY, 700);
      grd.addColorStop(0, `rgba(30,70,170,${0.45 * g})`); grd.addColorStop(1, "rgba(30,70,170,0)");
      ctx.fillStyle = grd; ctx.fillRect(-3000, -3000, 7000, 3640);
    }
    // desk
    rect(-3000, 640, 4000, 3000, DESK);
    rect(-3000, 640, 4000, 646, mix(DESK, STEEL, 0.45 + g * 0.25));
    for (let i = 0; i < 5; i++) rect(-3000, 660 + i * 40, 4000, 662 + i * 40, mix(DESK, STEEL, 0.08 + g * 0.05));
    // tower
    rect(300, 300, 470, 640, "#0e121c", "#2a3147", 2);
    rect(310, 310, 460, 630, "#0b0f18", "#1c2338", 1);
    for (let i = 0; i < 7; i++) rect(325, 330 + i * 14, 445, 336 + i * 14, "#141a28");
    oval(386, 548, 414, 576, "#0a0d16", mix(STEEL, LED_ON, led ? 0.8 : 0), 2);
    oval(395, 598, 405, 608, led ? LED_ON : "#1c2233");
    if (led) { ctx.shadowColor = LED_ON; ctx.shadowBlur = 14; oval(396, 599, 404, 607, LED_ON); ctx.shadowBlur = 0; }
    // stand
    poly([[775, 470], [825, 470], [835, 620], [765, 620]], "#0d111b", "#252d44", 2);
    poly([[690, 620], [910, 620], [930, 640], [670, 640]], "#121726", "#252d44", 2);
    // monitor
    rect(540, 150, 1060, 470, "#10141f", "#2a3350", 3);
    oval(1040, 456, 1046, 462, mix("#1c2233", LED_ON, g));
    if (screenOn) {
      rect(SX0, SY0, SX1, SY1, mix("#05070d", BLUE, g));
      if (text) {
        ctx.fillStyle = css(mix("#05070d", "#cfe3ff", g));
        ctx.font = `600 26px "Segoe UI", system-ui, sans-serif`;
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(text, CX, CY - 12);
      }
      if (progress != null) {
        rect(CX - 110, CY + 20, CX + 110, CY + 30, mix("#05070d", "#06235f", g), mix("#05070d", "#5b8bea", g), 1);
        if (progress > 0) rect(CX - 108, CY + 22, CX - 108 + 216 * progress, CY + 28, mix("#05070d", "#8fd0ff", g));
      }
    } else {
      rect(SX0, SY0, SX1, SY1, "#05070d");
      poly([[SX0, SY0], [SX0 + 160, SY0], [SX0, SY0 + 120]], "#080b14");
    }
    // keyboard
    poly([[600, 660], [1000, 660], [1030, 728], [570, 728]], "#0e121c", "#2a3147", 2);
    for (let r = 0; r < 4; r++) {
      const y0 = 668 + r * 14, a0 = (y0 - 660) / 68, a1 = (y0 + 10 - 660) / 68;
      const l0 = 608 - 30 * a0, r0 = 992 + 30 * a0, l1 = 608 - 30 * a1, r1 = 992 + 30 * a1;
      for (let c = 0; c < 14; c++) {
        const a = c / 14, b = (c + 0.85) / 14;
        poly([[l0 + (r0 - l0) * a, y0], [l0 + (r0 - l0) * b, y0], [l1 + (r1 - l1) * b, y0 + 10], [l1 + (r1 - l1) * a, y0 + 10]],
          mix("#131827", "#1d2a4a", g * 0.5), "#252d44", 1);
      }
    }
    oval(1080, 668, 1114, 718, "#131827", "#252d44", 2);
  }

  // full-screen "Opening..." after the zoom
  function drawOpening(text, progress) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const grd = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, Math.max(cw, ch) * 0.75);
    grd.addColorStop(0, "#0d4fd6"); grd.addColorStop(1, "#0838a8");
    ctx.fillStyle = grd; ctx.fillRect(0, 0, cw, ch);
    const u = Math.min(cw, ch) / 900;
    ctx.fillStyle = "#cfe3ff";
    ctx.font = `600 ${Math.round(80 * u)}px "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, cw / 2, ch / 2 - 40 * u);
    const bw = Math.min(cw * 0.6, 760 * u), bh = 34 * u;
    ctx.fillStyle = "#06235f"; ctx.fillRect(cw / 2 - bw / 2, ch / 2 + 60 * u, bw, bh);
    ctx.strokeStyle = "#5b8bea"; ctx.lineWidth = 2 * u; ctx.strokeRect(cw / 2 - bw / 2, ch / 2 + 60 * u, bw, bh);
    ctx.fillStyle = "#8fd0ff"; ctx.fillRect(cw / 2 - bw / 2 + 5 * u, ch / 2 + 65 * u, (bw - 10 * u) * progress, bh - 10 * u);
  }

  // ── scene 2: CMD ──
  function drawCmd(typed, cursor, alpha = 1) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cw, ch);
    ctx.globalAlpha = alpha;
    const u = Math.max(0.6, Math.min(cw / 1600, ch / 900) * 1.0) * (cw < ch ? 1.4 : 1);
    const m = 10 * dpr;
    ctx.fillStyle = "#0c0c0c"; ctx.fillRect(m, m, cw - 2 * m, ch - 2 * m);
    ctx.strokeStyle = "#2a6ef0"; ctx.lineWidth = 3 * dpr; ctx.strokeRect(m, m, cw - 2 * m, ch - 2 * m);
    const tb = 40 * u;
    ctx.fillStyle = "#1f1f1f"; ctx.fillRect(m + 2, m + 2, cw - 2 * m - 4, tb);
    ctx.font = `${Math.round(15 * u)}px "Segoe UI", system-ui, sans-serif`;
    ctx.fillStyle = "#e6e6e6"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.fillText("C:\\WINDOWS\\system32\\cmd.exe", m + 44 * u, m + 2 + tb / 2);
    ctx.strokeStyle = "#cfcfcf"; ctx.lineWidth = 1 * dpr;
    ctx.strokeRect(m + 14 * u, m + 2 + tb / 2 - 8 * u, 20 * u, 16 * u);
    ctx.textAlign = "center";
    ["✕", "☐", "─"].forEach((c, i) => ctx.fillText(c, cw - m - 30 * u - i * 52 * u, m + 2 + tb / 2));
    ctx.textAlign = "left";
    ctx.font = `bold ${Math.round(20 * u)}px Consolas, "Cascadia Mono", "Courier New", monospace`;
    const line = `C:\\Users\\${user}> ` + typed;
    const y = m + tb + 34 * u;
    ctx.fillStyle = "#e8e8e8"; ctx.fillText(line, m + 22 * u, y);
    if (cursor) {
      const w = ctx.measureText(line).width;
      ctx.fillRect(m + 22 * u + w + 3, y - 11 * u, 11 * u, 22 * u);
    }
    ctx.globalAlpha = 1;
  }

  // ── scene 3: the globe ──
  function buildGlobe() {
    const R = Math.min(cw, ch) * (cw < ch ? 0.45 : 0.37);
    const gx = cw / 2, gy = ch / 2 + Math.min(cw, ch) * 0.04;
    const fpx = Math.max(7, R * 0.05);
    const font = `bold ${fpx}px Consolas, "Cascadia Mono", "Courier New", monospace`;
    ctx.font = font;
    const lh = fpx * 1.18, gap = fpx * 0.7, widths = {};
    const width = w => widths[w] ?? (widths[w] = ctx.measureText(w).width);
    const items = [];
    const rows = Math.max(1, Math.floor(2 * R / lh));
    for (let row = 0; row < rows; row++) {
      const y = -R + lh * (row + 0.5) + (2 * R - rows * lh) / 2;
      const half = Math.sqrt(Math.max(0, R * R - y * y)) * 0.97;
      if (half < fpx * 2) continue;
      let idx = (row * 7) % GREETINGS.length, used = 0; const words = [];
      while (true) {
        const w = GREETINGS[idx % GREETINGS.length];
        const need = width(w) + (words.length ? gap : 0);
        if (used + need > 2 * half) break;
        words.push(w); used += need; idx++;
      }
      if (!words.length) { words.push("Hi"); used = width("Hi"); }
      const lat = Math.asin(clamp01((-y / R + 1) / 2) * 2 - 1) * 180 / Math.PI;
      const cosLat = Math.max(1e-6, Math.cos(lat * Math.PI / 180));
      let x = -used / 2;
      for (const w of words) {
        const xc = x + width(w) / 2;
        const lon0 = Math.asin(Math.max(-1, Math.min(1, xc / (R * cosLat)))) * 180 / Math.PI;
        const shade = Math.sqrt(Math.max(0, 1 - (xc * xc + y * y) / (R * R)));
        items.push({ w, x: xc, y, lat, lon0, shade, dist: Math.hypot(xc, y) / R, i: items.length });
        x += width(w) + gap;
      }
    }
    return { items, font, gx, gy, R };
  }

  function drawGlobe(rot, grow, exitP) {
    if (!globe) globe = buildGlobe();
    drawCmd(command, false, 1 - easeIn(exitP));
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const sc = 1 + easeIn(exitP) * 1.6;              // globe flies toward you while fading
    ctx.globalAlpha = 1 - easeIn(exitP);
    ctx.font = globe.font; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const it of globe.items) {
      if (it.dist > grow * 1.02) continue;
      const lon = ((it.lon0 - rot + 540) % 360) - 180;
      let base;
      if (isLand(it.lat, lon)) {
        const n = (Math.sin((it.lat * 3 + lon * 2) * Math.PI / 180) + Math.sin((lon * 5 - it.lat * 4) * Math.PI / 180)) / 2;
        const v = 0.45 + 0.3 * n + (Math.abs(it.lat) - 30) / 110;
        base = LAND[Math.round(clamp01(v) * (LAND.length - 1))];
      } else base = OCEAN[it.i % OCEAN.length];
      ctx.fillStyle = css(mix(base, "#000814", (1 - it.shade) * 0.55));
      ctx.fillText(it.w, globe.gx + it.x * sc, globe.gy + it.y * sc);
    }
    ctx.globalAlpha = 1;
  }

  // ── loop ──
  function frame(now) {
    if (done) return;
    const t = (now - t0) / 1000 + startOffset;
    if (t < T_CMD) {
      const g = ease((t - T_ON0) / (T_ON1 - T_ON0));
      const z = 1 + (Z_MAX - 1) * ease((t - T_Z0) / (T_Z1 - T_Z0));
      const dots = ".".repeat(1 + Math.floor(t * 3) % 3);
      const prog = t >= T_P0 ? easeOut((t - T_P0) / (T_P1 - T_P0)) : (g > 0 ? 0 : null);
      if (t >= T_Z1) drawOpening("Opening" + dots, prog);
      else drawPC(z, g, t >= T_ON0, t >= T_LED, g > 0 ? "Opening" + dots : null, prog);
      // fade to black before the CMD
      const f = clamp01((t - (T_CMD - 0.3)) / 0.3);
      if (f > 0) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = `rgba(0,0,0,${f})`; ctx.fillRect(0, 0, cw, ch); }
    } else if (t < T_ENTER) {
      const n = t >= T_TYPE ? Math.floor((t - T_TYPE) / CHAR_DT) : 0;
      const typing = t >= T_TYPE && t < T_TYPE + command.length * CHAR_DT;
      drawCmd(command.slice(0, Math.max(0, n)), typing || Math.floor(t * 2) % 2 === 0);
    } else {
      const tg = t - T_ENTER;
      const grow = easeOut(tg / GROW);
      const exitP = clamp01((tg - GROW - HOLD) / EXIT);
      drawGlobe(-tg * SPIN + 40, grow, exitP);
      if (exitP >= 1) { finish(); return; }
    }
    raf = requestAnimationFrame(frame);
  }

  function finish() {
    if (done) return;
    done = true;
    cancelAnimationFrame(raf);
    cv.classList.add("fade");
    if (onDone) onDone();
  }

  return {
    start(opts, cb) {
      cv = document.getElementById("intro-canvas");
      ctx = cv.getContext("2d");
      user = opts.user || "user";
      command = opts.command || "hello world";
      T_ENTER = T_TYPE + command.length * CHAR_DT + 0.35;
      startOffset = opts.mode === "globe" ? T_ENTER : 0;
      onDone = cb;
      resize();
      addEventListener("resize", resize);
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    },
    skip: finish,
    get done() { return done; }
  };
})();
